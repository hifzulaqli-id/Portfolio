"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code2,
  Palette,
  Clapperboard,
  Mic,
  ArrowRight,
  CheckCircle2,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Service } from "@/types";

const ICONS: Record<string, LucideIcon> = {
  Code2,
  Palette,
  Clapperboard,
  Mic,
};

// Per-service visual theming
const SERVICE_THEME: Record<
  string,
  {
    gradient: string;
    iconBg: string;
    iconColor: string;
    border: string;
    glow: string;
    badge: string;
    accent: string;
    number: string;
  }
> = {
  web: {
    gradient: "from-blue-500/12 via-indigo-500/6 to-transparent",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-500",
    border: "border-blue-500/25 hover:border-blue-500/50",
    glow: "shadow-blue-500/15",
    badge: "bg-blue-500/12 text-blue-600 dark:text-blue-400 border-blue-500/25",
    accent: "bg-blue-500",
    number: "text-blue-500/20",
  },
  design: {
    gradient: "from-purple-500/12 via-violet-500/6 to-transparent",
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-500",
    border: "border-purple-500/25 hover:border-purple-500/50",
    glow: "shadow-purple-500/15",
    badge: "bg-purple-500/12 text-purple-600 dark:text-purple-400 border-purple-500/25",
    accent: "bg-purple-500",
    number: "text-purple-500/20",
  },
  video: {
    gradient: "from-pink-500/12 via-rose-500/6 to-transparent",
    iconBg: "bg-pink-500/15",
    iconColor: "text-pink-500",
    border: "border-pink-500/25 hover:border-pink-500/50",
    glow: "shadow-pink-500/15",
    badge: "bg-pink-500/12 text-pink-600 dark:text-pink-400 border-pink-500/25",
    accent: "bg-pink-500",
    number: "text-pink-500/20",
  },
  voice: {
    gradient: "from-emerald-500/12 via-teal-500/6 to-transparent",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-500",
    border: "border-emerald-500/25 hover:border-emerald-500/50",
    glow: "shadow-emerald-500/15",
    badge: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    accent: "bg-emerald-500",
    number: "text-emerald-500/20",
  },
};

export function Services({ services }: { services: Service[] }) {
  return (
    <section id="layanan" className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-20 mask-fade-b" />

      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/4 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px]" />
        <div className="absolute right-0 bottom-1/4 h-64 w-64 rounded-full bg-purple-500/5 blur-[80px]" />
      </div>

      <div className="container">
        <SectionHeading
          eyebrow="Layanan"
          title={
            <>
              Apa yang Bisa Saya{" "}
              <span className="text-primary-strong">Bantu?</span>
            </>
          }
          description="Empat layanan utama untuk mengembangkan kehadiran digital dan kreatif brand Anda — dari ide sampai eksekusi."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const Icon = ICONS[service.icon] ?? Code2;
            const theme = SERVICE_THEME[service.category] ?? SERVICE_THEME.web;

            return (
              <motion.article
                key={service.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                whileHover={{ y: -6 }}
                className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl ${theme.border} hover:${theme.glow}`}
              >
                {/* Top gradient wash */}
                <div
                  className={`absolute inset-x-0 top-0 h-48 bg-gradient-to-b ${theme.gradient} pointer-events-none`}
                />

                {/* Accent line top */}
                <div className={`absolute inset-x-0 top-0 h-[2px] rounded-t-3xl ${theme.accent} opacity-60 group-hover:opacity-100 transition-opacity`} />

                {/* Card number — decorative */}
                <div
                  className={`pointer-events-none absolute right-5 top-4 font-display text-6xl font-black ${theme.number} select-none leading-none transition-all duration-300 group-hover:scale-110`}
                >
                  0{i + 1}
                </div>

                <div className="relative flex flex-col gap-5 p-6">
                  {/* Icon */}
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${theme.iconBg} ${theme.iconColor} shadow-sm ring-1 ring-inset ring-white/10 transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  {/* Title + desc */}
                  <div className="space-y-2">
                    <h3 className="font-display text-lg font-bold leading-tight text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  </div>

                  {/* Features chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {service.features.map((f) => (
                      <span
                        key={f}
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${theme.badge}`}
                      >
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Tools used */}
                  <div className="flex items-start gap-2">
                    <Wrench className={`mt-0.5 h-3 w-3 flex-shrink-0 ${theme.iconColor} opacity-70`} />
                    <p className="text-[11px] leading-relaxed text-muted-foreground/80">
                      {service.tools.slice(0, 3).join(" · ")}
                      {service.tools.length > 3 && ` +${service.tools.length - 3}`}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-6 border-t border-border/50" />

                {/* CTA row */}
                <div className="relative flex items-center justify-between px-6 py-4">
                  <Link
                    href={`/services#${service.category}`}
                    className={`group/cta flex items-center gap-1.5 text-xs font-semibold ${theme.iconColor} transition-all duration-200`}
                  >
                    <span className="relative">
                      FREE Konsultasi
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-all duration-300 group-hover/cta:w-full" />
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/cta:translate-x-1" />
                  </Link>

                  {/* Dot indicator */}
                  <div className="flex items-center gap-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${theme.accent} animate-pulse`} />
                    <span className="text-[10px] font-medium text-muted-foreground/60">Tersedia</span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex flex-col items-center gap-3 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Butuh layanan custom atau paket gabungan?
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/8 px-6 py-2.5 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary/15 hover:border-primary/60"
          >
            Diskusikan Proyekmu
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
