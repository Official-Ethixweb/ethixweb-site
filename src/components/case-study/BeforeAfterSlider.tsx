import { useState } from "react";
import { Reveal } from "@/components/shared/Reveal";
import { CaseStudyContainer } from "@/components/case-study/CaseStudyContainer";
import type { Image } from "@/data/case-studies/types";

/** Draggable before/after comparison. A native `<input type="range">` owns
 * the interaction (free keyboard + touch + screen-reader support) and stays
 * visually transparent; the divider line, handle and image clip-path are
 * purely cosmetic layers driven by its value. */
export function BeforeAfterSlider({
  beforeImage,
  afterImage,
}: {
  beforeImage: Image;
  afterImage: Image;
}) {
  const [percent, setPercent] = useState(50);

  return (
    <section className="py-10 sm:py-14">
      <CaseStudyContainer>
        <Reveal>
          <div className="mb-4 flex items-center justify-between">
            <span className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Before
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Move the slider
            </span>
            <span className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              After
            </span>
          </div>

          <div className="relative aspect-video select-none overflow-hidden rounded-[1.75rem] bg-muted shadow-lg">
            <img
              src={afterImage.src}
              alt={afterImage.alt}
              width={afterImage.width}
              height={afterImage.height}
              loading="lazy"
              decoding="async"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
            >
              <img
                src={beforeImage.src}
                alt={beforeImage.alt}
                width={beforeImage.width}
                height={beforeImage.height}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Divider line + handle - cosmetic only, positioned from the input's value */}
            <div
              className="pointer-events-none absolute inset-y-0 w-[3px] bg-white/95 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
              style={{ left: `${percent}%`, transform: "translateX(-50%)" }}
            />
            <div
              className="pointer-events-none absolute top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg"
              style={{ left: `${percent}%` }}
            />

            <input
              type="range"
              min={0}
              max={100}
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
              aria-label="Drag to compare the before and after site"
              className="absolute inset-0 h-full w-full cursor-col-resize appearance-none bg-transparent opacity-0"
            />
          </div>
        </Reveal>
      </CaseStudyContainer>
    </section>
  );
}
