"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Building2, MapPin, Trophy, ExternalLink, Briefcase, Calendar } from "lucide-react";
import { EMPLOYMENT_TYPE_META, EXPERIENCE_TYPE_META, type Experience, type ExperienceType } from "@/types";
import { formatDate, initials } from "@/lib/utils";

const TYPE_COLOR: Record<ExperienceType, { bg: string; text: string; border: string; dot: string; nodeBg: string }> = {
  job:          { bg: "bg-blue-500/15",    text: "text-blue-500",    border: "border-blue-500/30",    dot: "bg-blue-500",    nodeBg: "bg-blue-500/15" },
  freelance:    { bg: "bg-violet-500/15",  text: "text-violet-500",  border: "border-violet-500/30",  dot: "bg-violet-500",  nodeBg: "bg-violet-500/15" },
  organization: { bg: "bg-emerald-500/15", text: "text-emerald-500", border: "border-emerald-500/30", dot: "bg-emerald-500", nodeBg: "bg-emerald-500/15" },
  committee:    { bg: "bg-amber-500/15",   text: "text-amber-500",   border: "border-amber-500/30",   dot: "bg-amber-500",   nodeBg: "bg-amber-500/15" },
  volunteer:    { bg: "bg-pink-500/15",    text: "text-pink-500",    border: "border-pink-500/30",    dot: "bg-pink-500",    nodeBg: "bg-pink-500/15" },
};

export function ExperienceTimeline({ items, type }: { items: Experience[]; type?: ExperienceType }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted/60">
          <Briefcase className="h-8 w-8 text-muted-foreground/40" />
        </div>
        <p className="text-sm text-muted-foreground">Belum ada pengalaman di kategori ini.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-primary/40 via-border to-transparent md:left-8" />

      <div className="space-y-6">
        {items.map((exp, i) => {
          const emp = exp.employment_type ? EMPLOYMENT_TYPE_META[exp.employment_type] : null;
          const expType = (type ?? exp.type) as ExperienceType;
          const color = TYPE_COLOR[expType] ?? TYPE_COLOR.job;
          const period = `${formatDate(exp.start_date, { month: "short", year: "numeric" })} — ${
            exp.is_current ? "Sekarang"
            : exp.end_date ? formatDate(exp.end_date, { month: "short", year: "numeric" })
            : "—"
          }`;

          return (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="relative pl-16 md:pl-20"
            >
              {/* Node — logo or initials */}
              <div className={`absolute left-0 top-0 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 shadow-md md:h-16 md:w-16 ${color.border} ${color.nodeBg}`}>
                {exp.logo_url ? (
                  <Image src={exp.logo_url} alt={exp.company} fill sizes="64px" className="object-cover" />
                ) : (
                  <span className={`font-display text-base font-black ${color.text}`}>
                    {initials(exp.company)}
                  </span>
                )}
              </div>

              {/* Dot on timeline */}
              <div className={`absolute left-[1.45rem] top-4 h-2.5 w-2.5 rounded-full ring-2 ring-background md:left-[1.85rem] ${color.dot}`} />

              {/* Card */}
              <div className={`group rounded-2xl border bg-card/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${color.border} hover:bg-card/80`}>
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground leading-snug">
                      {exp.position}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <Building2 className="h-3.5 w-3.5" />
                        {exp.company_url ? (
                          <a href={exp.company_url} target="_blank" rel="noopener noreferrer"
                            className="hover:text-primary transition-colors inline-flex items-center gap-1">
                            {exp.company}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : exp.company}
                      </span>
                      {exp.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {exp.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-col items-end gap-1.5">
                    {exp.is_current && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-500 border border-emerald-500/30">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                        Aktif
                      </span>
                    )}
                    {emp && (
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${color.bg} ${color.text} ${color.border} border`}>
                        {emp.label}
                      </span>
                    )}
                  </div>
                </div>

                {/* Period */}
                <div className="mt-2 flex items-center gap-1.5 font-mono text-xs text-muted-foreground/70">
                  <Calendar className="h-3 w-3" />
                  {period}
                </div>

                {/* Description */}
                {exp.description && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground border-t border-border/50 pt-3">
                    {exp.description}
                  </p>
                )}

                {/* Tech stack */}
                {exp.tech_stack.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {exp.tech_stack.map((t) => (
                      <span key={t} className="rounded-lg bg-muted/60 px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Achievement */}
                {exp.achievements && (
                  <div className={`mt-3 flex items-start gap-2 rounded-xl p-3 ${color.bg}`}>
                    <Trophy className={`mt-0.5 h-4 w-4 shrink-0 ${color.text}`} />
                    <span className="text-xs leading-relaxed text-muted-foreground">{exp.achievements}</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
