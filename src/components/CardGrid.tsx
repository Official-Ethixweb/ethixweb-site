import { Link } from "@tanstack/react-router";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export type CardGridItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  to?: string;
};

const COLS = {
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

// One responsive convention for the icon-card grid pattern repeated across
// services/industries/automation/marketing/web-development pages, which
// previously used several different, inconsistent breakpoint schemes for the
// same layout.
export function CardGrid({
  items,
  cols = 3,
  className,
}: {
  items: CardGridItem[];
  cols?: keyof typeof COLS;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-5", COLS[cols], className)}>
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 0.05}>
          <IconCard {...item} />
        </Reveal>
      ))}
    </div>
  );
}

export function IconCard({ icon: Icon, title, description, to }: CardGridItem) {
  const content = (
    <>
      <Icon className="mb-5 h-9 w-9 text-primary" strokeWidth={1.5} />
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {to && (
        <ArrowUpRight className="mt-5 h-4 w-4 text-primary transition group-hover:rotate-45" />
      )}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="glass group block h-full rounded-3xl p-7 transition hover:bg-white/[0.06]"
      >
        {content}
      </Link>
    );
  }

  return <div className="glass h-full rounded-3xl p-7">{content}</div>;
}
