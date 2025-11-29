// src/utils/jwt.js
import jwt from "jsonwebtoken";

const USER_SECRET = process.env.JWT_SECRET_USER || "usersecret";
const ADMIN_SECRET = process.env.JWT_SECRET_ADMIN || "adminsecret";

const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "7d";

// ========== USER TOKENS ==========
export function signUserAccess(payload) {
  return jwt.sign(payload, USER_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function signUserRefresh(payload) {
  return jwt.sign(payload, USER_SECRET, { expiresIn: REFRESH_EXPIRES });
}

// ========== ADMIN TOKENS ==========
export function signAdminAccess(payload) {
  return jwt.sign(payload, ADMIN_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function signAdminRefresh(payload) {
  return jwt.sign(payload, ADMIN_SECRET, { expiresIn: REFRESH_EXPIRES });
}

// ========== VERIFY BOTH ==========
export function verifyUserToken(token) {
  try {
    return jwt.verify(token, USER_SECRET);
  } catch {
    return null;
  }
}

export function verifyAdminToken(token) {
  try {
    return jwt.verify(token, ADMIN_SECRET);
  } catch {
    return null;
  }
}
