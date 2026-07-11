import { useState, type ComponentType } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type PipelineStage = {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  desc: string;
};

/**
 * The site's one signature interactive moment (Signal Systems plan, Phase 4 rule 4): a
 * sequence of stages that resolve from wireframe to solid on hover, focus, or tap - instead
 * of a static row of cards. Only one thing on the page works like this, on purpose.
 */
export function PipelineDiagram({ stages }: { stages: PipelineStage[] }) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [pinnedId, setPinnedId] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col lg:flex-row lg:items-stretch">
      {stages.map((stage, i) => {
        const resolved = hoveredId === i || pinnedId === i;
        return (
          <div key={stage.title} className="flex flex-1 flex-col lg:flex-row lg:items-stretch">
            <button
              type="button"
              onMouseEnter={() => setHoveredId(i)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(i)}
              onBlur={() => setHoveredId(null)}
              onClick={() => setPinnedId(i)}
              aria-pressed={resolved}
              className={`group relative flex w-full flex-1 flex-col gap-4 rounded-2xl border p-6 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                resolved
                  ? "premium-card web-card"
                  : "border-dashed border-white/15 bg-transparent hover:border-white/25"
              }`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                  resolved
                    ? "bg-primary/15 text-primary"
                    : "bg-transparent text-muted-foreground/90"
                }`}
              >
                <stage.icon className="h-5 w-5" strokeWidth={resolved ? 2 : 1.2} />
              </span>
              <h3
                className={`text-lg font-bold transition-colors duration-300 ${
                  resolved ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {stage.title}
              </h3>
              {resolved ? (
                <motion.p
                  initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm leading-6 text-muted-foreground"
                >
                  {stage.desc}
                </motion.p>
              ) : (
                <div className="space-y-2" aria-hidden="true">
                  <div className="h-2 w-4/5 rounded-full bg-white/8" />
                  <div className="h-2 w-3/5 rounded-full bg-white/8" />
                </div>
              )}
            </button>
            {i < stages.length - 1 && <div className="pipeline-connector" aria-hidden="true" />}
          </div>
        );
      })}
    </div>
  );
}
