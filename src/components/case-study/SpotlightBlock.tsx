import { Reveal } from "@/components/shared/Reveal";
import { Checklist } from "@/components/case-study/Checklist";
import { cn } from "@/lib/utils";
import type { SpotlightItem } from "@/data/case-studies/types";

/** One image + floating glass card "spotlight" moment inside Design
 * Approach. `treatment: "bleed"` runs the photo edge-to-edge (breaking out
 * of the page gutters) with the card anchored over its bottom-right corner;
 * `"inset"` keeps the photo inside the page gutters, rounded on both sides,
 * with the card floating beside its right edge, vertically centered -
 * matching the two variants used back-to-back in the reference. Below `sm`
 * both collapse to a plain stacked photo-then-card layout so nothing
 * overlaps awkwardly on narrow screens. */
export function SpotlightBlock({ item }: { item: SpotlightItem }) {
  const isBleed = item.treatment === "bleed";

  const card = (
    <div className="glass-strong w-full rounded-[1.5rem] p-7 sm:w-[min(90vw,26rem)] sm:p-8">
      <h3 className="font-display text-2xl font-bold leading-snug text-foreground">
        {item.card.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.card.description}</p>
      {item.card.checklist && <Checklist items={item.card.checklist} className="mt-5" />}
    </div>
  );

  return (
    <Reveal>
      <div className={cn(!isBleed && "px-6 sm:px-10 lg:px-[120px]")}>
        <div className={cn("relative mx-auto", !isBleed && "max-w-[1440px]")}>
          <img
            src={item.image.src}
            alt={item.image.alt}
            width={item.image.width}
            height={item.image.height}
            loading="lazy"
            decoding="async"
            className={cn(
              "aspect-[4/3] w-full object-cover sm:aspect-[21/9]",
              !isBleed && "sm:rounded-[1.75rem]",
            )}
          />
          <div
            className={cn(
              "static mt-6 flex sm:mt-0 sm:p-8 lg:p-12",
              "sm:absolute sm:inset-0 sm:justify-end",
              isBleed ? "sm:items-end" : "sm:items-center",
            )}
          >
            {card}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
