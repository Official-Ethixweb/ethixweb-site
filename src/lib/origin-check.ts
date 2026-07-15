/**
 * Lightweight CSRF mitigation for the POST endpoints. There's no session
 * cookie anywhere in this app (every request is anonymous), so a forged
 * cross-site request can't act "as" anyone - but it can still submit spam
 * through these forms from another origin's page. Browsers attach `Origin`
 * (and, failing that, `Referer`) on cross-site POSTs, so rejecting a
 * mismatch blocks that path. When neither header is present (some non-browser
 * clients) we allow the request through rather than fail-closed, matching
 * this being defense-in-depth alongside rate limiting, not the only guard.
 */
export function isSameOriginRequest(request: Request): boolean {
  const siteOrigin = new URL(request.url).origin;

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).origin === siteOrigin;
    } catch {
      return false;
    }
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin === siteOrigin;
    } catch {
      return false;
    }
  }

  return true;
}
