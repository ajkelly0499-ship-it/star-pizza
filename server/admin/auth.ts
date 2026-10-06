import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "star-pizza-admin";

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);

  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(password, expected);
}

export function createAdminSessionToken() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }

  return createHmac("sha256", secret)
    .update("star-pizza-admin-session-v1")
    .digest("hex");
}

export function verifyAdminSessionToken(value?: string | null) {
  if (!value) return false;

  try {
    return safeEqual(value, createAdminSessionToken());
  } catch {
    return false;
  }
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 12
};
