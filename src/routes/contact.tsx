import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - Ethixweb" },
      { name: "description", content: "Get in touch with Ethixweb. Tell us about your project." },
      { property: "og:title", content: "Contact Ethixweb" },
      { property: "og:description", content: "Start a project with our team." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <SiteLayout>
      <PageHero eyebrow="Contact" title="Let's get you more booked jobs.">
        Tell us about your business. We'll reply within one business day with a clear, no-jargon
        plan.
      </PageHero>
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1fr_1.4fr] gap-8">
          <Reveal>
            <div className="glass-strong rounded-3xl p-8 h-full">
              <h3 className="font-display text-2xl font-semibold">Reach out directly</h3>
              <div className="mt-8 space-y-5">
                {[
                  { i: Mail, l: "Email Us", v: "info@ethixweb.com" },
                  { i: MapPin, l: "Hours", v: "Mon–Fri · 9:00 AM – 5:00 PM" },
                ].map(({ i: I, l, v }) => (
                  <div key={l} className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-primary/15 text-primary">
                      <I className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">{l}</p>
                      <p className="mt-1">{v}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                e.currentTarget.reset();
              }}
              className="glass-strong rounded-3xl p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name" name="name" />
                <Field label="Email" name="email" type="email" />
              </div>
              <Field label="Company" name="company" />
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">
                  Project details
                </label>
                <textarea
                  required
                  rows={5}
                  className="mt-2 w-full rounded-xl bg-background/40 border border-white/10 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                />
              </div>
              <button
                type="submit"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium shadow-glow"
              >
                {sent ? "Thank you - we'll be in touch!" : "Send message"}{" "}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        className="mt-2 w-full rounded-xl bg-background/40 border border-white/10 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
      />
    </div>
  );
}
