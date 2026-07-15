import { createFileRoute } from "@tanstack/react-router";
import { jsonLdStringify } from "@/lib/json-ld";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { CardGrid } from "@/components/CardGrid";
import { Reveal } from "@/components/Reveal";
import {
  Code2,
  Megaphone,
  Search,
  Palette,
  BarChart3,
  PhoneCall,
  ShoppingCart,
  Share2,
} from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services - Ethixweb" },
      {
        name: "description",
        content:
          "Websites, Google Ads, Local Services Ads, SEO, conversion tracking and lead gen for US home service businesses.",
      },
      { property: "og:title", content: "Ethixweb Services" },
      {
        property: "og:description",
        content: "Marketing services for plumbing, HVAC and electrical contractors.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://ethixweb.com/ethixweb.png" },
      { property: "og:url", content: "https://ethixweb.com/services" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ethixweb Services" },
      {
        name: "twitter:description",
        content:
          "Websites, Google Ads, Local Services Ads, SEO, conversion tracking and lead gen for US home service businesses.",
      },
      { name: "twitter:image", content: "https://ethixweb.com/ethixweb.png" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://ethixweb.com/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: jsonLdStringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Ethixweb Services",
          url: "https://ethixweb.com/services",
          description:
            "Websites, Google Ads, Local Services Ads, SEO, conversion tracking and lead gen for US home service businesses.",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Website Design & Development",
              url: "https://ethixweb.com/web-development",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "AI & Workflow Automation",
              url: "https://ethixweb.com/ai-automation",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Social Media Marketing",
              url: "https://ethixweb.com/marketing",
            },
            {
              "@type": "ListItem",
              position: 4,
              name: "Graphic Design & Branding",
              url: "https://ethixweb.com/graphic-design",
            },
          ],
        }),
      },
    ],
  }),
  component: Services,
});

const items = [
  {
    icon: Code2,
    title: "Website Design & Dev",
    description: "WordPress, Astro and headless builds: fast, mobile first, built to convert.",
    to: "/web-development",
  },
  {
    icon: Megaphone,
    title: "Google Ads",
    description:
      "Search campaigns managed by senior media buyers, optimized weekly for booked jobs.",
    to: "/marketing",
  },
  {
    icon: PhoneCall,
    title: "Local Services Ads",
    description: "Google LSA setup, verification and optimization for top of page placement.",
    to: "/marketing",
  },
  {
    icon: Search,
    title: "SEO & Local SEO",
    description: "Technical SEO, content engines, GBP optimization and local authority building.",
    to: "/services",
  },
  {
    icon: BarChart3,
    title: "Conversion Tracking",
    description: "GA4, GTM and CallRail setup so every lead is attributed to its real source.",
    to: "/services",
  },
  {
    icon: Share2,
    title: "Social & Content",
    description: "Social media management and content that builds trust in your local market.",
    to: "/marketing",
  },
  {
    icon: Palette,
    title: "Brand & Creative",
    description:
      "Identity, ad creative and photography direction that looks trustworthy and premium.",
    to: "/services",
  },
  {
    icon: ShoppingCart,
    title: "CRM & Lead Systems",
    description:
      "CRM integrations, lifecycle flows and lead routing that turn calls into customers.",
    to: "/ai-automation",
  },
];

function Services() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Services" title="Everything a home service business needs to grow.">
        Websites, ads, SEO and tracking, handled by a senior team that actually answers the phone.
      </PageHero>
      <section className="py-20">
        <Container>
          <Reveal>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-4 text-sm uppercase tracking-widest text-primary-text">
                What we offer
              </p>
              <h2 className="font-display text-5xl font-bold text-gradient pb-1">
                Everything under one roof.
              </h2>
            </div>
          </Reveal>
          <CardGrid items={items} cols={4} />
        </Container>
      </section>
    </SiteLayout>
  );
}
