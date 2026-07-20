import type { ReactNode } from "react";
import { Reveal } from "@/components/shared/Reveal";

/**
 * Editorial section header: big outlined index number + fading hairline,
 * then an eyebrow/title/sub stack, all left-aligned. The shared variant of
 * the header system used across the careers/portfolio/services redesigns -
 * breaks the "same centered stack on every section" monotony.
 */
export function EditorialHeader({
  index,
  eyebrow,
  title,
  sub,
  className = "",
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Reveal>
        <div className="flex items-baseline gap-5">
          <span
            aria-hidden="true"
            className="select-none font-display text-6xl font-extrabold leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(165,28,34,0.5)] sm:text-7xl"
          >
            {index}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <p className="mt-6 text-sm uppercase tracking-widest text-primary-text">{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.14}>
        <h2 className="mt-3 max-w-3xl pb-1 font-display text-4xl font-bold text-gradient sm:text-5xl">
          {title}
        </h2>
      </Reveal>
      {sub ? (
        <Reveal delay={0.2}>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{sub}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
