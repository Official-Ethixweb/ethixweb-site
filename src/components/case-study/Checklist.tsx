import { CheckCircle2 } from "lucide-react";

/** Red check-circle bullet list, reused by spotlight cards and tech-stack rows. */
export function Checklist({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-2.5 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/85">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-text" strokeWidth={2} />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}
