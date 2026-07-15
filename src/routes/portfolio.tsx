import { useMemo, useState } from "react";
import { jsonLdStringify } from "@/lib/json-ld";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/Container";
import { GlowBlob } from "@/components/GlowBlob";
import { HeroWebVisual } from "@/components/HeroWebVisual";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { AnimatedStat } from "@/components/AnimatedStat";
import { CASE_STUDIES, SERVICE_FILTERS } from "@/lib/portfolio-data";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Our Work - Ethixweb" },
      {
        name: "description",
        content:
          "Real case studies from Ethixweb: websites, SEO and paid media that generated thousands of qualified leads.",
      },
      { property: "og:title", content: "Our Work - Ethixweb Case Studies" },
      { property: "og:description", content: "Selected client work and measurable results." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://ethixweb.com/ethixweb.png" },
      { property: "og:url", content: "https://ethixweb.com/portfolio" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Our Work - Ethixweb Case Studies" },
      {
        name: "twitter:description",
        content:
          "Real case studies from Ethixweb: websites, SEO and paid media that generated thousands of qualified leads.",
      },
      { name: "twitter:image", content: "https://ethixweb.com/ethixweb.png" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://ethixweb.com/portfolio" }],
    scripts: [
      {
        type: "application/ld+json",
        children: jsonLdStringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Ethixweb Portfolio",
          url: "https://ethixweb.com/portfolio",
          description:
            "Real case studies from Ethixweb: websites, SEO and paid media that generated thousands of qualified leads.",
          itemListElement: CASE_STUDIES.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.client,
            description: s.impact,
          })),
        }),
      },
    ],
  }),
  component: Portfolio,
});

const TRUST_STATS = [
  { value: "6", label: "Featured case studies" },
  { value: "2-4 wks", label: "Typical time to launch" },
  { value: "100%", label: "Senior-led delivery" },
  { value: "5.0", label: "Avg. client rating" },
];

function Portfolio() {
  const [filter, setFilter] = useState<string>("All");

  const visible = useMemo(
    () =>
      filter === "All" ? CASE_STUDIES : CASE_STUDIES.filter((s) => s.services.includes(filter)),
    [filter],
  );

  return (
    <SiteLayout>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative -mt-24 overflow-hidden bg-gradient-hero pb-16 pt-36 sm:pb-24 sm:pt-44">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <GlowBlob
          size="md"
          color="primary"
          blur={130}
          className="left-1/2 top-0 -translate-x-1/2 opacity-60"
        />
        <div className="pointer-events-none absolute inset-x-0 top-24 mx-auto w-full max-w-5xl scale-110 opacity-10">
          <HeroWebVisual showBadges={false} />
        </div>

        <Container className="relative">
          <div className="max-w-3xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_18px_rgba(138,24,28,0.9)]" />
                Our work
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-7 max-w-3xl pb-1 text-[clamp(2.25rem,4.4vw,3.75rem)] font-extrabold leading-[1.1] text-gradient">
                We don&apos;t just build websites.
                <br />
                We <span className="text-primary">solve business problems.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Every project on this page started the same way: understanding real users, finding
                the friction that was costing the business money, and shipping a measurable fix -
                not just a redesign.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="btn-primary group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-bold"
                >
                  Start a project
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <a
                  href="#case-studies"
                  className="btn-secondary group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-bold"
                >
                  See the case studies
                  <ArrowUpRight className="h-4 w-4 rotate-90 transition-transform duration-200 group-hover:rotate-[100deg]" />
                </a>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────────── */}
      <section className="border-b border-border py-12">
        <Container className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {TRUST_STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="text-center">
              <AnimatedStat
                value={s.value}
                className="block font-display text-3xl font-extrabold text-gradient sm:text-4xl"
              />
              <p className="mt-1.5 text-xs uppercase tracking-widest text-muted-foreground">
                {s.label}
              </p>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* ── Case studies ─────────────────────────────────────────────────── */}
      <section id="case-studies" className="scroll-mt-24 py-24">
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <p className="mb-4 text-sm uppercase tracking-widest text-primary-text">
                Case studies
              </p>
              <h2 className="pb-1 font-display text-4xl font-bold text-gradient sm:text-5xl">
                A clear before and after, every time.
              </h2>
            </div>
          </Reveal>

          {/* Filter bar */}
          <Reveal delay={0.08}>
            <div
              className="mt-10 flex flex-wrap items-center gap-2"
              role="group"
              aria-label="Filter case studies by service"
            >
              {["All", ...SERVICE_FILTERS].map((f) => {
                const active = filter === f;
                return (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(f)}
                    className={`relative inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-foreground/[0.03] text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    {active && <Check className="h-3.5 w-3.5" />}
                    {f}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Grid */}
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {visible.map((study, i) => (
                <CaseStudyCard key={study.slug} study={study} index={i} />
              ))}
            </AnimatePresence>
          </div>

          {visible.length === 0 && (
            <p className="mt-12 text-center text-muted-foreground">
              No case studies match that filter yet.
            </p>
          )}
        </Container>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24">
        <Reveal>
          <Container className="relative overflow-hidden rounded-[2rem] glass-strong p-12 text-center">
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-15" />
            <GlowBlob
              size="md"
              color="primary"
              blur={130}
              className="left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 opacity-60"
            />
            <div className="relative">
              <h2 className="pb-1 font-display text-4xl font-bold text-gradient sm:text-5xl">
                Let&apos;s create your next success story.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
                Tell us where the friction is. We&apos;ll tell you how we&apos;d fix it - no pitch
                deck required.
              </p>
              <Link
                to="/contact"
                className="btn-primary mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-bold"
              >
                Start a project <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Container>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
