"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Palette,
  Clapperboard,
  Mic,
  Check,
  ArrowRight,
  MessageCircle,
  Wrench,
  Star,
  Zap,
  Shield,
  ChevronDown,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Button } from "@/components/ui/button";
import { type ProjectCategory, type Service } from "@/types";
import { cn } from "@/lib/utils";

// ── Icon map ──────────────────────────────────────────────────────────────────
const ICONS: Record<string, LucideIcon> = { Code2, Palette, Clapperboard, Mic };

// ── Per-service visual theme ─────────────────────────────────────────────────
const THEME: Record<
  ProjectCategory,
  {
    gradient: string;
    iconBg: string;
    iconColor: string;
    border: string;
    badgeBg: string;
    accent: string;
    pkgHighlight: string;
    navActive: string;
  }
> = {
  web: {
    gradient: "from-blue-500/15 via-indigo-500/5 to-transparent",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-500",
    border: "border-blue-500/30",
    badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25",
    accent: "bg-blue-500",
    pkgHighlight: "border-blue-500/60 bg-gradient-to-b from-blue-500/10 to-transparent shadow-lg shadow-blue-500/15",
    navActive: "bg-blue-500 text-white shadow-lg shadow-blue-500/30",
  },
  design: {
    gradient: "from-purple-500/15 via-violet-500/5 to-transparent",
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-500",
    border: "border-purple-500/30",
    badgeBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25",
    accent: "bg-purple-500",
    pkgHighlight: "border-purple-500/60 bg-gradient-to-b from-purple-500/10 to-transparent shadow-lg shadow-purple-500/15",
    navActive: "bg-purple-500 text-white shadow-lg shadow-purple-500/30",
  },
  video: {
    gradient: "from-pink-500/15 via-rose-500/5 to-transparent",
    iconBg: "bg-pink-500/15",
    iconColor: "text-pink-500",
    border: "border-pink-500/30",
    badgeBg: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/25",
    accent: "bg-pink-500",
    pkgHighlight: "border-pink-500/60 bg-gradient-to-b from-pink-500/10 to-transparent shadow-lg shadow-pink-500/15",
    navActive: "bg-pink-500 text-white shadow-lg shadow-pink-500/30",
  },
  voice: {
    gradient: "from-emerald-500/15 via-teal-500/5 to-transparent",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-500",
    border: "border-emerald-500/30",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    accent: "bg-emerald-500",
    pkgHighlight: "border-emerald-500/60 bg-gradient-to-b from-emerald-500/10 to-transparent shadow-lg shadow-emerald-500/15",
    navActive: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30",
  },
};

const NAV_ICONS: Record<string, LucideIcon> = {
  web: Globe,
  design: Palette,
  video: Clapperboard,
  voice: Mic,
};

// ── Accordion FAQ ─────────────────────────────────────────────────────────────
function FaqItem({ q, a, accent }: { q: string; a: string; accent: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border transition-all duration-300",
        open ? `border-current/30 bg-card/80` : "border-border/60 bg-card/40"
      )}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <span className="font-semibold text-sm text-foreground leading-snug">{q}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <p className="border-t border-border/50 px-5 pb-5 pt-4 text-sm leading-relaxed text-muted-foreground">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export function ServicesPageClient({ services = [] }: { services?: Service[] }) {
  const [activeNav, setActiveNav] = React.useState<ProjectCategory>("web");

  // Track scroll to update active nav
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id as ProjectCategory);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    services.forEach((s) => {
      const el = document.getElementById(s.category);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [services]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 128;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-dots opacity-20 mask-fade-b" />
          <div className="absolute left-1/2 top-0 h-96 w-[700px] -translate-x-1/2 rounded-full bg-primary/8 blur-[100px]" />
        </div>

        <div className="container text-center">
          <ScrollReveal>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              — Layanan
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Apa yang Bisa Saya{" "}
              <span className="text-primary-strong">Lakukan?</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Empat layanan utama dengan paket fleksibel — semua bisa disesuaikan dengan kebutuhan dan budget Anda.
            </p>
          </ScrollReveal>

        </div>
      </section>

      {/* ── STICKY NAV ──────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="container">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
            {services.map((s) => {
              const Icon = NAV_ICONS[s.category] ?? Code2;
              const theme = THEME[s.category];
              const active = activeNav === s.category;
              return (
                <button
                  key={s.category}
                  onClick={() => scrollTo(s.category)}
                  className={cn(
                    "flex flex-shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200",
                    active
                      ? theme.navActive
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{s.title}</span>
                  <span className="sm:hidden">{s.title.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SERVICE SECTIONS ─────────────────────────────────────── */}
      {services.map((service, idx) => {
        const Icon = ICONS[service.icon] ?? Code2;
        const theme = THEME[service.category];

        return (
          <section
            key={service.category}
            id={service.category}
            className="relative overflow-hidden py-20"
          >
            {/* Section background wash */}
            <div
              className={cn(
                "pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b",
                theme.gradient
              )}
            />
            {idx % 2 !== 0 && (
              <div className="pointer-events-none absolute inset-0 -z-10 bg-card/30" />
            )}

            <div className="container">
              {/* ── Section header ── */}
              <ScrollReveal>
                <div className="mb-14 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                  <div
                    className={cn(
                      "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset ring-white/10 shadow-lg transition-transform hover:scale-105",
                      theme.iconBg,
                      theme.iconColor
                    )}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-3xl font-bold sm:text-4xl">
                        {service.title}
                      </h2>
                      <span
                        className={cn(
                          "rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-widest",
                          theme.badgeBg,
                          theme.border
                        )}
                      >
                        Tersedia
                      </span>
                    </div>
                    <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                      {service.longDescription}
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* ── Includes + Tools + Packages grid ── */}
              <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
                {/* Left: Includes + Tools */}
                <div className="flex flex-col gap-5">
                  {/* Apa yang Termasuk */}
                  <ScrollReveal delay={0.05}>
                    <div className={cn("rounded-3xl border p-6 bg-card/60 backdrop-blur-sm", theme.border)}>
                      <div className="mb-4 flex items-center gap-2">
                        <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", theme.iconBg, theme.iconColor)}>
                          <Check className="h-4 w-4" />
                        </div>
                        <h3 className="font-display font-bold text-foreground">
                          Yang Sudah Termasuk
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {service.includes.map((item, i) => (
                          <motion.li
                            key={item}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: i * 0.05 }}
                            className="flex items-start gap-3 text-sm text-muted-foreground"
                          >
                            <span
                              className={cn(
                                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                                theme.iconBg,
                                theme.iconColor
                              )}
                            >
                              <Check className="h-3 w-3" />
                            </span>
                            <span className="leading-relaxed">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </ScrollReveal>

                  {/* Tools */}
                  <ScrollReveal delay={0.1}>
                    <div className="rounded-3xl border border-border/60 bg-card/50 p-6 backdrop-blur-sm">
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/60">
                          <Wrench className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Tools & Software
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {service.tools.map((t) => (
                          <span
                            key={t}
                            className="rounded-xl border border-border bg-background/60 px-3 py-1.5 font-mono text-[11px] font-semibold text-foreground hover:border-primary/40 transition-colors"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                </div>

                {/* Right: Packages */}
                <ScrollReveal delay={0.1}>
                  <div className="grid gap-4 sm:grid-cols-3 h-fit">
                    {service.packages.map((pkg, pkgIdx) => (
                      <motion.div
                        key={pkg.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: pkgIdx * 0.1 }}
                        className={cn(
                          "relative flex flex-col rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1",
                          pkg.featured
                            ? theme.pkgHighlight
                            : "border-border/60 bg-card/50 hover:shadow-md"
                        )}
                      >
                        {/* Popular badge */}
                        {pkg.featured && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span
                              className={cn(
                                "flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md",
                                theme.accent
                              )}
                            >
                              <Star className="h-2.5 w-2.5 fill-white" />
                              Populer
                            </span>
                          </div>
                        )}

                        {/* Package name */}
                        <div className="mb-1">
                          <span
                            className={cn(
                              "rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
                              pkg.featured
                                ? cn(theme.iconBg, theme.iconColor)
                                : "bg-muted/60 text-muted-foreground"
                            )}
                          >
                            {pkg.name}
                          </span>
                        </div>

                        <h4 className="mt-3 font-display text-base font-bold text-foreground leading-snug">
                          {pkg.tagline}
                        </h4>

                        {/* Price placeholder */}
                        <div className="my-4 flex items-baseline gap-1">
                          <span
                            className={cn(
                              "font-display text-sm font-bold",
                              pkg.featured ? theme.iconColor : "text-primary"
                            )}
                          >
                            Hubungi untuk harga
                          </span>
                        </div>

                        {/* Perks */}
                        <ul className="flex flex-col gap-2">
                          {pkg.perks.map((p) => (
                            <li key={p} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <Check
                                className={cn(
                                  "mt-0.5 h-3.5 w-3.5 shrink-0",
                                  pkg.featured ? theme.iconColor : "text-primary"
                                )}
                              />
                              <span className="leading-relaxed">{p}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Info only - no CTA button */}
                      </motion.div>
                    ))}
                  </div>
                </ScrollReveal>
              </div>

              {/* ── FAQ ── */}
              <ScrollReveal className="mt-14">
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border/60" />
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    FAQ — {service.title}
                  </span>
                  <div className="h-px flex-1 bg-border/60" />
                </div>
                <div className="grid gap-3 md:grid-cols-1 max-w-3xl mx-auto">
                  {service.faq.map((item) => (
                    <FaqItem
                      key={item.q}
                      q={item.q}
                      a={item.a}
                      accent={theme.iconColor}
                    />
                  ))}
                </div>
              </ScrollReveal>

              {/* ── Section CTA ── */}
              <ScrollReveal className="mt-10">
                <div
                  className={cn(
                    "relative overflow-hidden rounded-3xl border p-8 text-center",
                    theme.border,
                    `bg-gradient-to-br ${theme.gradient} bg-card/60`
                  )}
                >
                  <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.04]" />
                  <div className="relative">
                    <p className="mb-4 text-sm font-medium text-muted-foreground">
                      Tertarik dengan layanan <strong className="text-foreground">{service.title}</strong>?
                    </p>
                    <Button
                      asChild
                      size="lg"
                      className={cn(
                        "rounded-xl font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl",
                        theme.accent
                      )}
                    >
                      <Link href={`/contact?service=${service.category}`}>
                        <MessageCircle className="h-4 w-4" />
                        Konsultasi Gratis
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Section divider */}
            {idx < services.length - 1 && (
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            )}
          </section>
        );
      })}

      {/* ── BOTTOM CTA ──────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary/95 to-indigo-600 p-px shadow-2xl shadow-primary/30">
              <div className="relative overflow-hidden rounded-[1.9rem] bg-gradient-to-br from-primary/90 to-indigo-600 px-8 py-16 text-center md:px-16">
                <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.07]" />
                <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />
                <div className="relative">
                  <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                      <span className="relative h-2 w-2 rounded-full bg-emerald-300" />
                    </span>
                    Slot terbuka untuk proyek baru
                  </span>
                  <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
                    Tidak Yakin Butuh Layanan Apa?
                  </h2>
                  <p className="mx-auto mt-4 max-w-md text-white/70">
                    Ceritakan kebutuhan Anda, saya bantu tentukan solusi terbaik — gratis dan tanpa komitmen.
                  </p>
                  <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl bg-white font-bold text-primary hover:bg-white/92 shadow-lg"
                    >
                      <Link href="/contact">
                        Hubungi Saya
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl border-white/30 bg-white/10 font-semibold text-white hover:bg-white/20"
                      variant="outline"
                    >
                      <Link href="/projects">Lihat Portofolio</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
