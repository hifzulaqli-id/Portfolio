"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Instagram,
  MessageCircle,
  Linkedin,
  Github,
  Mail,
  Clock,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Profile, ContentBlock } from "@/types";

interface ContactCTAProps {
  profile: Profile;
  blocks?: ContentBlock[];
}

const DEFAULT_TRUST = ["Respons < 24 jam", "Garansi Revisi", "Kerja Transparan"];
const TRUST_ICONS = [Clock, Shield, Zap];

export function ContactCTA({ profile, blocks }: ContactCTAProps) {
  const trustBlock = blocks?.find((b) => b.key === "contact_cta.trust_items");
  const trustLabels =
    trustBlock && Array.isArray(trustBlock.value)
      ? (trustBlock.value as string[])
      : DEFAULT_TRUST;
  const TRUST_ITEMS = trustLabels.map((label, i) => ({
    label,
    icon: TRUST_ICONS[i % TRUST_ICONS.length],
  }));

  const wa = profile.whatsapp_number
    ? `https://wa.me/${profile.whatsapp_number}`
    : "/contact";

  return (
    <section id="kontak-cta" className="section-pad">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary/95 to-indigo-600 p-1 shadow-2xl shadow-primary/30"
        >
          {/* Inner card */}
          <div className="relative overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-primary/90 via-primary to-indigo-600 p-8 md:p-16">
            {/* BG patterns */}
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.07]" />
            {/* Glow blobs */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex flex-col items-center gap-8 text-center">
              {/* Badge */}
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                </span>
                Tersedia — Slot terbuka untuk proyek baru
              </motion.span>

              {/* Heading */}
              <div className="space-y-4">
                <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-white text-balance md:text-5xl">
                  Ada Proyek?{" "}
                  <span className="text-white/70">Mari Diskusi!</span>
                </h2>
                <p className="mx-auto max-w-xl text-base leading-relaxed text-white/70 md:text-lg text-balance">
                  Ceritakan ide Anda, sekecil apapun. Saya bantu wujudkan
                  dengan pendekatan yang pas dan transparan.
                </p>
              </div>

              {/* Trust items */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {TRUST_ITEMS.map((item) => (
                  <span
                    key={item.label}
                    className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white/85 backdrop-blur-sm"
                  >
                    <item.icon className="h-3.5 w-3.5 text-emerald-300" />
                    {item.label}
                  </span>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl bg-white font-bold text-primary hover:bg-white/92 shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Link href="/contact">
                    Hubungi Sekarang
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl border-white/30 bg-white/10 font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all hover:-translate-y-0.5"
                  variant="outline"
                >
                  <a href={wa} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-3">
                {[
                  { href: profile.instagram_url, icon: Instagram, label: "Instagram" },
                  { href: profile.linkedin_url, icon: Linkedin, label: "LinkedIn" },
                  { href: profile.github_url, icon: Github, label: "GitHub" },
                  { href: profile.email ? `mailto:${profile.email}` : null, icon: Mail, label: "Email" },
                ].map(({ href, icon: Icon, label }) =>
                  href ? (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("mailto") ? "_self" : "_blank"}
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/20 hover:text-white hover:-translate-y-0.5"
                    >
                      <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                    </a>
                  ) : null
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
