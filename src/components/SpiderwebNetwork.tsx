import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { DollarSign, Layers3, Palette, PhoneCall, TrendingUp } from "lucide-react";
import spiderweb from "@/assets/spiderweb.svg";
import emblem from "@/assets/emblem-transparent.webp";

/* ── Geometry ─────────────────────────────────────────────────────────────────
 * Everything lives in the artwork's own coordinate space (viewBox 1234x772) so
 * the interactive overlay, the emblem, and the badges stay perfectly registered
 * with the drawn web at every viewport size. The hub of the drawn web sits at
 * 55.3% / 45.7% of the image. */
const VB_W = 1234;
const VB_H = 772;
const HUB = { x: 682, y: 353 };
/** Vertical squash of the web's ellipse (the artwork is wider than tall). */
const EY = 0.64;

/** Overlay spokes: angle (deg, screen coords) + tip radius. Interleaved with the
 * artwork's own strands to add density without hiding the original drawing. */
const SPOKES: { angle: number; r: number }[] = [
  { angle: -160, r: 640 },
  { angle: -127, r: 600 },
  { angle: -95, r: 560 },
  { angle: -70, r: 545 },
  { angle: -49, r: 590 },
  { angle: -20, r: 630 },
  { angle: 19, r: 610 },
  { angle: 50, r: 575 },
  { angle: 85, r: 545 },
  { angle: 118, r: 520 },
  { angle: 145, r: 545 },
  { angle: 162, r: 525 },
];
const RING_FRACTIONS = [0.24, 0.42, 0.62, 0.85];

function spokePoint(spoke: { angle: number; r: number }, f: number) {
  const a = (spoke.angle * Math.PI) / 180;
  return {
    x: HUB.x + Math.cos(a) * spoke.r * f,
    y: HUB.y + Math.sin(a) * spoke.r * f * EY,
  };
}

const SPOKE_PATHS = SPOKES.map((s) => {
  const tip = spokePoint(s, 1);
  return `M${HUB.x},${HUB.y} L${tip.x.toFixed(1)},${tip.y.toFixed(1)}`;
});

/** One sagging arc per ring fraction, threaded through every spoke (closed loop). */
const RING_PATHS = RING_FRACTIONS.map((f) => {
  const pts = SPOKES.map((s) => spokePoint(s, f));
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 1; i <= pts.length; i++) {
    const p = pts[i % pts.length];
    const prev = pts[i - 1];
    const mid = { x: (p.x + prev.x) / 2, y: (p.y + prev.y) / 2 };
    const ctrl = {
      x: mid.x + (HUB.x - mid.x) * 0.13,
      y: mid.y + (HUB.y - mid.y) * 0.13,
    };
    d += ` Q${ctrl.x.toFixed(1)},${ctrl.y.toFixed(1)} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }
  return d;
});

const NODES = SPOKES.flatMap((s, si) =>
  RING_FRACTIONS.map((f, ri) => {
    const p = spokePoint(s, f);
    return { x: p.x, y: p.y, spoke: si, ring: ri };
  }),
);

/* ── Badges ───────────────────────────────────────────────────────────────────
 * Positions are the artwork-space equivalents of the reference layout (measured
 * against the reference hero at the lg design size). `spoke`/`attach` pick the
 * overlay node the badge's connection line grows from; `xSm` pulls the two
 * right-side badges inboard below lg so they stay on-screen. */
const BADGES = [
  { label: "More booked jobs", icon: PhoneCall, x: 470, y: 68, spoke: 1, attach: 0.85 },
  { label: "More conversions", icon: TrendingUp, x: 932, y: 67, xSm: 888, spoke: 4, attach: 0.85 },
  { label: "UI/UX Systems", icon: Layers3, x: 405, y: 443, spoke: 11, attach: 0.42 },
  { label: "Revenue tracked", icon: DollarSign, x: 961, y: 447, xSm: 913, spoke: 6, attach: 0.62 },
  { label: "Design that converts", icon: Palette, x: 504, y: 692, spoke: 9, attach: 0.85 },
] as const;

const BADGE_GEO = BADGES.map((b) => {
  const node = spokePoint(SPOKES[b.spoke], b.attach);
  return {
    node,
    line: `M${node.x.toFixed(1)},${node.y.toFixed(1)} L${b.x},${b.y}`,
    pulse: `M${HUB.x},${HUB.y} L${node.x.toFixed(1)},${node.y.toFixed(1)} L${b.x},${b.y}`,
  };
});

/** Distance in artwork units under which hovering a web node highlights its badge. */
const NODE_HOVER_RADIUS = 70;
const SPOKE_HOVER_DEG = 9;
const SPOKE_COOLDOWN_MS = 1400;

function useIsSmall() {
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setSmall(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return small;
}

/** Object depth, front face at FRONT_Z down to the back face at BACK_Z. Piling on ever
 * more fully-opaque slices (24, then 48, then 72, then 110) never fully removed the
 * banding - a discrete stack of opaque flat images always shows *some* seams edge-on,
 * no matter how many you add. The actual fix is two-pronged: shrink the total depth so
 * the same layer count is packed far tighter, and make each slice semi-transparent so
 * neighbours alpha-blend into a soft gradient instead of each being its own hard-edged
 * opaque strip. That combination reads as one continuous surface at a fraction of the
 * layer count (and render cost) of the brute-force approach. */
const FRONT_Z = 2;
const BACK_Z = -14;

/** Shared crimson-glass treatment for both the front and back faces: a color-only
 * filter chain re-tints the frosted-white source art (alpha/bevels/highlights all
 * preserved), plus a thin polished-silver border and a soft crimson bloom. */
const EMBLEM_FACE_FILTER =
  "brightness(0.42) sepia(1) saturate(18) hue-rotate(-31deg) contrast(1.3) " +
  "drop-shadow(0.6px 0 0 #e7ebf2) drop-shadow(-0.6px 0 0 #e7ebf2) " +
  "drop-shadow(0 0.6px 0 #e7ebf2) drop-shadow(0 -0.6px 0 #e7ebf2) " +
  "drop-shadow(0 0 2px rgba(235,240,248,0.35)) " +
  "drop-shadow(0 0 8px rgba(229,29,37,0.4)) drop-shadow(0 0 18px rgba(229,29,37,0.2))";
const RIM_LAYER_COUNT = 80;
const RIM_LAYERS = Array.from({ length: RIM_LAYER_COUNT }, (_, i) => {
  const t = i / (RIM_LAYER_COUNT - 1); // 0 = just behind the front face, 1 = just in front of the back
  const distFromNearestFace = 1 - Math.abs(t - 0.5) * 2; // 0 at either end, 1 at the midpoint
  return {
    // Packed tightly between FRONT_Z and BACK_Z (with a 0.5-unit margin at each end)
    // so there's no empty Z-slice between the rim and either face to show through.
    z: FRONT_Z - 0.5 - t * (FRONT_Z - 0.5 - (BACK_Z + 0.5)),
    // White/light chrome throughout - was dipping near-black at the midpoint, which
    // read as a literal black band rather than a shaded metal rim.
    brightness: 0.92 - Math.pow(distFromNearestFace, 1.6) * 0.22,
    blur: 0.5 + distFromNearestFace * 0.5,
    // Semi-transparent, not opaque: several neighbouring slices alpha-composite over
    // each other at any given screen column, so the boundary between them blends
    // instead of reading as a hard-edged stripe.
    opacity: 0.6 + distFromNearestFace * 0.1,
  };
});

/** The uploaded transparent "E" emblem rendered as crimson glass with a chrome side
 * wall. A color-only CSS filter chain re-tints the source art's frosted-white glass to
 * deep crimson (its own alpha/bevels/highlights are preserved, not reshaded) - simpler
 * and more reliably cross-browser than trying to clip separate color/gradient overlay
 * layers to the letter's silhouette via CSS `mask-image`, which renders inconsistently
 * on raster PNGs between browsers (an earlier version of this used that approach and
 * it fell back to an unmasked, unclipped rectangle - a glowing white blob instead of a
 * letter). Spins continuously around the vertical axis only (see `.animate-emblem-spin`
 * in styles.css) - rotateY, never rotateX - so it always turns left/right and never
 * tilts up/down, with the cursor adding a small extra horizontal nudge on top. */
function GlassEmblem({ mx, reduceMotion }: { mx: MotionValue<number>; reduceMotion: boolean }) {
  // Horizontal-only: rotateY (spin around the vertical axis) is the sole rotation -
  // no rotateX, so the object never tilts up/down, only turns left/right.
  const rotateY = useSpring(useTransform(mx, [-1, 1], reduceMotion ? [4, 4] : [1, 7]), {
    stiffness: 70,
    damping: 26,
  });

  return (
    <div
      className={`absolute w-[5.6%] -translate-x-1/2 -translate-y-1/2 ${
        reduceMotion ? "" : "animate-emblem-float"
      }`}
      style={{
        left: "calc(53.8% - 5px)",
        top: "45.7%",
        perspective: "700px",
        perspectiveOrigin: "50% 50%",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        style={{
          rotateY,
          transformStyle: "preserve-3d",
          transformOrigin: "50% 50%",
          willChange: "transform",
        }}
        whileHover={{ scale: 1.04 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div
          className={`relative aspect-[397/406] w-full ${
            reduceMotion ? "" : "animate-emblem-spin"
          }`}
          style={{
            transform: reduceMotion ? "rotateY(4deg)" : undefined,
            transformOrigin: "50% 50%",
          }}
        >
          {/* Soft ambient backlight bleeding into the web behind the object - kept
           * subtle so it reads as ambience, not a wash over the letterform. */}
          <div
            className="absolute rounded-full"
            style={{
              left: "16%",
              top: "16%",
              width: "68%",
              height: "68%",
              background:
                "radial-gradient(circle, rgba(229,29,37,0.16) 0%, rgba(229,29,37,0.08) 45%, transparent 72%)",
              filter: "blur(8px)",
            }}
          />

          {/* Back face - a mirror of the front face's crimson glass at the far end of
           * the depth, so the second half of the spin shows the same red material
           * instead of trailing off into bare chrome. Rendered first (furthest back). */}
          <img
            src={emblem}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute inset-0 h-full w-full select-none"
            style={{ transform: `translateZ(${BACK_Z}px)`, filter: EMBLEM_FACE_FILTER }}
          />

          {/* Metal rim between the two faces - a tightly-packed, semi-transparent
           * translateZ stack, cool-toned and blurred, dipping darkest at the midpoint
           * and brightening back up toward each face. Each slice is partly see-through
           * so several neighbours alpha-blend together at any given screen column,
           * which is what actually removes the banding - not layer count alone. */}
          {RIM_LAYERS.map((layer, i) => (
            <img
              key={i}
              src={emblem}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="absolute inset-0 h-full w-full select-none"
              style={{
                transform: `translateZ(${layer.z}px)`,
                opacity: layer.opacity,
                filter:
                  `grayscale(1) sepia(0.12) hue-rotate(178deg) saturate(1.3) ` +
                  `brightness(${layer.brightness}) contrast(1.05) blur(${layer.blur}px)`,
              }}
            />
          ))}

          {/* Front face - the uploaded PNG, geometry untouched. A color-only filter
           * chain re-tints the frosted glass to deep crimson (alpha/bevels/highlights
           * all preserved), then a thin polished-silver border and a soft crimson bloom
           * are chained on as drop-shadows, which - unlike the mask-based layers this
           * replaced - follow the image's own alpha reliably in every browser. */}
          <img
            src={emblem}
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full select-none"
            style={{ transform: `translateZ(${FRONT_Z}px)`, filter: EMBLEM_FACE_FILTER }}
          />
          {/* Small glossy point-light reflection, centered on the object and kept small
           * and restrained so it reads as a highlight, not a wash over the letterform. */}
          <div
            className="absolute rounded-full"
            style={{
              left: "46.5%",
              top: "46.5%",
              width: "7%",
              height: "7%",
              background: "radial-gradient(circle, rgba(255,255,255,0.7), transparent 70%)",
              filter: "blur(1px)",
              transform: "translateZ(2.5px)",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

function HeroBadge({
  badge,
  x,
  active,
  highlighted,
  reduceMotion,
  theme,
  onHover,
}: {
  badge: (typeof BADGES)[number];
  x: number;
  active: boolean;
  highlighted: boolean;
  reduceMotion: boolean;
  theme: string;
  onHover: (hovering: boolean) => void;
}) {
  const Icon = badge.icon;
  const lift = !reduceMotion && (active || highlighted);
  return (
    <motion.div
      className="glass absolute z-20 flex h-7 cursor-default items-center justify-center gap-1 whitespace-nowrap rounded-full px-2 sm:h-auto sm:gap-2.5 sm:px-5 sm:py-3"
      style={{
        left: `${(x / VB_W) * 100}%`,
        top: `${(badge.y / VB_H) * 100}%`,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        y: lift ? -10 : 0,
        scale: active ? 1.05 : lift ? 1.02 : 1,
        boxShadow: lift
          ? "0 8px 28px rgba(229,29,37,0.35), 0 0 0 1px rgba(255,120,128,0.45)"
          : "0 0 0 rgba(229,29,37,0), 0 0 0 0px rgba(255,120,128,0)",
      }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
    >
      <Icon
        className="h-3 w-3 shrink-0 sm:h-4 sm:w-4"
        style={{ color: theme === "light" ? "rgba(192,39,45,0.9)" : "rgba(225,110,118,0.85)" }}
      />
      <span
        className="hidden text-[11px] font-medium min-[375px]:inline sm:text-sm"
        style={{ color: theme === "light" ? "rgba(20,16,15,0.88)" : "rgba(255,255,255,0.85)" }}
      >
        {badge.label}
      </span>
    </motion.div>
  );
}

/** The hero's spiderweb: the drawn artwork as the base layer, plus an interactive
 * overlay network (extra strands, rings, pulsing nodes, energy pulses and badge
 * connection lines) rendered in the same coordinate space. */
export function SpiderwebNetwork({
  mx,
  my,
  reduceMotion,
  theme,
  showBadges = true,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  reduceMotion: boolean;
  theme: string;
  /** Hide the value-prop badges (e.g. "More booked jobs") for pages where that copy doesn't apply - the web and emblem stay. */
  showBadges?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const spokeGroupRefs = useRef<(SVGGElement | null)[]>([]);
  const spokeAnimRefs = useRef<(SVGAnimationElement | null)[]>([]);
  const spokeFadeRefs = useRef<(SVGAnimationElement | null)[]>([]);
  const connectorAnimRefs = useRef<(SVGAnimationElement | null)[]>([]);
  const connectorFadeRefs = useRef<(SVGAnimationElement | null)[]>([]);
  const cooldownRef = useRef<number[]>(SPOKES.map(() => 0));
  const rafRef = useRef(0);
  const [hoveredBadge, setHoveredBadge] = useState(-1);
  const [nearBadge, setNearBadge] = useState(-1);
  const isSmall = useIsSmall();

  const fireSpoke = (si: number) => {
    const now = performance.now();
    if (now - cooldownRef.current[si] < SPOKE_COOLDOWN_MS) return;
    cooldownRef.current[si] = now;
    const group = spokeGroupRefs.current[si];
    if (group) {
      group.classList.remove("spoke-active");
      // Force a reflow so re-adding the class restarts the node flash animation
      void group.getBoundingClientRect();
      group.classList.add("spoke-active");
      window.setTimeout(() => group.classList.remove("spoke-active"), 1100);
    }
    spokeAnimRefs.current[si]?.beginElement();
    spokeFadeRefs.current[si]?.beginElement();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    if (rafRef.current) return;
    const { clientX, clientY } = e;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const u = ((clientX - rect.left) / rect.width) * VB_W;
      const v = ((clientY - rect.top) / rect.height) * VB_H;
      const dx = u - HUB.x;
      const dy = (v - HUB.y) / EY;
      const radius = Math.hypot(dx, dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      // Nearest spoke by angle -> energy pulse along it
      let best = -1;
      let bestDiff = SPOKE_HOVER_DEG;
      SPOKES.forEach((s, i) => {
        let diff = Math.abs(angle - s.angle);
        if (diff > 180) diff = 360 - diff;
        if (diff < bestDiff && radius < s.r * 1.02 && radius > 40) {
          best = i;
          bestDiff = diff;
        }
      });
      if (best >= 0) fireSpoke(best);

      // Near a badge's attachment node -> surface that badge
      let near = -1;
      BADGE_GEO.forEach((g, i) => {
        if (Math.hypot(u - g.node.x, v - g.node.y) < NODE_HOVER_RADIUS) near = i;
      });
      setNearBadge(near);
    });
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const onBadgeHover = (i: number) => (hovering: boolean) => {
    setHoveredBadge(hovering ? i : -1);
    if (hovering && !reduceMotion) {
      connectorAnimRefs.current[i]?.beginElement();
      connectorFadeRefs.current[i]?.beginElement();
    }
  };

  return (
    <div
      ref={wrapRef}
      className="absolute w-[170%]"
      style={{
        left: "55.6%",
        top: "37.1%",
        transform: "translate(-55.3%, -45.7%) perspective(1400px) rotateX(4deg) rotateY(-6deg)",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setNearBadge(-1)}
    >
      <img
        src={spiderweb}
        alt=""
        aria-hidden="true"
        width={1234}
        height={772}
        className="h-auto w-full select-none"
        draggable={false}
        style={{
          opacity: 0.95,
          filter:
            "brightness(0.82) saturate(0.9) drop-shadow(0 0 5px rgba(229,29,37,0.55)) drop-shadow(0 0 26px rgba(229,29,37,0.32))",
        }}
      />

      {/* Interactive overlay network - same coordinate space as the artwork */}
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className={`absolute inset-0 h-full w-full ${reduceMotion ? "web-static" : ""}`}
        aria-hidden="true"
      >
        {/* Density strands + rings, faint so the drawn web stays the star */}
        {SPOKE_PATHS.map((d, i) => (
          <path key={`s${i}`} d={d} className="web-strand" fill="none" />
        ))}
        {RING_PATHS.map((d, i) => (
          <path key={`r${i}`} d={d} className="web-ring" fill="none" />
        ))}

        {/* Badge connection lines */}
        {showBadges &&
          BADGE_GEO.map((g, i) => (
            <path
              key={`c${i}`}
              d={g.line}
              fill="none"
              className={`web-connector ${hoveredBadge === i || nearBadge === i ? "is-active" : ""}`}
            />
          ))}

        {/* Pulsing nodes, grouped per spoke so an energy pulse can flash them in order */}
        {SPOKES.map((_, si) => (
          <g
            key={`g${si}`}
            ref={(el) => {
              spokeGroupRefs.current[si] = el;
            }}
          >
            {NODES.filter((n) => n.spoke === si).map((n, ni) => (
              <circle
                key={ni}
                cx={n.x}
                cy={n.y}
                r={2.4}
                className="web-node"
                style={
                  {
                    "--ni": n.ring,
                    animationDelay: `${((si * 211 + n.ring * 617) % 3000) - 3000}ms`,
                  } as React.CSSProperties
                }
              />
            ))}
          </g>
        ))}

        {/* Energy pulse dots - one per spoke, driven by SMIL, begun from JS on hover */}
        {SPOKE_PATHS.map((d, i) => (
          <circle key={`p${i}`} r={3.4} fill="#ffb4b8" opacity="0" className="web-pulse-dot">
            <animateMotion
              ref={(el: SVGAnimationElement | null) => {
                spokeAnimRefs.current[i] = el;
              }}
              dur="0.8s"
              begin="indefinite"
              path={d}
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="linear"
            />
            <animate
              ref={(el: SVGAnimationElement | null) => {
                spokeFadeRefs.current[i] = el;
              }}
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.12;0.75;1"
              dur="0.8s"
              begin="indefinite"
            />
          </circle>
        ))}

        {/* Energy pulses that run hub -> node -> badge when a badge is hovered */}
        {showBadges &&
          BADGE_GEO.map((g, i) => (
            <circle key={`bp${i}`} r={3.2} fill="#ffc2c6" opacity="0" className="web-pulse-dot">
              <animateMotion
                ref={(el: SVGAnimationElement | null) => {
                  connectorAnimRefs.current[i] = el;
                }}
                dur="0.7s"
                begin="indefinite"
                path={g.pulse}
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="linear"
              />
              <animate
                ref={(el: SVGAnimationElement | null) => {
                  connectorFadeRefs.current[i] = el;
                }}
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.15;0.8;1"
                dur="0.7s"
                begin="indefinite"
              />
            </circle>
          ))}
      </svg>

      <GlassEmblem mx={mx} reduceMotion={reduceMotion} />

      {showBadges &&
        BADGES.map((badge, i) => (
          <HeroBadge
            key={badge.label}
            badge={badge}
            x={isSmall && "xSm" in badge && badge.xSm ? badge.xSm : badge.x}
            active={hoveredBadge === i}
            highlighted={nearBadge === i}
            reduceMotion={reduceMotion}
            theme={theme}
            onHover={onBadgeHover(i)}
          />
        ))}
    </div>
  );
}
