import type { MouseEvent } from "react";

/** Writes pointer position as CSS custom properties directly on the card
 * element (no React state, no re-render, no rAF loop) so the `.web-spotlight`
 * layer's radial-gradient can track the cursor via `var(--mx)`/`var(--my)`.
 * Safe to attach to as many cards as you like at once. */
export function trackWebSpotlight(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
  el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
}
