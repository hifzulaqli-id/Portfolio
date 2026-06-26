import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, History, Briefcase, Users, CalendarRange, Heart } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { ExperienceTimeline } from "@/components/sections/experience/experience-timeline";
import { getExperiences } from "@/lib/data/experiences";
import { EXPERIENCE_TYPE_META, type ExperienceType } from "@/types";

export const metadata: Metadata = {
  title: "Pengalaman | Hifzul Aqli",
  description: "Riwayat pengalaman kerja, magang, freelance, organisasi, kepanitiaan, dan kegiatan volunteer.",
};

export const revalidate = 60;

const ORDER: ExperienceType[] = ["job", "freelance", "organization", "committee", "volunteer"];

const TYPE_COLOR: Record<ExperienceType, { bg: string; text: string; border: string; icon: React.ElementType }> = {
  job:          { bg: "bg-blue-500/15",    text: "text-blue-500",    border: "border-blue-500/30",    icon: Briefcase },
  freelance:    { bg: "bg-violet-500/15",  text: "text-violet-500",  border: "border-violet-500/30",  icon: History },
  organization: { bg: "bg-emerald-500/15", text: "text-emerald-500", border: "border-emerald-500/30", icon: Users },
  committee:    { bg: "bg-amber-500/15",   text: "text-amber-500",   border: "border-amber-500/30",   icon: CalendarRange },
  volunteer:    { bg: "bg-pink-500/15",    text: "text-pink-500",    border: "border-pink-500/30",    icon: Heart },
};

export default async function ExperiencePage() {
  const experiences = await getExperiences({ activeOnly: true });

  const groups = ORDER
    .map((type) => ({
      type,
      meta: EXPERIENCE_TYPE_META[type],
      items: experiences.filter((e) => e.type === type),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <PublicShell>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-dots opacity-20 mask-fade-b" />
          <div className="absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 rounded-full bg-primary/8 blur-[90px]" />
        </div>
        <div className="container text-center">
          <div className="mx-auto max-w-2xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              — Pengalaman
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Perjalanan{" "}
              <span className="text-primary-strong">Profesional</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Pengalaman kerja, freelance, organisasi, kepanitiaan, dan kegiatan volunteer yang saya jalani.
            </p>
          </div>
        </div>
      </section>

      {/* Content — all groups flat (no tab) */}
      <section className="pb-20">
        <div className="container max-w-3xl">
          {groups.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">Belum ada pengalaman yang ditampilkan.</p>
          ) : (
            <div className="space-y-16">
              {groups.map(({ type, meta, items }) => {
                const color = TYPE_COLOR[type];
                const Icon = color.icon;
                return (
                  <div key={type}>
                    {/* Section label */}
                    <div className="mb-8 flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${color.bg} ${color.text}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-bold text-foreground">
                          {meta.emoji} {meta.label}
                        </h2>
                        <p className="text-xs text-muted-foreground">{items.length} pengalaman</p>
                      </div>
                      <div className="ml-auto h-px flex-1 bg-border/60" />
                    </div>

                    <ExperienceTimeline items={items} type={type} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
