import { createFileRoute, Link } from "@tanstack/react-router";
import { jsonLdStringify } from "@/lib/json-ld";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/Container";
import { GlowBlob } from "@/components/GlowBlob";
import { HeroWebVisual } from "@/components/HeroWebVisual";
import { JobCard } from "@/components/careers/JobCard";
import { JOBS, HIRING_PROCESS } from "@/lib/careers-data";
import {
  ArrowUpRight,
  Globe2,
  Handshake,
  Sparkles,
  Code2,
  GraduationCap,
  Rocket,
  Bot,
  TrendingUp,
  Target,
} from "lucide-react";

export const Route = createFileRoute("/careers/")({
  head: () => ({
    meta: [
      { title: "Careers - Ethixweb" },
      {
        name: "description",
        content:
          "Join Ethixweb, a small, remote first team building websites, AI automation, SEO and software for US businesses. Open roles in engineering and SEO.",
      },
      { property: "og:title", content: "Careers at Ethixweb" },
      { property: "og:description", content: "Open roles at a remote first, senior led team." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://ethixweb.com/ethixweb.png" },
      { property: "og:url", content: "https://ethixweb.com/careers" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Careers at Ethixweb" },
      {
        name: "twitter:description",
        content:
          "Join Ethixweb, a small, remote first team building websites, AI automation, SEO and software for US businesses.",
      },
      { name: "twitter:image", content: "https://ethixweb.com/ethixweb.png" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://ethixweb.com/careers" }],
    scripts: [
      {
        type: "application/ld+json",
        children: jsonLdStringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Open roles at Ethixweb",
          itemListElement: JOBS.map((job, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `https://ethixweb.com/careers/${job.slug}`,
            item: {
              "@type": "JobPosting",
              title: job.title,
              description: job.about,
              datePosted: "2026-01-01",
              employmentType: "FULL_TIME",
              hiringOrganization: {
                "@type": "Organization",
                name: "Ethixweb",
                sameAs: "https://ethixweb.com",
                logo: "https://ethixweb.com/ethixweb.png",
              },
              jobLocationType: "TELECOMMUTE",
              applicantLocationRequirements: { "@type": "Country", name: "India" },
            },
          })),
        }),
      },
    ],
  }),
  component: Careers,
});

// The 4 cards that matter most - shown large, each with a real photo.
// `modern-engineering-stack.webp` is an actual screenshot of this repo's
// own JobCard.tsx; the rest are free-to-use, no-attribution-required
// photos (Pexels license) chosen to match each value. Swap any of these
// for real Ethixweb photos/screenshots whenever they're available.
const PRIMARY_VALUES = [
  {
    icon: Rocket,
    t: "Real Client Impact",
    d: "Work directly on projects used by real US businesses.",
    image: "/images/careers/real-client-impact.webp",
    alt: "Team reviewing a client project together around a laptop",
    wide: true,
  },
  {
    icon: Code2,
    t: "Modern Engineering Stack",
    d: "React, Node.js, TypeScript, AI tools and modern workflows.",
    image: "/images/careers/modern-engineering-stack.webp",
    alt: "Code editor showing a real React component from the Ethixweb codebase",
    wide: false,
  },
  {
    icon: Bot,
    t: "AI First Workflow",
    d: "AI assisted planning, development, testing and productivity.",
    image: "/images/careers/ai-first-workflow.webp",
    alt: "Abstract visualization of an AI neural network",
    wide: false,
  },
  {
    icon: Globe2,
    t: "Flexible Remote Work",
    d: "Work from anywhere in India with an async first culture built on trust and ownership.",
    image: "/images/careers/flexible-remote-work.webp",
    alt: "Laptop screen showing a remote team video call",
    wide: true,
  },
];

// Supporting values - shown second, same card treatment as the 4 above,
// just without the wide/featured layout.
const SECONDARY_VALUES = [
  {
    icon: Target,
    t: "Ownership & Responsibility",
    d: "Own complete features and projects from idea to deployment.",
    image: "/images/careers/ownership-responsibility.webp",
    alt: "Person focused on their laptop at a shared workspace",
  },
  {
    icon: TrendingUp,
    t: "Fast Career Growth",
    d: "Small team, bigger responsibility and faster career progression.",
    image: "/images/careers/fast-career-growth.webp",
    alt: "Person presenting an upward-trending growth chart",
  },
  {
    icon: Handshake,
    t: "Direct Collaboration",
    d: "Work closely with founders and US clients, no unnecessary layers.",
    image: "/images/careers/direct-collaboration.webp",
    alt: "Team gathered around a table collaborating together",
  },
  {
    icon: GraduationCap,
    t: "Continuous Learning",
    d: "Regular mentorship and exposure to new tools and technologies.",
    image: "/images/careers/continuous-learning.webp",
    alt: "Person studying with books and a laptop",
  },
];

function CardPhoto({ src, alt, aspect }: { src: string; alt: string; aspect: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ring-1 ring-white/8 ${aspect}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
    </div>
  );
}

function Careers() {
  const reduceMotion = useReducedMotion();
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  return (
    <SiteLayout>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative -mt-24 overflow-hidden bg-gradient-hero pb-16 pt-36 sm:pb-24 sm:pt-44">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <GlowBlob
          size="lg"
          color="primary"
          blur={100}
          className="left-1/2 top-0 -translate-x-1/2"
        />
        <div className="pointer-events-none absolute inset-x-0 top-32 mx-auto w-full max-w-5xl scale-110 opacity-15">
          <HeroWebVisual showBadges={false} />
        </div>

        <Container className="relative flex flex-col items-center text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_18px_rgba(138,24,28,0.9)]" />
              We&apos;re hiring
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-7 max-w-3xl pb-1 text-[clamp(2.4rem,5.4vw,4.5rem)] font-extrabold leading-[1.05] text-gradient">
              Join the team that&apos;s building the future of digital operations.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
              We&apos;re a small, remote first team helping US businesses grow through modern
              websites, AI automation, SEO, and software engineering.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="#open-positions"
                className="magnetic group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-bold text-primary-foreground shadow-glow"
              >
                View Open Positions
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </a>
              <a
                href="#life-at-ethixweb"
                className="magnetic inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4.5 px-7 py-3.5 font-bold text-foreground hover:border-primary/40 hover:bg-primary/10"
              >
                Life at Ethixweb
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── Life at Ethixweb ─────────────────────────────────────────────── */}
      <section id="life-at-ethixweb" className="py-20">
        <Container>
          <Reveal>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-4 text-sm uppercase tracking-widest text-primary-text">
                Life at Ethixweb
              </p>
              <h2 className="font-display text-5xl font-bold text-gradient pb-1">
                Built for people who like to build.
              </h2>
            </div>
          </Reveal>
          {/* Primary values - the 4 that matter most, shown large with a
              photo each. Wide cards alternate with narrow ones so the grid
              reads as a deliberate layout, not a repeated tile. */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRIMARY_VALUES.map((item, i) => (
              <Reveal
                key={item.t}
                delay={i * 0.06}
                className={item.wide ? "sm:col-span-2 lg:col-span-2" : "lg:col-span-1"}
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="premium-card flex h-full flex-col rounded-3xl p-6"
                >
                  <CardPhoto
                    src={item.image}
                    alt={item.alt}
                    aspect={item.wide ? "aspect-[16/7]" : "aspect-[4/3]"}
                  />
                  <span className="relative -mt-7 ml-1 flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-glow ring-1 ring-white/15">
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent" />
                    <item.icon className="relative h-6 w-6" strokeWidth={2} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold">{item.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.d}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Supporting values - same card treatment as the 4 above, just
              standard-size (no wide/featured cards) so the primary 4 still
              read first without these four losing their presence. */}
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SECONDARY_VALUES.map((item, i) => (
              <Reveal key={item.t} delay={0.3 + i * 0.05}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="premium-card flex h-full flex-col rounded-3xl p-6"
                >
                  <CardPhoto src={item.image} alt={item.alt} aspect="aspect-[4/3]" />
                  <span className="relative -mt-7 ml-1 flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-glow ring-1 ring-white/15">
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent" />
                    <item.icon className="relative h-6 w-6" strokeWidth={2} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold">{item.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.d}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Hiring process timeline ──────────────────────────────────────── */}
      <section className="py-20">
        <Container>
          <Reveal>
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <p className="mb-4 text-sm uppercase tracking-widest text-primary-text">
                Hiring process
              </p>
              <h2 className="font-display text-5xl font-bold text-gradient pb-1">
                A clear path from application to offer.
              </h2>
            </div>
          </Reveal>

          <div className="relative">
            <div
              className="absolute top-[17px] hidden h-1.5 overflow-hidden rounded-full lg:block"
              style={{
                left: `${(0.5 / HIRING_PROCESS.length) * 100}%`,
                right: `${(0.5 / HIRING_PROCESS.length) * 100}%`,
              }}
              aria-hidden="true"
            >
              {/* Faint rail for the full path */}
              <div className="absolute inset-0 bg-primary/15" />
              {/* Loading-style sweep that keeps travelling the path on a loop,
                  instead of a one-time draw that then just sits static */}
              {!reduceMotion && (
                <motion.div
                  className="absolute top-0 h-full w-1/4 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent"
                  animate={{ left: ["-25%", "100%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              {/* Hover progress fill - hovering step N solidly lights up the
                  path from step 1 through step N */}
              <motion.div
                className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-primary"
                animate={{
                  scaleX: hoveredStep !== null ? hoveredStep / (HIRING_PROCESS.length - 1) : 0,
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>
            <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {HIRING_PROCESS.map((step, i) => (
                <Reveal key={step.title} as="li" delay={i * 0.08} className="group relative">
                  <motion.div
                    whileHover={{ y: -6 }}
                    onHoverStart={() => setHoveredStep(i)}
                    onHoverEnd={() => setHoveredStep(null)}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="flex flex-col items-start lg:items-center lg:text-center"
                  >
                    <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-white shadow-glow transition-transform duration-300 group-hover:scale-110">
                      {i + 1}
                    </span>
                    <h3 className="mt-4 font-display text-base font-semibold transition-colors duration-300 group-hover:text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </motion.div>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* ── Open positions ───────────────────────────────────────────────── */}
      <section id="open-positions" className="py-20">
        <Container>
          <Reveal>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-4 text-sm uppercase tracking-widest text-primary-text">
                Open positions
              </p>
              <h2 className="font-display text-5xl font-bold text-gradient pb-1">
                Roles we&apos;re hiring for right now.
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-2">
            {JOBS.map((job, i) => (
              <Reveal key={job.id} delay={i * 0.08}>
                <JobCard job={job} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <section className="py-24">
        <Container className="premium-card web-card web-card-feature relative overflow-hidden rounded-4xl px-6 py-16 text-center sm:px-12 lg:py-20">
          <div className="absolute inset-0 ambient-red opacity-80" />
          <div className="absolute inset-0 grid-bg opacity-30" />
          <span className="web-corner" aria-hidden="true" />
          <Reveal>
            <div className="relative mx-auto max-w-2xl">
              <Sparkles className="mx-auto h-9 w-9 text-primary" strokeWidth={1.5} />
              <h2 className="mt-5 pb-1 text-5xl font-extrabold leading-tight text-gradient">
                Don&apos;t see the right role?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                We&apos;re always open to meeting senior, curious people. Send us a general
                application and we&apos;ll reach out if there&apos;s a fit.
              </p>
              <div className="mt-9">
                <Link
                  to="/careers/apply"
                  search={{ role: "general" }}
                  className="magnetic group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-bold text-primary-foreground shadow-glow"
                >
                  Send a general application
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </SiteLayout>
  );
}
