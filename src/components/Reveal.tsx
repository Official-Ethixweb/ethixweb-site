import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";
import { DURATION_BASE, EASE_PREMIUM } from "@/lib/motion";

const v: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION_BASE, ease: EASE_PREMIUM } },
};

export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [fallback, setFallback] = useState(false);
  const reduceMotion = useReducedMotion();

  // Safety net: force visible after 1.4s if IntersectionObserver never fires
  // (older iOS Safari has known bugs with rootMargin)
  useEffect(() => {
    const t = setTimeout(() => setFallback(true), 1400);
    return () => clearTimeout(t);
  }, []);

  const MotionTag = (as === "li" ? motion.li : motion.div) as typeof motion.div;

  return (
    <MotionTag
      ref={ref as React.RefObject<HTMLDivElement | null>}
      className={className}
      initial={reduceMotion ? "show" : "hidden"}
      animate={inView || fallback || reduceMotion ? "show" : "hidden"}
      variants={v}
      transition={reduceMotion ? { duration: 0 } : { delay }}
    >
      {children}
    </MotionTag>
  );
}
