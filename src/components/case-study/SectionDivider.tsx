import { CaseStudyContainer } from "@/components/case-study/CaseStudyContainer";

/** Thin hairline rule used between sections, matching the reference's plain
 * divider (no gradient/glow - this page is calmer than the marketing pages). */
export function SectionDivider() {
  return (
    <CaseStudyContainer className="py-2">
      <div className="h-px w-full bg-border" />
    </CaseStudyContainer>
  );
}
