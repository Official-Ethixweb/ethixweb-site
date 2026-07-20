import { useMemo } from "react";

export type ConstellationNode = { label: string };

function polarPosition(index: number, total: number, radius: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: 50 + Math.cos(angle) * radius,
    y: 50 + Math.sin(angle) * radius,
  };
}

/**
 * Replaces the former mascot in the large "team"/"side panel" slots with a hub-and-spoke
 * node graph: one system (the chrome axis in HeroScene) with everything connected to it,
 * instead of a character. Passing `activeIndex` lights nodes up sequentially (used to mirror
 * multi-step form progress on the contact/careers pages); omit it for a static "all lit" state.
 */
export function SystemConstellation({
  nodes,
  activeIndex,
  radius = 34,
  center = { x: 50, y: 50 },
  className = "",
}: {
  nodes: ConstellationNode[];
  activeIndex?: number;
  radius?: number;
  center?: { x: number; y: number };
  className?: string;
}) {
  const positions = useMemo(
    () =>
      nodes.map((_, i) => {
        const p = polarPosition(i, nodes.length, radius);
        return { x: p.x - 50 + center.x, y: p.y - 50 + center.y };
      }),
    [nodes, radius, center.x, center.y],
  );

  return (
    <div className={`system-constellation relative h-full w-full ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
        <circle cx={center.x} cy={center.y} r={4} className="constellation-hub" />
        {positions.map((p, i) => {
          const lit = activeIndex === undefined || i <= activeIndex;
          return (
            <line
              key={i}
              x1={center.x}
              y1={center.y}
              x2={p.x}
              y2={p.y}
              className={`constellation-spoke ${lit ? "is-lit" : ""}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          );
        })}
        {positions.map((p, i) => {
          const lit = activeIndex === undefined || i <= activeIndex;
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={2.6}
              className={`constellation-node ${lit ? "is-lit" : ""}`}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          );
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0">
        {nodes.map((n, i) => {
          const p = positions[i];
          const lit = activeIndex === undefined || i <= activeIndex;
          return (
            <span
              key={n.label}
              className={`absolute whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide transition-opacity duration-300 ${
                lit ? "text-foreground opacity-90" : "text-muted-foreground opacity-35"
              }`}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: `translate(-50%, ${p.y > 50 ? "6px" : "-22px"})`,
              }}
            >
              {n.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
