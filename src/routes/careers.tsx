import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRight, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers - Ethixweb" },
      {
        name: "description",
        content: "Join Ethixweb. We hire senior, curious and kind humans who love to build.",
      },
      { property: "og:title", content: "Careers at Ethixweb" },
      { property: "og:description", content: "Open roles at a remote-first premium agency." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://ethixweb.com/ethixweb.png" },
      { property: "og:url", content: "https://ethixweb.com/careers" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Careers at Ethixweb" },
      { name: "twitter:description", content: "Join Ethixweb. We hire senior, curious and kind humans who love to build." },
      { name: "twitter:image", content: "https://ethixweb.com/ethixweb.png" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://ethixweb.com/careers" }],
  }),
  component: Careers,
});

const roles = [
  { t: "Senior Full-Stack Engineer", l: "Remote", type: "Full-time" },
  { t: "AI Engineer", l: "Remote", type: "Full-time" },
  { t: "Product Designer", l: "Remote", type: "Full-time" },
  { t: "Performance Marketer", l: "Remote", type: "Contract" },
];

function Careers() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Careers" title="Make work you're proud of.">
        Remote-first. Senior team. Real ownership. Real impact.
      </PageHero>
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl grid gap-4">
          {roles.map((r, i) => (
            <Reveal key={r.t} delay={i * 0.06}>
              <Link
                to="/contact"
                className="group glass rounded-2xl p-6 flex items-center justify-between gap-6 hover:bg-white/[0.06] transition"
              >
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-semibold">{r.t}</h3>
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {r.l}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {r.type}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="h-6 w-6 text-primary group-hover:rotate-45 transition" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
