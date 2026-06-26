import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Wrench } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SkillsPageClient } from "@/components/sections/skills/skills-page-client";
import { getSkills } from "@/lib/data/skills";

export const metadata: Metadata = {
  title: "Skills | Hifzul Aqli",
  description: "Kumpulan keahlian saya lintas bidang — dari pengembangan web hingga kreatif, beserta tingkat penguasaannya.",
};

export const revalidate = 60;

export default async function SkillsPage() {
  const skills = await getSkills({ activeOnly: true });

  return (
    <PublicShell>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-dots opacity-20 mask-fade-b" />
          <div className="absolute left-1/2 top-0 h-96 w-[700px] -translate-x-1/2 rounded-full bg-primary/8 blur-[100px]" />
        </div>
        <div className="container text-center">
          <ScrollReveal>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <Wrench className="h-3.5 w-3.5" /> Skills
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Skill &{" "}
              <span className="text-primary-strong">Kompetensi</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Kumpulan keahlian lintas bidang — web, design, video, audio. Hover ikon untuk melihat level penguasaan.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="pb-20">
        <div className="container">
          {skills.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">Belum ada skill yang ditampilkan.</p>
          ) : (
            <SkillsPageClient skills={skills} />
          )}
        </div>
      </section>
    </PublicShell>
  );
}
