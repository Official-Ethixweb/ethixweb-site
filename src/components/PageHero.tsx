import { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: ReactNode;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative -mt-24 pt-40 pb-20 bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-72 w-[40rem] bg-primary/30 blur-[120px] rounded-full" />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
          <h1 className="mt-5 font-display text-5xl lg:text-7xl font-bold text-gradient leading-[1.05]">
            {title}
          </h1>
          {children && (
            <div className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">{children}</div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
