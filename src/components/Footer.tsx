import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Linkedin, Instagram, Facebook, ArrowUpRight, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Revamp your online presence with bespoke designs crafted for your business success.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { Icon: Facebook, href: "#", label: "Facebook" },
                {
                  Icon: Linkedin,
                  href: "https://www.linkedin.com/company/ethixweb/",
                  label: "LinkedIn",
                },
                { Icon: Instagram, href: "#", label: "Instagram" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="p-2 rounded-lg glass hover:bg-white/10 transition"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-primary mt-0.5" />
                <a
                  href="mailto:info@ethixweb.com"
                  className="text-foreground/85 hover:text-primary"
                >
                  info@ethixweb.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-foreground/85">Mon–Fri · 9:00 AM – 5:00 PM</span>
              </li>
            </ul>
          </div>

          <FooterCol
            title="Company"
            links={[
              ["About", "/about"],
              ["Industries", "/industries"],
              ["Our Work", "/portfolio"],
              ["Blog", "/blog"],
              ["Contact", "/contact"],
            ]}
          />
          <FooterCol
            title="Useful Links"
            links={[
              ["Cancellation & Refunds", "/policies/refunds"],
              ["Shipping Policy", "/policies/shipping"],
              ["Terms & Conditions", "/policies/terms"],
              ["Privacy Policy", "/policies/privacy"],
            ]}
          />
        </div>
        <div className="footer-divider mt-16 flex flex-col gap-4 sm:flex-row items-center justify-between border-t border-border pt-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Ethixweb. All rights reserved.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Book an appointment{" "}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map(([label, to]) => (
          <li key={to}>
            <Link
              to={to}
              className="text-sm text-foreground/80 hover:text-primary transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
