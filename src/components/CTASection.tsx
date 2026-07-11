import { Link } from "@tanstack/react-router";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { Container } from "./Container";
import { GlowBlob } from "./GlowBlob";
import { Reveal } from "./Reveal";

export function CTASection({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaTo,
  glow = true,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  ctaLabel: string;
  ctaTo: string;
  glow?: boolean;
}) {
  return (
    <section className="px-4 py-16 xs:px-6 sm:py-20 lg:py-24">
      <Reveal>
        <Container>
          <div className="glass-strong relative overflow-hidden rounded-[2rem] p-8 text-center sm:p-12">
            {glow && (
              <GlowBlob size="lg" color="primary" className="-top-24 left-1/2 -translate-x-1/2" />
            )}
            {Icon && <Icon className="relative mx-auto mb-4 h-10 w-10 text-primary" />}
            <h2 className="relative font-display text-4xl font-bold text-gradient pb-1">{title}</h2>
            {description && (
              <p className="relative mx-auto mt-4 max-w-lg text-muted-foreground">{description}</p>
            )}
            <Link
              to={ctaTo}
              className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
            >
              {ctaLabel} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </Reveal>
    </section>
  );
}
