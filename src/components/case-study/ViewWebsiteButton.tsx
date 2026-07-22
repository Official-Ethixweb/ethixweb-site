import { cn } from "@/lib/utils";

/** Outlined pill button repeated three times down the page (hero, after the
 * showcase image, after Mobile First) - always the same shape, so it's one
 * component instead of three copy-pasted `<a>` tags. */
export function ViewWebsiteButton({
  href,
  label = "View Website",
  className = "",
}: {
  href: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "magnetic inline-flex items-center justify-center rounded-full border-[1.5px] border-foreground/85 px-8 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-foreground hover:text-background",
        className,
      )}
    >
      {label}
    </a>
  );
}
