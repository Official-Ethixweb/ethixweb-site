import { Reveal } from "@/components/shared/Reveal";
import { Highlighted } from "@/components/case-study/Highlighted";
import type { SectionIntro } from "@/data/case-studies/types";

/** Eyebrow + bold heading (one phrase in the accent color) + optional
 * sub-copy - the header repeated before Context, Snapshot, Design Approach,
 * Mobile First and Tech Stack. One component so every section's heading
 * stays pixel-identical instead of being re-styled per section. */
export function SectionHeading({
  intro,
  className = "",
}: {
  intro: SectionIntro;
  className?: string;
}) {
  return (
    <div className={className}>
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-text">
          {intro.eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="mt-3 max-w-4xl font-display text-4xl font-extrabold leading-[1.15] tracking-tight text-foreground">
          <Highlighted text={intro.title} highlight={intro.highlight} />
        </h2>
      </Reveal>
      {intro.sub && (
        <Reveal delay={0.12}>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            {intro.sub}
          </p>
        </Reveal>
      )}
    </div>
  );
}
