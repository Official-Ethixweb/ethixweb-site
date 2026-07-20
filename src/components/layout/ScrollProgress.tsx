import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Persistent, low-key scroll-progress hairline - orientation feedback without competing
 * visually with content (Signal Systems plan: nav-as-identity principle, original geometry).
 * Framer's `useReducedMotion` isn't needed here: a spring-smoothed position readout is
 * informational, not decorative motion, so it stays on even with reduced motion enabled.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="scroll-progress-hairline fixed inset-x-0 top-0 z-70 h-[2px] origin-left bg-[linear-gradient(90deg,transparent,var(--color-primary)_35%,#f0f0f2_100%)]"
      style={{ scaleX }}
    />
  );
}
