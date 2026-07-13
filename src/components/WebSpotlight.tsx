/** Drop into any `group`-classed card to get the cursor-reactive glow over
 * the signature web pattern - pair with `onMouseMove={trackWebSpotlight}`
 * on that card's root element. Use `size="lg"` on larger/feature cards. */
export function WebSpotlight({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <div
      aria-hidden="true"
      className={`web-spotlight ${size === "lg" ? "web-spotlight-lg" : ""}`}
    />
  );
}
