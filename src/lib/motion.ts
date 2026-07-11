/** JS-side mirror of the CSS motion tokens in styles.css (--ease-premium, --duration-*),
 * so Framer Motion consumers share one scale instead of hand-picking values per component. */
export const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;
export const DURATION_FAST = 0.24;
export const DURATION_BASE = 0.45;
export const DURATION_SLOW = 0.9;
