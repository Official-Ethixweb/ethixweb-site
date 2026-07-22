import { CaseStudyContainer } from "@/components/case-study/CaseStudyContainer";
import { SectionHeading } from "@/components/case-study/SectionHeading";
import { SpotlightBlock } from "@/components/case-study/SpotlightBlock";
import type { SectionIntro, SpotlightItem } from "@/data/case-studies/types";

export function DesignApproachSection({
  intro,
  items,
}: {
  intro: SectionIntro;
  items: SpotlightItem[];
}) {
  return (
    <section className="py-10 sm:py-14">
      <CaseStudyContainer>
        <SectionHeading intro={intro} />
      </CaseStudyContainer>
      <div className="mt-10 space-y-10 sm:space-y-14">
        {items.map((item) => (
          <SpotlightBlock key={item.card.title} item={item} />
        ))}
      </div>
    </section>
  );
}
