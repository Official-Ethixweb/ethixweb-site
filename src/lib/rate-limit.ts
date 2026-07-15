import { getSupabase } from "./supabase";

// Best-effort in-memory rate limiter. Serverless instances are ephemeral and
// scale horizontally, so this only throttles abuse hitting the same warm
// instance - it is not a substitute for a shared store, but it's enough to
// stop naive scripted floods on a form endpoint without adding infra.

const hits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count += 1;
  return true;
}

/**
 * Durable, cross-instance rate limit backed by Postgres (see the
 * `check_rate_limit` function in supabase/migrations/0002_leads.sql) - unlike
 * the in-memory limiter above, this is not reset by a cold start and is
 * shared across every serverless instance. Falls back to the in-memory
 * limiter if Supabase isn't configured/reachable, so it degrades gracefully
 * rather than failing closed or open.
 */
export async function checkRateLimitDurable(
  key: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  try {
    const { data, error } = await getSupabase().rpc("check_rate_limit", {
      p_key: key,
      p_limit: limit,
      p_window_ms: windowMs,
    });
    if (error) {
      console.error("[rate-limit] durable check failed, falling back to in-memory:", error);
      return checkRateLimit(key, limit, windowMs);
    }
    return Boolean(data);
  } catch (err) {
    console.error("[rate-limit] durable check threw, falling back to in-memory:", err);
    return checkRateLimit(key, limit, windowMs);
  }
}

/**
 * Best-effort client IP for rate-limit keys. `x-vercel-forwarded-for` is set
 * by Vercel's own infrastructure and cannot be overridden by the client, so
 * it's used first. Plain `x-forwarded-for`/`x-real-ip` are client-settable on
 * some setups and are only a fallback for local dev / non-Vercel hosting.
 */
export function clientIp(request: Request): string {
  const vercelForwarded = request.headers.get("x-vercel-forwarded-for");
  if (vercelForwarded) return vercelForwarded.split(",")[0].trim();
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
