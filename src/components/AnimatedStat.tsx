import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/** Splits "1,500+", "$45", "+45%", "$4.50" etc. into a prefix, a numeric
 * body, and a suffix, so the numeric part can be tweened while the
 * surrounding formatting (currency sign, comma, %, +) stays put. Returns
 * null when the string isn't count-up-able (e.g. "2-4 wks", "5.0" range). */
function parseStat(raw: string) {
  const match = raw.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, numStr, suffix] = match;
  // Bail out on ranges like "2-4 wks" - animating just the first number
  // ("2") while "-4 wks" sits static produces a misleading mid-tween value.
  if (/^\s*-\s*\d/.test(suffix)) return null;
  const value = Number(numStr.replace(/,/g, ""));
  if (Number.isNaN(value)) return null;
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  const hasComma = numStr.includes(",");
  return { prefix, suffix, value, decimals, hasComma };
}

function formatNumber(n: number, decimals: number, hasComma: boolean) {
  const fixed = n.toFixed(decimals);
  if (!hasComma) return fixed;
  const [intPart, decPart] = fixed.split(".");
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart ? `${withCommas}.${decPart}` : withCommas;
}

/** Counts up from 0 to the target once the stat scrolls into view. Falls
 * back to a plain fade-in for values that aren't a single tweenable number. */
export function AnimatedStat({
  value,
  duration = 1.4,
  className = "",
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const parsed = parseStat(value);
  const [display, setDisplay] = useState(
    parsed ? formatNumber(0, parsed.decimals, parsed.hasComma) : value,
  );

  useEffect(() => {
    if (!parsed || !inView) return;
    if (reduceMotion) {
      setDisplay(formatNumber(parsed.value, parsed.decimals, parsed.hasComma));
      return;
    }
    const controls = animate(0, parsed.value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(formatNumber(v, parsed.decimals, parsed.hasComma)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion]);

  if (!parsed) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {parsed.prefix}
      {display}
      {parsed.suffix}
    </span>
  );
}
