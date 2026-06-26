"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Phone,
  MessageCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import { DynamicIcon } from "@/lib/icons";
import { motion, AnimatePresence } from "framer-motion";
import type { NavItem } from "@/types";

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

// ── Profil Dropdown ───────────────────────────────────────────────────────────
function ProfilDropdown({
  pathname,
  links,
}: {
  pathname: string;
  links: NavItem[];
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const profilIsActive = links.some((l) => isActive(l.href, pathname));

  // Close on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 outline-none",
          profilIsActive
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/8"
        )}
      >
        <User className={cn("h-3.5 w-3.5", profilIsActive ? "text-primary" : "text-muted-foreground/70")} />
        Profil
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")} />
        {profilIsActive && (
          <motion.span
            layoutId="nav-active-pill"
            className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-1/2 top-full mt-2 w-60 -translate-x-1/2 overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-2 shadow-xl shadow-black/10 backdrop-blur-xl z-50"
          >
            {/* Arrow */}
            <div className="absolute left-1/2 top-[-6px] -translate-x-1/2 h-3 w-3 rotate-45 border-l border-t border-border/60 bg-card/95" />

            <div className="relative">
              {links.map((link) => {
                const active = isActive(link.href, pathname);
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <span className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                      active ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"
                    )}>
                      <DynamicIcon name={link.icon} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">{link.label}</div>
                      <div className="text-[10px] text-muted-foreground/70 truncate">{link.description}</div>
                    </div>
                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export function Navbar({ navItems = [] }: { navItems?: NavItem[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // Split nav items by location. "navbar" holds the primary links plus a
  // trailing "Kontak" entry; "navbar-dropdown" holds Profil dropdown items.
  const primaryNav = navItems.filter((n) => n.location === "navbar");
  const profilLinks = navItems.filter((n) => n.location === "navbar-dropdown");

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="container flex h-16 items-center justify-between gap-2">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2 flex-shrink-0">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg group-hover:shadow-primary/40 transition-shadow duration-300">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-base font-bold tracking-tight">
            Hifzul<span className="text-primary">.dev</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-0.5 md:flex">
          {primaryNav.map((link) => {
            const active = isActive(link.href, pathname);
            return (
              <Link
                key={link.id}
                href={link.href}
                target={link.open_in_new_tab ? "_blank" : undefined}
                rel={link.open_in_new_tab ? "noopener noreferrer" : undefined}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/8"
                )}
              >
                <DynamicIcon name={link.icon} className={cn("h-3.5 w-3.5", active ? "text-primary" : "text-muted-foreground/70")} />
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* Profil dropdown */}
          {profilLinks.length > 0 && (
            <ProfilDropdown pathname={pathname} links={profilLinks} />
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            asChild
            variant="gradient"
            size="sm"
            className="hidden md:inline-flex rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
          >
            <Link href="/contact">Hubungi Saya</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl"
            aria-label="Buka menu"
            onClick={() => setOpen((o) => !o)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <div className="container border-b border-border bg-background/95 pb-4 pt-2 backdrop-blur-xl">
              {/* Primary */}
              <div className="mb-2 flex flex-col gap-0.5">
                {primaryNav.map((link, i) => {
                  const active = isActive(link.href, pathname);
                  return (
                    <motion.div key={link.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                      <Link
                        href={link.href}
                        target={link.open_in_new_tab ? "_blank" : undefined}
                        rel={link.open_in_new_tab ? "noopener noreferrer" : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          active ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-accent/8 hover:text-foreground"
                        )}
                      >
                        <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", active ? "bg-primary/20" : "bg-muted/50")}>
                          <DynamicIcon name={link.icon} className={cn("h-3.5 w-3.5", active ? "text-primary" : "text-muted-foreground")} />
                        </span>
                        {link.label}
                        {active && <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-primary/70">Aktif</span>}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Profil section */}
              {profilLinks.length > 0 && (
                <div className="mb-2 border-t border-border/50 pt-2">
                  <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Profil</p>
                  <div className="flex flex-col gap-0.5">
                    {profilLinks.map((link, i) => {
                      const active = isActive(link.href, pathname);
                      return (
                        <motion.div key={link.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (primaryNav.length + i) * 0.04 }}>
                          <Link
                            href={link.href}
                            target={link.open_in_new_tab ? "_blank" : undefined}
                            rel={link.open_in_new_tab ? "noopener noreferrer" : undefined}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                              active ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-accent/8 hover:text-foreground"
                            )}
                          >
                            <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", active ? "bg-primary/20" : "bg-muted/50")}>
                              <DynamicIcon name={link.icon} className={cn("h-3.5 w-3.5", active ? "text-primary" : "text-muted-foreground")} />
                            </span>
                            {link.label}
                            {active && <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-primary/70">Aktif</span>}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="border-t border-border/50 pt-3 flex flex-col gap-2">
                <Button asChild variant="gradient" size="sm" className="rounded-xl">
                  <Link href="/contact" onClick={() => setOpen(false)}>Hubungi Saya</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
