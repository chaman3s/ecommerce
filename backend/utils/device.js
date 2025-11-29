// src/utils/device.js
import crypto from "crypto";

export function deviceHash({ userAgent = "", ip = "" }) {
  const h = crypto.createHash("sha256");
  h.update(`${userAgent}::${ip}`);
  return h.digest("hex");
}
