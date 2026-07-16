import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

// Per-assessment bearer secret. The browser gets the raw token exactly once
// (at /start) and presents it on every save/state/submit call; the database
// stores only its SHA-256 hash, so a leaked DB row can't be used to hijack a
// live exam session. There are no accounts - the token IS the session.

export function createSessionToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("hex");
  return { token, hash: hashSessionToken(token) };
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function verifySessionToken(token: unknown, storedHash: string): boolean {
  if (typeof token !== "string" || !/^[0-9a-f]{64}$/.test(token)) return false;
  const a = Buffer.from(hashSessionToken(token));
  const b = Buffer.from(storedHash);
  return a.length === b.length && timingSafeEqual(a, b);
}
