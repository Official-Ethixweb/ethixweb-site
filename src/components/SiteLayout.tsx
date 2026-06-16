import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ThemeProvider } from "./ThemeProvider";
import { useClickSound } from "@/hooks/useClickSound";

function Inner({ children }: { children: ReactNode }) {
  useClickSound();
  return (
    <div className="site-vignette relative min-h-screen bg-background text-foreground">
      <div className="dust-field" />
      <div className="relative z-10">
        <Navbar />
        <main className="pt-24">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <Inner>{children}</Inner>
    </ThemeProvider>
  );
}
