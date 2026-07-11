import { createHmac, timingSafeEqual } from "node:crypto";

// Lets the reviewer approve/reject straight from an email link with no login -
// the token is an HMAC over the test id + decision, so it can't be forged or
// replayed for a different test, but there's no account system to build or
// maintain for a two-person review flow.
function sign(testId: string, decision: "approved" | "rejected"): string {
  const secret = process.env.SCREENING_ACTION_SECRET;
  if (!secret) throw new Error("SCREENING_ACTION_SECRET is not configured.");
  return createHmac("sha256", secret).update(`${testId}:${decision}`).digest("hex");
}

export function signDecisionToken(testId: string, decision: "approved" | "rejected"): string {
  return sign(testId, decision);
}

export function verifyDecisionToken(
  testId: string,
  decision: "approved" | "rejected",
  token: string,
): boolean {
  const expected = sign(testId, decision);
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}
