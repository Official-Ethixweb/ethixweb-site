import { useState, useEffect, useRef } from "react";
import { Reveal } from "@/components/shared/Reveal";
import type { Image } from "@/data/case-studies/types";

// The screen cutout in laptop-mockup-hollow.png as a % of the photo's own
// box (measured against the original photo's 1800x1350 pixels) - lets the
// live iframe sit exactly behind the glass at any render size, no JS needed.
const SCREEN_RECT = { left: 27.22, top: 19.85, width: 45.61, height: 37.93 };

/** The "laptop in hand" showcase moment between the before/after slider and
 * Snapshot. When the case study has a live `websiteUrl`, the laptop is the
 * exact same photo as always (`laptop-mockup-hollow.png` - hand, bezel, same
 * size), just with its screen area cut out to transparent so a real
 * `<iframe>` of the site shows through, scrollable and clickable, in place
 * of the baked-in screenshot. Falls back to the plain static `image` when
 * there's no URL to embed. Panel background (#F2F1DF, sampled from the
 * reference) radial-fades into the page background on every side so it reads
 * as one continuous surface, not a boxed panel. */
export function ShowcasePanel({
  image,
  websiteUrl,
  clientName,
}: {
  image: Image;
  websiteUrl?: string;
  clientName: string;
}) {
  const hollowSrc = image.src.replace(/(\.\w+)$/, "-hollow$1");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width;
        // The cutout width is 46.33% of the container width
        const cutoutWidth = width * (SCREEN_RECT.width / 100);
        // We render the iframe at a desktop resolution width of 1440px
        setScale(cutoutWidth / 1440);
      }
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pb-6 sm:pb-10">
      <Reveal>
        <div
          className="flex items-center justify-center px-6 py-16 sm:py-24"
          style={{
            background:
              "radial-gradient(ellipse 65% 85% at 50% 45%, #f2f1df 0%, var(--color-background) 100%)",
          }}
        >
          <div
            ref={containerRef}
            className="relative mx-auto w-full max-w-[1200px]"
            style={{ aspectRatio: `${image.width} / ${image.height}` }}
          >
            {websiteUrl && (
              // Wrapper is clipped exactly to the screen cutout; the iframe
              // itself renders 20px wider than the scale basis so its native
              // scrollbar lands in that extra strip and gets clipped away -
              // scrolling still works (wheel/trackpad/touch/keyboard all
              // scroll the iframe regardless of whether its bar is visible),
              // it just doesn't look like a "website in a box" anymore.
              <div
                className="absolute overflow-hidden"
                style={{
                  left: `${SCREEN_RECT.left}%`,
                  top: `${SCREEN_RECT.top}%`,
                  width: `${SCREEN_RECT.width}%`,
                  height: `${SCREEN_RECT.height}%`,
                }}
              >
                <iframe
                  src={websiteUrl}
                  title={`Live preview of the ${clientName} website`}
                  loading="lazy"
                  scrolling="yes"
                  className="border-0 bg-white"
                  style={{
                    width: "1460px",
                    height: "919px",
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                />
              </div>
            )}
            <img
              src={websiteUrl ? hollowSrc : image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
              decoding="async"
              className="pointer-events-none absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
