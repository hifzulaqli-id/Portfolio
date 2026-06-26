"use client";

import { motion } from "framer-motion";
import { Star, Quote, ThumbsUp } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";
import type { Testimonial } from "@/types";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const CARD_ACCENTS = [
  "from-blue-500/10 border-blue-500/20",
  "from-purple-500/10 border-purple-500/20",
  "from-emerald-500/10 border-emerald-500/20",
  "from-pink-500/10 border-pink-500/20",
  "from-amber-500/10 border-amber-500/20",
  "from-indigo-500/10 border-indigo-500/20",
];

export function Testimonials({ testimonials }: TestimonialsProps) {
  if (testimonials.length === 0) return null;

  const avgRating =
    testimonials.reduce((a, t) => a + t.rating, 0) / testimonials.length;

  return (
    <section id="testimoni" className="section-pad relative overflow-hidden">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-card/30 border-y border-border/40" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-primary/5 blur-[80px]" />
        <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-secondary/5 blur-[80px]" />
      </div>

      <div className="container">
        <SectionHeading
          eyebrow="Testimoni"
          title={
            <>
              Kata Mereka Tentang{" "}
              <span className="text-primary-strong">Kerja Sama</span>
            </>
          }
          description="Kepercayaan klien adalah prioritas utama saya."
        />

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-12 flex flex-wrap items-center justify-center gap-6"
        >
          {/* Average rating */}
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/80 px-5 py-3 backdrop-blur-sm shadow-sm">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-muted"}`}
                />
              ))}
            </div>
            <div className="border-l border-border pl-3">
              <span className="font-display text-lg font-bold text-foreground">
                {avgRating.toFixed(1)}
              </span>
              <span className="ml-1 text-xs text-muted-foreground">/ 5.0</span>
            </div>
          </div>

          {/* Client count */}
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/80 px-5 py-3 backdrop-blur-sm shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15">
              <ThumbsUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="font-display text-lg font-bold text-foreground">
                {testimonials.length}+
              </span>
              <span className="ml-1.5 text-xs text-muted-foreground">Ulasan Positif</span>
            </div>
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => {
            const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
            return (
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-gradient-to-br ${accent} bg-card/70 p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-xl`}
              >
                {/* Decorative quote mark */}
                <div className="pointer-events-none absolute right-5 top-4">
                  <Quote className="h-12 w-12 text-foreground/5 rotate-180" />
                </div>

                {/* Stars */}
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={
                        idx < t.rating
                          ? "h-4 w-4 fill-amber-400 text-amber-400"
                          : "h-4 w-4 text-muted"
                      }
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="relative flex-1 text-sm leading-relaxed text-foreground/85">
                  <span className="font-serif text-xl text-primary/40 leading-none">&ldquo;</span>
                  {t.content}
                  <span className="font-serif text-xl text-primary/40 leading-none">&rdquo;</span>
                </blockquote>

                {/* Divider */}
                <div className="my-5 border-t border-border/50" />

                {/* Author */}
                <figcaption className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-11 w-11 border-2 border-background shadow-md">
                      {t.avatar_url && (
                        <AvatarImage src={t.avatar_url} alt={t.client_name} />
                      )}
                      <AvatarFallback className="bg-primary/20 text-sm font-bold text-foreground">
                        {initials(t.client_name)}
                      </AvatarFallback>
                    </Avatar>
                    {/* Verified dot */}
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background">
                      <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 fill-white">
                        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm font-bold text-foreground">
                      {t.client_name}
                    </div>
                    {t.client_role && (
                      <div className="truncate text-[11px] text-muted-foreground">
                        {t.client_role}
                      </div>
                    )}
                  </div>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
