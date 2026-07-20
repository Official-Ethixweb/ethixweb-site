import { useEffect, useState } from "react";
import { useMotionValue, useReducedMotion } from "framer-motion";
import { useTheme } from "@/components/layout/ThemeProvider";
import { SpiderwebNetwork } from "@/components/shared/SpiderwebNetwork";

const STARFIELD_DOTS = [
  { top: "8%", left: "12%", color: "#3b82f6", size: 5, blur: 6 },
  { top: "18%", left: "78%", color: "#ef4444", size: 4, blur: 5 },
  { top: "30%", left: "88%", color: "#3b82f6", size: 6, blur: 8 },
  { top: "42%", left: "70%", color: "#ef4444", size: 3, blur: 4 },
  { top: "55%", left: "82%", color: "#3b82f6", size: 5, blur: 7 },
  { top: "65%", left: "15%", color: "#ef4444", size: 4, blur: 5 },
  { top: "72%", left: "60%", color: "#3b82f6", size: 7, blur: 10 },
  { top: "25%", left: "22%", color: "#3b82f6", size: 3, blur: 4 },
  { top: "50%", left: "30%", color: "#ef4444", size: 5, blur: 6 },
  { top: "80%", left: "40%", color: "#3b82f6", size: 4, blur: 5 },
  { top: "10%", left: "55%", color: "#ef4444", size: 3, blur: 4 },
  { top: "38%", left: "8%", color: "#3b82f6", size: 6, blur: 8 },
  { top: "60%", left: "92%", color: "#ef4444", size: 4, blur: 6 },
  { top: "85%", left: "72%", color: "#3b82f6", size: 5, blur: 7 },
  { top: "15%", left: "40%", color: "#ef4444", size: 3, blur: 4 },
] as const;

function useIsSleeping() {
  const check = () => {
    // Dev/preview override: ?sleep=1 forces after-hours, ?sleep=0 forces awake
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("sleep");
      if (p === "1") return true;
      if (p === "0") return false;
    }
    const h = new Date().getHours();
    return h >= 17 || h < 8;
  };
  // Initialize to a fixed value so the first client render matches the server-rendered
  // markup exactly (avoids a hydration mismatch); the real value is applied post-mount.
  const [sleeping, setSleeping] = useState(false);
  useEffect(() => {
    setSleeping(check());
    const id = setInterval(() => setSleeping(check()), 60_000);
    return () => clearInterval(id);
  }, []);
  return sleeping;
}

/**
 * The interactive spiderweb + glass-emblem hero visual, shared across every page
 * that wants the same "follow the cursor" moment as the homepage - the web
 * itself is static, only the hub emblem tilts toward mx/my.
 */
export function HeroWebVisual({
  showBadges = true,
  webOpacity = 1,
}: {
  showBadges?: boolean;
  /** Fades the web artwork/strands while keeping the glass emblem at full opacity. */
  webOpacity?: number;
}) {
  const sleeping = useIsSleeping();
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  useEffect(() => {
    if (sleeping || reduceMotion) return;
    let raf = 0;
    let idleTimer: ReturnType<typeof setTimeout>;
    let pendingX = 0;
    let pendingY = 0;

    const flush = () => {
      mx.set(pendingX);
      my.set(pendingY);
      raf = 0;
    };
    const onMove = (e: MouseEvent) => {
      pendingX = (e.clientX / window.innerWidth - 0.5) * 2;
      pendingY = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(flush);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        mx.set(0);
        my.set(0);
      }, 3500);
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null) pendingX = Math.max(-1, Math.min(1, e.gamma / 25));
      if (e.beta !== null) pendingY = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
      if (!raf) raf = requestAnimationFrame(flush);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("deviceorientation", onOrient, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("deviceorientation", onOrient);
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
    };
  }, [sleeping, reduceMotion, mx, my]);

  return (
    <div className="relative mx-auto w-full max-w-190">
      <div className="absolute inset-6 rounded-full bg-primary/15 blur-[70px]" />
      <div className="relative h-80 sm:h-115 lg:h-130">
        {/* Interactive spiderweb network: artwork + overlay strands/nodes/pulses, with
         * the glass emblem at the hub and the badges wired into the web */}
        <SpiderwebNetwork
          mx={mx}
          my={my}
          reduceMotion={!!reduceMotion}
          theme={theme}
          showBadges={showBadges}
          webOpacity={webOpacity}
        />
        {/* starfield dots */}
        {STARFIELD_DOTS.map((dot, i) => (
          <span
            key={i}
            className="pointer-events-none absolute rounded-full"
            style={{
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              background: dot.color,
              boxShadow: `0 0 ${dot.blur}px ${dot.blur / 2}px ${dot.color}`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>
    </div>
  );
}
