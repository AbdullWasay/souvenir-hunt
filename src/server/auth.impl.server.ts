import { getRequest, setResponseHeader } from "@tanstack/react-start/server";
import bcrypt from "bcryptjs";
import { env } from "@/lib/env";
import {
  adminSessionCookie,
  clearAdminSessionCookie,
  createAdminToken,
  readAdminTokenFromCookie,
  verifyAdminToken,
  getRequestCookie,
} from "./session";

export async function getAdminSessionImpl() {
  const request = getRequest();
  const token = readAdminTokenFromCookie(getRequestCookie(request));
  const session = verifyAdminToken(token);
  return { authenticated: !!session, email: session?.email ?? null };
}

export async function adminLoginImpl(data: { email: string; password: string }) {
  const email = data.email.trim().toLowerCase();
  const adminEmail = env.adminEmail.trim().toLowerCase();

  if (email !== adminEmail) {
    return { ok: false as const, error: "Invalid email or password." };
  }

  const stored = env.adminPassword;
  const valid =
    stored.startsWith("$2") ? await bcrypt.compare(data.password, stored) : data.password === stored;

  if (!valid) {
    return { ok: false as const, error: "Invalid email or password." };
  }

  const token = createAdminToken(email);
  setResponseHeader("Set-Cookie", adminSessionCookie(token));
  return { ok: true as const };
}

export async function adminLogoutImpl() {
  setResponseHeader("Set-Cookie", clearAdminSessionCookie());
  return { ok: true as const };
}

export async function requireAdminImpl() {
  const request = getRequest();
  const token = readAdminTokenFromCookie(getRequestCookie(request));
  const session = verifyAdminToken(token);
  if (!session) throw new Error("Unauthorized");
  return session;
}
