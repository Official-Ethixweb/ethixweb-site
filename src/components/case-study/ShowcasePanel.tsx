import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/shared/Reveal";
import type { Image } from "@/data/case-studies/types";

/** One device frame: flat browser/OS chrome (no photo asset needed) with a
 * live `<iframe>` of the site rendered at that device's real width, then
 * scaled via ResizeObserver to fit however wide the frame renders - each
 * frame genuinely shows that breakpoint's layout, not the same screenshot
 * resized. The iframe renders slightly wider than its clipped wrapper so its
 * native scrollbar lands outside the visible area (same trick as the
 * laptop-photo showcase elsewhere on this page). */
function DeviceFrame({
  websiteUrl,
  clientName,
  device,
  chrome,
  frameWidth,
  frameHeight,
  className,
}: {
  websiteUrl: string;
  clientName: string;
  device: string;
  chrome: "browser" | "none";
  frameWidth: number;
  frameHeight: number;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(el.getBoundingClientRect().width / frameWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [frameWidth]);

  return (
    <div
      className={`overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/10 ${className ?? ""}`}
    >
      {chrome === "browser" && (
        <div className="flex items-center gap-1.5 border-b border-black/5 bg-[#f3f3f3] px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 flex-1 truncate rounded-md bg-white px-2 py-1 text-center text-[11px] text-neutral-400 ring-1 ring-black/5">
            {websiteUrl.replace(/^https?:\/\//, "")}
          </span>
        </div>
      )}
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: `${frameWidth} / ${frameHeight}` }}
      >
        <iframe
          src={websiteUrl}
          title={`${device} preview of the ${clientName} website`}
          loading="lazy"
          className="absolute left-0 top-0 origin-top-left border-0"
          style={{
            width: `${frameWidth + 20}px`,
            height: `${frameHeight}px`,
            transform: `scale(${scale})`,
          }}
        />
      </div>
    </div>
  );
}

export function ShowcasePanel({
  image,
  websiteUrl,
  clientName,
}: {
  image: Image;
  websiteUrl?: string;
  clientName: string;
}) {
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
          {websiteUrl ? (
            <div className="relative mx-auto w-full max-w-[1100px] pb-16 pr-6 sm:pb-0 sm:pr-0">
              <DeviceFrame
                websiteUrl={websiteUrl}
                clientName={clientName}
                device="Desktop"
                chrome="browser"
                frameWidth={1440}
                frameHeight={900}
                className="w-full"
              />
              <DeviceFrame
                websiteUrl={websiteUrl}
                clientName={clientName}
                device="Tablet"
                chrome="none"
                frameWidth={768}
                frameHeight={1024}
                className="absolute -right-2 top-[8%] hidden w-[30%] sm:block"
              />
              <DeviceFrame
                websiteUrl={websiteUrl}
                clientName={clientName}
                device="Mobile"
                chrome="none"
                frameWidth={390}
                frameHeight={844}
                className="absolute -bottom-6 -left-4 w-[26%] sm:-bottom-10 sm:w-[20%]"
              />
            </div>
          ) : (
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
              decoding="async"
              className="h-auto w-full max-w-[1200px] object-contain"
            />
          )}
        </div>
      </Reveal>
    </section>
  );
}
