import { createHmac, timingSafeEqual } from "node:crypto";

// Lets the reviewer approve/reject straight from an email link with no login -
// the token is an HMAC over the test id + decision (+ expiry, for links
// issued after this was added), so it can't be forged or replayed for a
// different test, but there's no account system to build or maintain for a
// two-person review flow.
const REVIEW_WINDOW_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

function sign(testId: string, decision: "approved" | "rejected", exp?: number): string {
  const secret = process.env.SCREENING_ACTION_SECRET;
  if (!secret) throw new Error("SCREENING_ACTION_SECRET is not configured.");
  const message = exp === undefined ? `${testId}:${decision}` : `${testId}:${decision}:${exp}`;
  return createHmac("sha256", secret).update(message).digest("hex");
}

/** Returns the signed token plus the expiry (ms since epoch) it's bound to -
 * both must be included as query params on the decision link. */
export function signDecisionToken(
  testId: string,
  decision: "approved" | "rejected",
): { token: string; exp: number } {
  const exp = Date.now() + REVIEW_WINDOW_MS;
  return { token: sign(testId, decision, exp), exp };
}

/** `exp` is optional so decision links sent before expiry support was added
 * keep working unmodified (verified against the legacy 2-part message, with
 * no expiry enforced) - only newly issued links carry and enforce it. */
export function verifyDecisionToken(
  testId: string,
  decision: "approved" | "rejected",
  token: string,
  exp?: string | null,
): boolean {
  const expNum = exp ? Number(exp) : undefined;
  if (exp && (!Number.isFinite(expNum) || Date.now() > expNum!)) return false;

  const expected = sign(testId, decision, expNum);
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}
