import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

import { getServerEnv } from "@/lib/validation/env";

const ADMIN_SESSION_COOKIE = "novaretail_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

export class UnauthorizedAdminError extends Error {
  constructor() {
    super("Unauthorized.");
    this.name = "UnauthorizedAdminError";
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return false;
  }

  return isValidSessionToken(token);
}

export async function requireAdminSession(): Promise<void> {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    throw new UnauthorizedAdminError();
  }
}

export async function setAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  const expiresAt = getSessionExpirationTimestamp();

  cookieStore.set(ADMIN_SESSION_COOKIE, createSessionToken(expiresAt), {
    expires: new Date(expiresAt),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function isValidAdminPassword(password: string): boolean {
  const expectedPassword = getServerEnv().ADMIN_PASSWORD;

  return safeCompare(password, expectedPassword);
}

function createSessionToken(expiresAt: number): string {
  const payload = String(expiresAt);
  const signature = signPayload(payload);

  return `${payload}.${signature}`;
}

function isValidSessionToken(token: string): boolean {
  const [expiresAtValue, signature] = token.split(".");
  const expiresAt = Number(expiresAtValue);

  if (!expiresAtValue || !signature || !Number.isFinite(expiresAt)) {
    return false;
  }

  if (Date.now() > expiresAt) {
    return false;
  }

  return safeCompare(signature, signPayload(expiresAtValue));
}

function signPayload(payload: string): string {
  return createHmac("sha256", getServerEnv().ADMIN_PASSWORD)
    .update(payload)
    .digest("hex");
}

function getSessionExpirationTimestamp(): number {
  return Date.now() + SESSION_DURATION_SECONDS * 1000;
}

function safeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}
