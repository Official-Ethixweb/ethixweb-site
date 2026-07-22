import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The reference design's frame is a fixed 1440px desktop canvas with ~120px
 * side gutters - wider than the site's shared `Container` presets (max
 * 1280px), so case-study sections get their own to match it exactly. */
export function CaseStudyContainer({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-[120px]", className)}>
      {children}
    </div>
  );
}
