import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  HeartPulse,
  Hammer,
  Sailboat,
  Fish,
  Scale,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AnimatedStat } from "./AnimatedStat";
import { WebSpotlight } from "./WebSpotlight";
import { trackWebSpotlight } from "@/lib/web-spotlight";
import type { CaseStudy } from "@/lib/portfolio-data";

const INDUSTRY_ICONS: Record<string, LucideIcon> = {
  Healthcare: HeartPulse,
  "Home & Cabinetry": Hammer,
  "Marine & Boating": Sailboat,
  "Outdoor & Recreation": Fish,
  "Legal & Financial": Scale,
  "Wellness & DTC": Leaf,
};

/** Featured case study card, built for progressive disclosure: the default
 * state shows only industry, year, mockup, headline, one short sentence, up
 * to 2 service tags and a single subtle CTA - everything else (remaining
 * tags, metrics, the challenge/approach story) is reserved space that's
 * invisible until hover/focus, so revealing it never reflows the grid. No
 * real client screenshots exist yet, so the "mockup" is an honest abstract/
 * branded placeholder (monogram + industry icon over a neutral texture),
 * not a fabricated screenshot. */
export function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const reduceMotion = useReducedMotion();
  const Icon = INDUSTRY_ICONS[study.industry] ?? HeartPulse;
  const monogram = study.client.charAt(0);
  const visibleTags = study.services.slice(0, 2);
  const hiddenTags = study.services.slice(2);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      onMouseMove={trackWebSpotlight}
      className="premium-card group relative flex flex-col overflow-hidden rounded-3xl transition-shadow duration-300 hover:shadow-lg"
      style={{ transformOrigin: "center" }}
    >
      {/* ── Visual zone: mockup <-> story crossfade, fixed height ── */}
      <div className="relative h-56 shrink-0 overflow-hidden">
        {/* Abstract device mockup */}
        <div className="absolute inset-0 card-mockup-bg transition-opacity duration-200 group-hover:opacity-0">
          <div className="grid-bg absolute inset-0 opacity-30" />
          {/* Browser chrome */}
          <div className="absolute inset-x-4 top-4 flex items-center gap-1.5 rounded-t-lg bg-foreground/10 px-3 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-foreground/20" />
            <span className="h-2 w-2 rounded-full bg-foreground/20" />
            <span className="h-2 w-2 rounded-full bg-foreground/20" />
            <span className="ml-2 h-2 w-24 rounded-full bg-foreground/10" />
          </div>
          <div className="relative flex h-full items-center justify-center">
            <span className="font-display text-7xl font-extrabold text-foreground/[0.08]">
              {monogram}
            </span>
            <span className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 ring-1 ring-primary/25">
              <Icon className="h-4.5 w-4.5 text-primary" strokeWidth={1.8} />
            </span>
          </div>
        </div>

        {/* Story overlay - the "detail preview" */}
        <div className="absolute inset-0 flex flex-col justify-center bg-gradient-to-br from-[#1a1a1c] to-[#0d0d0f] p-6 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/45">
            The challenge
          </p>
          <p className="mt-1.5 line-clamp-3 translate-y-1 text-sm leading-relaxed text-white/80 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            {study.challenge}
          </p>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-widest text-white/45">
            Our approach
          </p>
          <p className="mt-1.5 line-clamp-2 translate-y-1 text-sm leading-relaxed text-white/80 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            {study.approach}
          </p>
        </div>

        <WebSpotlight size="lg" />
      </div>

      {/* ── Text zone: default content always visible ── */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <span>{study.industry}</span>
          <span>{study.year}</span>
        </div>
        <h3 className="mt-3 font-display text-xl font-bold leading-snug text-foreground">
          {study.headline}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {study.impact}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {visibleTags.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-foreground/[0.03] px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
            >
              {s}
            </span>
          ))}
          {hiddenTags.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-foreground/[0.03] px-2.5 py-1 text-[11px] font-medium text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Always-visible subtle CTA */}
        <Link
          to="/contact"
          className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-foreground/70 transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
        >
          Start a similar project
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>

        {/* Hover-revealed metrics: space is always reserved, so nothing reflows */}
        <div className="mt-4 grid -translate-y-1 grid-cols-3 gap-2 border-t border-border pt-4 opacity-0 pointer-events-none transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto">
          {study.metrics.slice(0, 3).map((m) => (
            <div key={m.label}>
              <AnimatedStat
                value={m.value}
                className="block font-display text-lg font-extrabold text-gradient-brand sm:text-xl"
              />
              <p className="mt-0.5 text-[10.5px] leading-tight text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
