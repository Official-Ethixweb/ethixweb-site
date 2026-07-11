import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "cmdk";
import { ArrowUpRight, Search } from "lucide-react";
import { links } from "./Navbar";

const ACTIONS = [{ to: "/contact", label: "Start a project" }];

/**
 * Real site navigation, not a decorative widget - the `⌘K` / `Ctrl+K` idea borrowed from the
 * Signal Systems plan's Control Room concept. Uses the `cmdk` dependency that was already
 * installed but unused.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const go = (to: string) => {
    setOpen(false);
    navigate({ to });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground lg:h-auto lg:w-auto lg:gap-2 lg:rounded-full lg:border lg:border-border lg:px-3 lg:py-1.5"
      >
        <Search className="h-4 w-4" />
        <span className="hidden font-mono text-xs text-muted-foreground/70 lg:inline">⌘K</span>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        label="Search Ethixweb"
        overlayClassName="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm"
        contentClassName="glass-strong fixed left-1/2 top-6 z-100 flex max-h-[85vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 flex-col overflow-hidden rounded-2xl text-foreground sm:top-24"
      >
        <DialogPrimitive.Title className="sr-only">Search Ethixweb</DialogPrimitive.Title>
        <DialogPrimitive.Description className="sr-only">
          Search pages and jump to actions across the site.
        </DialogPrimitive.Description>
        <div className="flex items-center gap-2 border-b border-white/10 px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground/60" />
          <CommandInput
            placeholder="Search pages…"
            className="w-full bg-transparent py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
          />
        </div>
        <CommandList className="min-h-0 flex-1 overflow-y-auto p-2">
          <CommandEmpty className="px-4 py-6 text-center text-sm text-muted-foreground">
            No results found.
          </CommandEmpty>
          <CommandGroup
            heading="Pages"
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-muted-foreground/50"
          >
            {links.map((link) => (
              <CommandItem
                key={link.to}
                value={link.label}
                onSelect={() => go(link.to)}
                className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2.5 text-sm text-foreground/85 data-[selected=true]:bg-primary/12 data-[selected=true]:text-foreground"
              >
                {link.label}
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40" />
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup
            heading="Actions"
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-muted-foreground/50"
          >
            {ACTIONS.map((action) => (
              <CommandItem
                key={action.to}
                value={action.label}
                onSelect={() => go(action.to)}
                className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2.5 text-sm font-semibold text-primary data-[selected=true]:bg-primary/12"
              >
                {action.label}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
