import { Reveal } from "@/components/shared/Reveal";
import { getIcon } from "@/components/case-study/icon-map";
import type { InfoCard } from "@/data/case-studies/types";

/** The 3-up white card grid used by both the Context ("who/what/how") and
 * Snapshot ("what we did at a glance") sections - same card shell, only the
 * icon/logo + copy differ, so both sections share this one component. */
export function InfoCardGrid({ cards }: { cards: readonly InfoCard[] }) {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-3">
      {cards.map((card, i) => (
        <Reveal key={card.title} delay={i * 0.06}>
          <div className="h-full rounded-3xl border border-border bg-card p-7 shadow-sm">
            {card.logo ? (
              <img
                src={card.logo.src}
                alt={card.logo.alt}
                width={card.logo.width}
                height={card.logo.height}
                loading="lazy"
                decoding="async"
                className="h-16 w-auto max-w-[170px] object-contain object-left"
              />
            ) : (
              (() => {
                const Icon = getIcon(card.icon);
                return <Icon className="h-10 w-10 text-primary-text" strokeWidth={1.6} />;
              })()
            )}
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-primary-text">
              {card.label}
            </p>
            <h3 className="mt-2 font-display text-xl font-bold text-foreground">{card.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              {card.description}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
