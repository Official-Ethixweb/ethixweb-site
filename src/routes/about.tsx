import { createFileRoute, Link } from "@tanstack/react-router";
import { jsonLdStringify } from "@/lib/json-ld";
import { motion, useReducedMotion } from "framer-motion";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SignalTrace } from "@/components/SignalTrace";
import { SystemConstellation } from "@/components/SystemConstellation";
import { Container } from "@/components/Container";
import { GlowBlob } from "@/components/GlowBlob";
import { CardGrid } from "@/components/CardGrid";
import { WebSpotlight } from "@/components/WebSpotlight";
import { trackWebSpotlight } from "@/lib/web-spotlight";
import { Target, Heart, Zap, ArrowUpRight, Compass, Eye, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About - Ethixweb" },
      {
        name: "description",
        content:
          "Ethixweb is a small, senior team helping US home service contractors grow with marketing that moves revenue.",
      },
      { property: "og:title", content: "About Ethixweb" },
      {
        property: "og:description",
        content: "Our story, how we work and why home service contractors trust us.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://ethixweb.com/ethixweb.png" },
      { property: "og:url", content: "https://ethixweb.com/about" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About Ethixweb" },
      {
        name: "twitter:description",
        content: "Our story, how we work and why home service contractors trust us.",
      },
      { name: "twitter:image", content: "https://ethixweb.com/ethixweb.png" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://ethixweb.com/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: jsonLdStringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Ethixweb",
          url: "https://ethixweb.com/about",
          description:
            "Ethixweb is a small, senior team helping US home service contractors grow with marketing that moves revenue.",
          mainEntity: {
            "@type": "Organization",
            name: "Ethixweb",
            url: "https://ethixweb.com",
            logo: "https://ethixweb.com/ethixweb.png",
            email: "akash@ethixweb.com",
            foundingDate: "2020",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Kent",
              addressRegion: "WA",
              addressCountry: "US",
            },
            sameAs: [
              "https://www.linkedin.com/company/ethixweb/",
              "https://www.instagram.com/ethix.web/",
            ],
          },
        }),
      },
    ],
  }),
  component: About,
});

const PROCESS_STEPS = [
  {
    n: "01",
    t: "Discover & strategize",
    d: "We dig into your business, customers, and competitors to build a plan focused on revenue, not vanity metrics.",
  },
  {
    n: "02",
    t: "Design & build",
    d: "Senior designers and developers create a fast, conversion focused site or system, built right the first time.",
  },
  {
    n: "03",
    t: "Launch & optimize",
    d: "We ship in weeks, not months, then track real data to refine messaging, design, and performance.",
  },
  {
    n: "04",
    t: "Grow & scale",
    d: "Once the foundation works, we double down on what's driving results and scale it across channels.",
  },
];

const STATS = [
  { value: "2-4 wks", label: "Typical time to launch" },
  { value: "100%", label: "Senior led delivery" },
  { value: "24/7", label: "Global availability" },
  { value: "5.0", label: "Avg. client rating" },
];

const TEAM_NODES = [
  { label: "Strategy" },
  { label: "Design" },
  { label: "Engineering" },
  { label: "Growth" },
];

const PROCESS_NODES = [
  { label: "Discover" },
  { label: "Design" },
  { label: "Launch" },
  { label: "Grow" },
];

const REASONS = [
  "Direct access to senior developers & strategists",
  "Transparent pricing, no hidden retainers",
  "Decisions backed by data, not guesswork",
  "Fast turnarounds without cutting corners",
  "Ongoing support after launch",
  "US focused communication & operations",
];

function About() {
  const reduceMotion = useReducedMotion();
  return (
    <SiteLayout>
      <PageHero
        eyebrow="About us"
        title={
          <>
            A small, senior team. No account{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #D13A40 0%, #B32228 50%, #8A181C 100%)",
              }}
            >
              managers.
            </span>
          </>
        }
      >
        <span className="light:text-foreground">
          Ethixweb is a digital marketing &amp; web development agency built for businesses that
          want measurable growth, not marketing noise.
        </span>
      </PageHero>

      <section className="relative py-20">
        <GlowBlob
          size="lg"
          color="primary"
          blur={120}
          className="right-0 top-1/2 -translate-y-1/2 opacity-50"
        />
        <Container className="relative grid items-center gap-16 sm:grid-cols-2">
          <Reveal>
            <motion.div
              className="relative mx-auto max-w-80"
              animate={{ y: reduceMotion ? 0 : [0, -10, 0] }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 7, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <div className="absolute inset-6 rounded-full bg-primary/[0.14] blur-[90px]" />
              <div className="relative aspect-320/468 sm:h-117 sm:aspect-auto">
                <SystemConstellation nodes={TEAM_NODES} className="p-8" />
              </div>
            </motion.div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="max-w-xl">
              <p className="text-sm uppercase tracking-widest text-primary-text">Our story</p>
              <h2 className="mt-5 font-display text-4xl font-bold leading-[1.15] tracking-tight text-gradient pb-1">
                Built for contractors tired of big agency theater.
              </h2>
              <p className="mt-7 text-muted-foreground leading-relaxed">
                We started Ethixweb because we were tired of watching good businesses get mediocre
                results from agencies that overpromise and underdeliver.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We're a tight knit team of developers, designers, and strategists, each senior in
                their craft. When you work with Ethixweb, you work directly with the people building
                your project. No account managers passing messages. No juniors learning on your
                budget.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <Reveal>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-4 text-sm uppercase tracking-widest text-primary-text">
                What drives us
              </p>
              <h2 className="font-display text-5xl font-bold text-gradient pb-1">
                Mission &amp; vision
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal delay={0.05}>
              <div
                onMouseMove={trackWebSpotlight}
                className="group relative h-full overflow-hidden rounded-3xl glass p-8 lg:p-10"
              >
                <WebSpotlight size="lg" />
                <Compass className="h-10 w-10 text-primary mb-6" strokeWidth={1.5} />
                <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary-text">
                  Our mission
                </p>
                <h3 className="font-display text-2xl font-semibold">
                  Turn marketing spend into measurable revenue.
                </h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Every project we take on is judged the same way: did it move the needle on
                  bookings, leads, and revenue? We build websites and systems that earn their place
                  in your budget.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div
                onMouseMove={trackWebSpotlight}
                className="group relative h-full overflow-hidden rounded-3xl glass p-8 lg:p-10"
              >
                <WebSpotlight size="lg" />
                <Eye className="h-10 w-10 text-primary mb-6" strokeWidth={1.5} />
                <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary-text">
                  Our vision
                </p>
                <h3 className="font-display text-2xl font-semibold">
                  The senior team contractors call first.
                </h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We're building Ethixweb into the go to growth partner for home service businesses
                  - known for senior craftsmanship, straight talk, and results you can point to.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1fr_1.5fr] lg:items-start">
            <Reveal>
              <div>
                <p className="mb-4 text-sm uppercase tracking-widest text-primary-text">
                  How we work
                </p>
                <h2 className="font-display text-5xl font-bold text-gradient pb-1">
                  A clear process. Zero guesswork.
                </h2>
                <p className="mt-6 text-muted-foreground leading-relaxed">
                  From the first call to launch day, you'll always know what's happening, why, and
                  what's next. No black boxes, no surprise invoices.
                </p>
                <div className="relative mx-auto mt-10 hidden h-64 w-full max-w-xs lg:block">
                  <div className="absolute inset-8 rounded-full bg-primary/15 blur-[80px]" />
                  <SystemConstellation nodes={PROCESS_NODES} className="p-6" />
                </div>
              </div>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2">
              {PROCESS_STEPS.map((s, i) => (
                <Reveal key={s.t} delay={i * 0.08}>
                  <div
                    onMouseMove={trackWebSpotlight}
                    className="group relative h-full overflow-hidden rounded-3xl glass p-8 hover:bg-white/[0.06] transition"
                  >
                    <WebSpotlight />
                    <div className="font-display text-5xl font-bold text-gradient-brand">{s.n}</div>
                    <h3 className="mt-4 font-display text-xl font-semibold">{s.t}</h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <Reveal>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-4 text-sm uppercase tracking-widest text-primary-text">
                What we stand for
              </p>
              <h2 className="font-display text-5xl font-bold text-gradient pb-1">
                Core values that shape everything we build.
              </h2>
            </div>
          </Reveal>
          <CardGrid
            items={[
              {
                icon: Target,
                title: "Revenue obsessed",
                description:
                  "We measure success in booked jobs and revenue, not impressions, clicks or awards.",
              },
              {
                icon: Heart,
                title: "Senior team only",
                description:
                  "You talk directly to the people doing the work. No layers, no handoffs, no jargon.",
              },
              {
                icon: Zap,
                title: "Move fast, ship clean",
                description:
                  "Lean process, weekly iteration. We launch in weeks and optimize forever.",
              },
            ]}
          />
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <Reveal>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-4 text-sm uppercase tracking-widest text-primary-text">
                Why Ethixweb
              </p>
              <h2 className="font-display text-5xl font-bold text-gradient pb-1">
                Why clients choose us and stay.
              </h2>
            </div>
          </Reveal>

          <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06}>
                <div
                  onMouseMove={trackWebSpotlight}
                  className="group relative h-full overflow-hidden rounded-3xl glass p-6 text-center"
                >
                  <WebSpotlight />
                  <p className="font-display text-5xl font-bold text-gradient-brand">{s.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="glass-strong rounded-[2rem] relative overflow-hidden p-8 sm:p-10 lg:p-12">
              <GlowBlob size="sm" color="primary" blur={100} className="-right-20 -top-20" />
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr] lg:items-center">
                <div className="grid gap-4 sm:grid-cols-2">
                  {REASONS.map((r) => (
                    <div
                      key={r}
                      className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                      <span className="text-sm text-foreground/85">{r}</span>
                    </div>
                  ))}
                </div>
                <div className="relative mx-auto hidden h-64 w-full max-w-xs lg:block">
                  <div className="absolute inset-8 rounded-full bg-primary/15 blur-[80px]" />
                  <SignalTrace className="h-full w-full opacity-60" />
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-16">
        <Container size="narrow">
          <Reveal>
            <div className="glass rounded-3xl p-8 text-center sm:p-10">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary-text">
                US Business Entity
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Ethixweb operates in the United States through{" "}
                <span className="font-semibold text-foreground">Ethixweb USA LLC</span>, a
                Wyoming-registered company. When you work with us, you're contracting with a US
                business entity, providing additional confidence, transparency, and accountability.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="premium-card relative overflow-hidden rounded-4xl px-6 py-16 text-center sm:px-12 lg:py-24">
            <div className="absolute inset-0 ambient-red opacity-80" />
            <div className="absolute inset-0 grid-bg opacity-30" />
            <Reveal>
              <div className="relative mx-auto max-w-3xl">
                <h2 className="pb-1 text-7xl font-extrabold leading-tight text-gradient">
                  Ready for a sharper digital operation?
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                  Bring us the messy stack, missed leads, slow site, or stalled automation. We will
                  turn it into a system.
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <Link
                    to="/contact"
                    className="magnetic group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-bold text-primary-foreground shadow-glow"
                  >
                    Start a project
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                  </Link>
                  <Link
                    to="/portfolio"
                    className="magnetic inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4.5 px-7 py-3.5 font-bold text-foreground hover:border-primary/40 hover:bg-primary/10"
                  >
                    See our work
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
