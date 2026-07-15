import { useEffect, useRef } from "react";

/** Drop into any `group`-classed card to get the cursor-reactive glow over
 * the signature web pattern - pair with `onMouseMove={trackWebSpotlight}`
 * on that card's root element. Use `size="lg"` on larger/feature cards.
 *
 * On touch devices there's no cursor to hover with, so this also self-
 * activates via IntersectionObserver as the card scrolls into view (see
 * `.is-inview` in styles.css, scoped to `@media (hover: none)` so it never
 * fights the real hover effect on mouse/trackpad devices). */
export function WebSpotlight({ size = "md" }: { size?: "md" | "lg" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined" || !window.matchMedia("(hover: none)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        el.classList.toggle("is-inview", entry.isIntersecting);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`web-spotlight ${size === "lg" ? "web-spotlight-lg" : ""}`}
    />
  );
}
