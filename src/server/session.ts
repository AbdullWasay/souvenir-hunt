import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";

const COOKIE_NAME = "sh_admin_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function sign(payload: string): string {
  return createHmac("sha256", env.adminSessionSecret).update(payload).digest("base64url");
}

export function createAdminToken(email: string): string {
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const body = Buffer.from(JSON.stringify({ email, exp })).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifyAdminToken(token: string | undefined): { email: string } | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString()) as {
      email: string;
      exp: number;
    };
    if (!data.email || data.exp < Date.now()) return null;
    if (data.email !== env.adminEmail) return null;
    return { email: data.email };
  } catch {
    return null;
  }
}

export function adminSessionCookie(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE_SEC}${secure}`;
}

export function clearAdminSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function readAdminTokenFromCookie(cookieHeader: string | null): string | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match?.[1];
}

export function getRequestCookie(request: Request): string | null {
  return request.headers.get("cookie");
}
