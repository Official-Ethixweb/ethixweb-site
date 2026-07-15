/**
 * JSON.stringify for JSON-LD `<script>` tags. `JSON.stringify` alone doesn't
 * escape `<`, so a value containing the literal text `</script>` would
 * terminate the script element early - not exploitable today (every field
 * that reaches this is hardcoded copy, not user input) but fragile against a
 * future change that makes any field dynamic. Escaping `<` as `<` is
 * inert to JSON parsers and closes that gap unconditionally.
 */
export function jsonLdStringify(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
