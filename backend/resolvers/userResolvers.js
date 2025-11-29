// src/resolvers/userResolvers.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken, verifyToken } from "../utils/jwt.js";
import { deviceHash } from "../utils/device.js";
import Session from "../models/Session.js";

const COOKIE_NAME = "refreshToken";

export default {
  Query: {
    me: async (_parent, _args, { user }) => {
      if (!user) return null;
      return User.findById(user.id).select("-password");
    },
    // ...users query as before
  },

  Mutation: {
    register: async (_parent, { input }) => {
      const { name, email, password } = input;
      const existing = await User.findOne({ email });
      if (existing) throw new Error("Email already registered");
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed });
      const access = signAccessToken({ id: user._id, role: user.role });
      return { id: user._id, name: user.name, email: user.email, role: user.role, token: access };
    },

    login: async (_parent, { input }, { req, res }) => {
      const { email, password } = input;
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid credentials");
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) throw new Error("Invalid credentials");

      // Create access + refresh tokens
      const accessToken = signAccessToken({ id: user._id, role: user.role });
      const refreshToken = signRefreshToken({ id: user._id });

      // Build device fingerprint
      const ua = req.headers["user-agent"] || "";
      const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "";
      const dHash = deviceHash({ userAgent: ua, ip });

      // Save session in DB (for admin prefer stricter handling)
      const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000); // 7 days
      await Session.create({
        user: user._id,
        refreshToken,
        deviceHash: dHash,
        userAgent: ua,
        ip,
        expiresAt
      });

      // Set HttpOnly secure cookie (refresh token)
      const isProd = process.env.NODE_ENV === "production";
      const cookieParts = [
        `${COOKIE_NAME}=${refreshToken}`,
        `Path=/; HttpOnly`,
        `Max-Age=${7 * 24 * 3600}`, // seconds
      ];
      if (isProd) cookieParts.push("Secure", "SameSite=None");
      else cookieParts.push("SameSite=Lax"); // local dev
      res.setHeader("Set-Cookie", cookieParts.join("; "));

      return { id: user._id, name: user.name, email: user.email, role: user.role, token: accessToken };
    },

    // Rotate refresh token or re-issue access token based on cookie
    refreshToken: async (_parent, _args, { req, res }) => {
      const cookieHeader = req.headers.cookie || "";
      const cookies = Object.fromEntries(cookieHeader.split(";").map(c => {
        const [k, ...v] = c.trim().split("=");
        return [k, decodeURIComponent(v.join("="))];
      }));
      const rt = cookies[COOKIE_NAME];
      if (!rt) throw new Error("No refresh token");

      const payload = verifyToken(rt);
      if (!payload) throw new Error("Invalid refresh token");

      const ua = req.headers["user-agent"] || "";
      const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "";
      const dHash = deviceHash({ userAgent: ua, ip });

      // Validate DB session
      const session = await Session.findOne({ user: payload.id, refreshToken: rt, revoked: false });
      if (!session) throw new Error("Session not found or revoked");
      if (session.deviceHash && session.deviceHash !== dHash) throw new Error("Device mismatch");

      // Issue new access token (optionally rotate refresh token)
      const newAccess = signAccessToken({ id: payload.id, role: payload.role || "user" });

      // Optionally rotate refresh tokens for additional security:
      const newRefresh = signRefreshToken({ id: payload.id });
      session.refreshToken = newRefresh;
      session.expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
      await session.save();

      // Set rotated cookie
      const isProd = process.env.NODE_ENV === "production";
      const cookieParts = [
        `${COOKIE_NAME}=${newRefresh}`,
        `Path=/; HttpOnly`,
        `Max-Age=${7 * 24 * 3600}`,
      ];
      if (isProd) cookieParts.push("Secure", "SameSite=None");
      else cookieParts.push("SameSite=Lax");
      res.setHeader("Set-Cookie", cookieParts.join("; "));

      return { token: newAccess };
    },

    logout: async (_parent, _args, { req, res }) => {
      // Revoke session (if present)
      const cookieHeader = req.headers.cookie || "";
      const cookies = Object.fromEntries(cookieHeader.split(";").map(c => {
        const [k, ...v] = c.trim().split("=");
        return [k, decodeURIComponent(v.join("="))];
      }));
      const rt = cookies[COOKIE_NAME];
      if (rt) {
        await Session.updateOne({ refreshToken: rt }, { revoked: true });
      }
      // Clear cookie
      res.setHeader("Set-Cookie", `${COOKIE_NAME}=deleted; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`);
      return true;
    }
  }
};
