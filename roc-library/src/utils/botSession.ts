import { createHmac, timingSafeEqual } from "node:crypto";
import { readCookie } from "@/server/http";

/** The sign-in cookie for the Bot key page: expiry time plus a signature made with the admin password. */
export const SESSION_COOKIE = "bot_session";
export const SESSION_SECONDS = 3 * 60 * 60;

const sign = (expiry: string, secret: string) =>
  createHmac("sha256", secret).update(`bot-key-page:${expiry}`).digest("base64url");

export function makeSession(secret: string) {
  const expiry = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return `${expiry}.${sign(expiry, secret)}`;
}

function sessionIsValid(value: string | undefined, secret: string) {
  if (!value) return false;
  const [expiry, signature] = value.split(".");
  if (!expiry || !signature || Number(expiry) < Date.now() / 1000) return false;
  const a = Buffer.from(signature);
  const b = Buffer.from(sign(expiry, secret));
  return a.length === b.length && timingSafeEqual(a, b);
}

/** True when the request carries a valid sign-in. Changing the admin password signs everyone out. */
export function isSignedIn(request: Request) {
  const secret = process.env.BOT_KEYGEN_ADMIN_PASSWORD;
  if (!secret) return false;
  return sessionIsValid(readCookie(request, SESSION_COOKIE), secret);
}

/** The Set-Cookie value that signs a visitor in (maxAge 0 with an empty value signs them out). */
export function sessionCookie(value: string, secure: boolean, maxAge = SESSION_SECONDS) {
  return `${SESSION_COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Strict${secure ? "; Secure" : ""}`;
}
