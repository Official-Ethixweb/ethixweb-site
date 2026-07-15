// Shared Tailwind classes for the labeled-input pattern used by both
// contact.tsx and careers.apply.tsx's form fields, so the two forms'
// inputs/labels can't drift out of sync when one gets restyled.
export const formLabelClass = "text-xs uppercase tracking-widest text-muted-foreground";

export const formInputClass =
  "mt-2 w-full rounded-xl border border-border bg-input/60 px-4 py-3 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition";
