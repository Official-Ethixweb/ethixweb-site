import { Reveal } from "@/components/shared/Reveal";
import { CaseStudyContainer } from "@/components/case-study/CaseStudyContainer";
import { SectionHeading } from "@/components/case-study/SectionHeading";
import type { Image, SectionIntro } from "@/data/case-studies/types";

/** Heading + one large photo whose edges soft-fade into the page background
 * (no hard card edge) - the calmest, most "atmospheric" image treatment on
 * the page, reserved for this one moment in the reference. The fade is a
 * radial-gradient overlay sitting on top of a plain `<img>`, not a CSS
 * `mask-image` on the image itself - mask compositing is inconsistent
 * across browsers/GPUs (and headless capture), where a background-gradient
 * overlay always renders reliably for the same visual result. */
export function MobileFirstSection({ intro, image }: { intro: SectionIntro; image: Image }) {
  return (
    <section className="py-14 sm:py-20">
      <CaseStudyContainer>
        <SectionHeading intro={intro} />
      </CaseStudyContainer>

      <Reveal delay={0.1}>
        <div className="relative mt-10 w-full">
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
            className="mx-auto block aspect-[4/3] w-full max-w-[1440px] object-cover"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 85% 90% at 50% 48%, transparent 62%, var(--color-background) 100%)",
            }}
          />
        </div>
      </Reveal>
    </section>
  );
}
