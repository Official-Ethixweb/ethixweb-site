import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const SIZES = {
  narrow: "max-w-3xl",
  medium: "max-w-5xl",
  default: "max-w-7xl",
  wide: "max-w-(--breakpoint-3xl)",
} as const;

export function Container({
  size = "default",
  className,
  children,
}: {
  size?: keyof typeof SIZES;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full px-4 xs:px-6 lg:px-8", SIZES[size], className)}>
      {children}
    </div>
  );
}
