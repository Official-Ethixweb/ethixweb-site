import { createFileRoute } from "@tanstack/react-router";
import { jsonLdStringify } from "@/lib/json-ld";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/Container";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog - Ethixweb" },
      { name: "description", content: "Essays on design, AI and growth from the Ethixweb team." },
      { property: "og:title", content: "Ethixweb Blog" },
      { property: "og:description", content: "Insights on design, AI and growth." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://ethixweb.com/ethixweb.png" },
      { property: "og:url", content: "https://ethixweb.com/blog" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ethixweb Blog" },
      {
        name: "twitter:description",
        content: "Essays on design, AI and growth from the Ethixweb team.",
      },
      { name: "twitter:image", content: "https://ethixweb.com/ethixweb.png" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://ethixweb.com/blog" }],
    scripts: [
      {
        type: "application/ld+json",
        children: jsonLdStringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Ethixweb Blog",
          url: "https://ethixweb.com/blog",
          description: "Essays on design, AI and growth from the Ethixweb team.",
          publisher: {
            "@type": "Organization",
            name: "Ethixweb",
            url: "https://ethixweb.com",
            logo: "https://ethixweb.com/ethixweb.png",
          },
          inLanguage: "en-US",
        }),
      },
    ],
  }),
  component: Blog,
});

const posts = [
  {
    t: "Why your landing page isn't converting",
    c: "Growth",
    r: "6 min read",
    d: "The 7 elements every modern hero section needs in 2026.",
  },
  {
    t: "Building an AI support agent in 14 days",
    c: "AI",
    r: "8 min read",
    d: "How we shipped a production agent for ShipForge.",
  },
  {
    t: "Brand systems that scale with you",
    c: "Design",
    r: "5 min read",
    d: "Designing identities that survive ten product pivots.",
  },
  {
    t: "SEO is dead. Long live SEO.",
    c: "SEO",
    r: "7 min read",
    d: "What AI search means for organic growth.",
  },
];

function Blog() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Journal" title="Field notes from the build.">
        Tactics, essays and case studies on shipping great digital work.
      </PageHero>
      <section className="py-20">
        <h2 className="sr-only">Latest posts</h2>
        <Container size="medium" className="grid gap-5">
          {posts.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.06}>
              <a
                href="#"
                className="group block glass rounded-3xl p-8 hover:bg-white/[0.06] transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="text-primary uppercase tracking-widest">{p.c}</span>
                      <span>·</span>
                      <span>{p.r}</span>
                    </div>
                    <h3 className="mt-3 font-display text-3xl font-semibold">{p.t}</h3>
                    <p className="mt-2 text-muted-foreground">{p.d}</p>
                  </div>
                  <ArrowUpRight className="h-6 w-6 shrink-0 text-primary group-hover:rotate-45 transition" />
                </div>
              </a>
            </Reveal>
          ))}
        </Container>
      </section>
    </SiteLayout>
  );
}
