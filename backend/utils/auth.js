// src/utils/auth.js
import { verifyToken } from "./jwt.js";
import Session from "../models/Session.js";

export function requireAuth(user) {
  if (!user) {
    const err = new Error("Not authenticated");
    err.code = "UNAUTHENTICATED";
    throw err;
  }
}

export function requireAdmin(user) {
  requireAuth(user);
  if (user.role !== "admin") {
    const err = new Error("Not authorized");
    err.code = "FORBIDDEN";
    throw err;
  }
}

// Validate refresh token session (checks DB + not revoked + device)
export async function validateSession({ userId, refreshToken, deviceHash }) {
  if (!userId || !refreshToken) return null;
  const s = await Session.findOne({ user: userId, refreshToken, revoked: false });
  if (!s) return null;
  // optional: check deviceHash matches if present
  if (s.deviceHash && deviceHash && s.deviceHash !== deviceHash) return null;
  // check expiry
  if (s.expiresAt && s.expiresAt < new Date()) return null;
  return s;
}
