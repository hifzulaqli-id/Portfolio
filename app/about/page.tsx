import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Download, Heart, Lightbulb, Target, Users, Sparkles, ShieldCheck,
  Code2, Camera, Music, BookOpen, Dumbbell, Coffee, Plane,
  ArrowRight, Globe, Video, Mic, Palette, MapPin, GraduationCap,
  Briefcase, Star, Laptop, Zap, Trophy, CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/lib/data/profile";
import { getCertifications } from "@/lib/data/certifications";
import { getServices } from "@/lib/data/services";
import { getEducation } from "@/lib/data/education";
import { getContentBlock } from "@/lib/data/content-blocks";
import { getIcon } from "@/lib/icons";
import type { EducationType } from "@/types";
import { initials } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tentang Saya | Hifzul Aqli",
  description: "Lebih dekat dengan saya — nilai, kepribadian, minat, dan fakta seru.",
};

export const revalidate = 60;

// Types for values & hobbies (stored as JSON content blocks)
interface ValueItem {
  title: string;
  desc: string;
  icon: string;
  color: string;
  border: string;
  glow: string;
}

interface HobbyItem {
  label: string;
  icon: string;
  color: string;
  border: string;
}

// Fallback defaults (used when content blocks are empty or missing)
const DEFAULT_VALUES: ValueItem[] = [
  { title: "Integritas",      desc: "Jujur dalam setiap proses dan deliverable. Tidak ada janji kosong.",       icon: "ShieldCheck", color: "bg-blue-500/15 text-blue-500",    border: "border-blue-500/20",    glow: "hover:shadow-blue-500/10" },
  { title: "Detail-Oriented", desc: "Memperhatikan hal kecil yang membuat hasil terasa premium.",               icon: "Target",      color: "bg-purple-500/15 text-purple-500", border: "border-purple-500/20",  glow: "hover:shadow-purple-500/10" },
  { title: "Selalu Belajar",  desc: "Teknologi bergerak cepat — saya ikut bergerak dengannya.",                 icon: "Lightbulb",   color: "bg-amber-500/15 text-amber-500",  border: "border-amber-500/20",   glow: "hover:shadow-amber-500/10" },
  { title: "Kolaboratif",      desc: "Komunikasi terbuka dan transparan dengan klien serta tim.",                icon: "Users",       color: "bg-green-500/15 text-green-500",  border: "border-green-500/20",   glow: "hover:shadow-green-500/10" },
  { title: "Kreatif",          desc: "Mencari solusi out-of-the-box, bukan template generik.",                   icon: "Sparkles",    color: "bg-pink-500/15 text-pink-500",    border: "border-pink-500/20",    glow: "hover:shadow-pink-500/10" },
  { title: "Passionate",       desc: "Mengerjakan tiap proyek dengan antusiasme layaknya karya sendiri.",        icon: "Heart",       color: "bg-rose-500/15 text-rose-500",    border: "border-rose-500/20",    glow: "hover:shadow-rose-500/10" },
];

const DEFAULT_HOBBIES: HobbyItem[] = [
  { label: "Coding",     icon: "Code2",    color: "text-blue-500 bg-blue-500/10",    border: "border-blue-500/20" },
  { label: "Fotografi",  icon: "Camera",   color: "text-violet-500 bg-violet-500/10", border: "border-violet-500/20" },
  { label: "Musik",      icon: "Music",    color: "text-pink-500 bg-pink-500/10",    border: "border-pink-500/20" },
  { label: "Membaca",    icon: "BookOpen", color: "text-amber-500 bg-amber-500/10",  border: "border-amber-500/20" },
  { label: "Olahraga",   icon: "Dumbbell", color: "text-green-500 bg-green-500/10",  border: "border-green-500/20" },
  { label: "Ngopi",      icon: "Coffee",   color: "text-orange-500 bg-orange-500/10", border: "border-orange-500/20" },
  { label: "Traveling",  icon: "Plane",    color: "text-sky-500 bg-sky-500/10",      border: "border-sky-500/20" },
  { label: "Design",     icon: "Palette",  color: "text-rose-500 bg-rose-500/10",    border: "border-rose-500/20" },
];

const SERVICE_THEME: Record<string, { color: string; border: string; glow: string; iconBg: string }> = {
  web:    { color: "text-blue-400",    border: "border-blue-500/20",    glow: "hover:shadow-blue-500/10",    iconBg: "bg-blue-500/15" },
  design: { color: "text-orange-400",  border: "border-orange-500/20",  glow: "hover:shadow-orange-500/10",  iconBg: "bg-orange-500/15" },
  video:  { color: "text-pink-400",    border: "border-pink-500/20",    glow: "hover:shadow-pink-500/10",    iconBg: "bg-pink-500/15" },
  voice:  { color: "text-emerald-400", border: "border-emerald-500/20", glow: "hover:shadow-emerald-500/10", iconBg: "bg-emerald-500/15" },
};
const SERVICE_ICONS: Record<string, LucideIcon> = {
  web: Globe, design: Palette, video: Video, voice: Mic,
};
const FALLBACK_THEME = { color: "text-primary", border: "border-primary/20", glow: "hover:shadow-primary/10", iconBg: "bg-primary/15" };

const EDU_TYPE_ICON: Record<EducationType, React.ElementType> = {
  formal: GraduationCap, course: Laptop, bootcamp: Zap, workshop: Users,
};
const EDU_TYPE_LABEL: Record<EducationType, string> = {
  formal: "Pendidikan Formal", course: "Kursus Online", bootcamp: "Bootcamp", workshop: "Workshop & Seminar",
};
const EDU_TYPE_COLOR: Record<EducationType, { bg: string; text: string; border: string; dot: string; glow: string }> = {
  formal:   { bg: "bg-blue-500/12",    text: "text-blue-500",    border: "border-blue-500/25",    dot: "bg-blue-500",    glow: "hover:shadow-blue-500/10" },
  course:   { bg: "bg-purple-500/12",  text: "text-purple-500",  border: "border-purple-500/25",  dot: "bg-purple-500",  glow: "hover:shadow-purple-500/10" },
  bootcamp: { bg: "bg-orange-500/12",  text: "text-orange-500",  border: "border-orange-500/25",  dot: "bg-orange-500",  glow: "hover:shadow-orange-500/10" },
  workshop: { bg: "bg-emerald-500/12", text: "text-emerald-500", border: "border-emerald-500/25", dot: "bg-emerald-500", glow: "hover:shadow-emerald-500/10" },
};

const LONG_BIO = [
  "Halo! Saya Hifzul Aqli — seorang mahasiswa Informatika yang berdiri di persimpangan antara logika kode dan kreativitas. Sejak kecil saya tertarik pada dua hal yang tampak bertolak belakang: memecahkan masalah dengan sistematis, dan mengekspresikan diri lewat visual & suara.",
  "Perjalanan saya dimulai dari iseng memodifikasi template blog, lalu tumbuh menjadi kecintaan membangun produk digital yang bermakna. Selama 2+ tahun terakhir, saya membantu UMKM, content creator, dan startup kecil mewujudkan ide mereka — mulai dari website, desain iklan Instagram, editing video komersial, sampai voice over untuk kursus online.",
  "Saya percaya karya yang baik lahir dari komunikasi yang jelas, proses yang transparan, dan perhatian terhadap detail. Setiap proyek — sekecil apa pun — saya perlakukan seperti karya profesional.",
];

export default async function AboutPage() {
  const [profile, certifications, services, education, valuesBlock, hobbiesBlock] = await Promise.all([
    getProfile(),
    getCertifications({ publicOnly: true }),
    getServices({ activeOnly: true }),
    getEducation(),
    getContentBlock("about.values"),
    getContentBlock("about.hobbies"),
  ]);

  // Use content block data or fallback to defaults
  const VALUES = (valuesBlock?.value && Array.isArray(valuesBlock.value) && valuesBlock.value.length > 0
    ? valuesBlock.value as unknown as ValueItem[]
    : DEFAULT_VALUES);

  const HOBBIES = (hobbiesBlock?.value && Array.isArray(hobbiesBlock.value) && hobbiesBlock.value.length > 0
    ? hobbiesBlock.value as unknown as HobbyItem[]
    : DEFAULT_HOBBIES);

  const STATS = [
    { value: profile.projects_count,          suffix: "+", label: "Proyek Selesai",  icon: Briefcase,    color: "bg-violet-500/15 text-violet-500", border: "border-violet-500/20" },
    { value: profile.clients_count,           suffix: "+", label: "Klien Puas",      icon: Star,         color: "bg-blue-500/15 text-blue-500",     border: "border-blue-500/20" },
    { value: certifications.length,           suffix: "",  label: "Sertifikat",      icon: GraduationCap,color: "bg-emerald-500/15 text-emerald-500",border: "border-emerald-500/20" },
    { value: profile.years_experience * 1460, suffix: "+", label: "Jam Coding",      icon: Code2,        color: "bg-amber-500/15 text-amber-500",    border: "border-amber-500/20" },
  ];

  return (
    <PublicShell>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-28 pb-0">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-dots opacity-[0.15] mask-fade-b" />
          <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/8 blur-[120px]" />
          <div className="absolute left-1/4 top-20 h-64 w-64 rounded-full bg-violet-500/5 blur-[80px]" />
          <div className="absolute right-1/4 top-20 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px]" />
        </div>
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <ScrollReveal>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                — Tentang Saya
              </span>
              <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                Kenali{" "}
                <span className="text-primary-strong">Lebih Dekat</span>
              </h1>
              <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Di balik setiap baris kode dan frame video, ada cerita dan nilai yang saya pegang.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── BIO + PHOTO ── */}
      <section className="py-20">
        <div className="container">
          <div className="grid items-center gap-16 lg:grid-cols-[1fr_340px]">

            {/* Left: Bio */}
            <ScrollReveal>
              <div className="space-y-5 text-[15.5px] leading-[1.8] text-muted-foreground">
                {LONG_BIO.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Status pills */}
              <div className="mt-8 flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Indonesia
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                  <GraduationCap className="h-3.5 w-3.5 text-primary" /> Mahasiswa Informatika
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/8 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Open for Work
                </span>
              </div>

              {/* CTA buttons */}
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild variant="gradient" size="lg" className="rounded-xl shadow-lg shadow-primary/20">
                  {profile.cv_url ? (
                    <a href={profile.cv_url} download>
                      <Download className="h-4 w-4" /> Download CV
                    </a>
                  ) : (
                    <Link href="/contact">
                      <Download className="h-4 w-4" /> Hubungi Saya
                    </Link>
                  )}
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl">
                  <Link href="/projects">Lihat Karya <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </ScrollReveal>

            {/* Right: Photo with gradient glow */}
            <ScrollReveal delay={0.15}>
              <div className="relative mx-auto w-full max-w-[320px]">
                {/* Multi-layer glow blobs */}
                <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-violet-500/30 via-primary/25 to-blue-500/20 blur-3xl" />
                <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-pink-500/15 via-transparent to-cyan-500/15 blur-2xl" />

                {/* Photo container — no bg/border, just the transparent PNG */}
                <div className="relative flex items-end justify-center">
                  <Image
                    src={profile.photo_url}
                    alt={profile.full_name}
                    width={320}
                    height={420}
                    className="relative z-10 h-auto w-full max-w-[300px] drop-shadow-2xl"
                    style={{ objectFit: "contain" }}
                    priority
                  />

                  {/* Floating name card at bottom */}
                  <div className="absolute -bottom-4 left-1/2 z-20 -translate-x-1/2 w-[85%]">
                    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/90 px-4 py-3 shadow-xl backdrop-blur-md">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/80 to-violet-500/80 text-xs font-black text-white">
                        {initials(profile.full_name)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-foreground">{profile.full_name}</div>
                        <div className="text-[11px] text-muted-foreground">Web Dev · Designer · Kreator</div>
                      </div>
                      <div className="ml-auto flex-shrink-0">
                        <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Aktif
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="relative py-20 border-y border-border/40">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-muted/20" />
        <div className="container">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Apa yang saya lakukan</p>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Layanan <span className="text-primary-strong">Unggulan</span>
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => {
              const theme = SERVICE_THEME[s.category] ?? FALLBACK_THEME;
              const Icon = SERVICE_ICONS[s.category] ?? Sparkles;
              return (
                <ScrollReveal key={s.id} delay={i * 0.08}>
                  <div className={`group relative overflow-hidden rounded-2xl border bg-card/70 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${theme.border} ${theme.glow}`}>
                    {/* Top gradient line */}
                    <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-0 transition-opacity group-hover:opacity-100 ${theme.color}`} />
                    <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${theme.iconBg} ${theme.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-display font-bold text-foreground">{s.title}</h3>
                    <div className="flex flex-wrap gap-1">
                      {s.tools.slice(0, 3).map((tool) => (
                        <span key={tool} className="rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {tool}
                        </span>
                      ))}
                      {s.tools.length > 3 && (
                        <span className="rounded-md bg-muted/60 px-2 py-0.5 text-[10px] text-muted-foreground/60">
                          +{s.tools.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20">
        <div className="container">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/80 to-violet-500/8 p-10 shadow-2xl shadow-primary/8 md:p-14">
              {/* Background decoration */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-grid opacity-[0.05]" />
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-primary/20 blur-[80px]" />
                <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-violet-500/15 blur-[60px]" />
              </div>
              <div className="relative">
                <div className="mb-12 text-center">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Dalam angka</p>
                  <h2 className="font-display text-2xl font-bold sm:text-3xl">
                    Pencapaian <span className="text-primary-strong">Saya</span>
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  {STATS.map((f, i) => (
                    <div key={f.label} className="group flex flex-col items-center text-center">
                      <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-lg ${f.color} ${f.border}`}>
                        <f.icon className="h-7 w-7" />
                      </div>
                      <div className="font-display text-4xl font-black text-foreground md:text-5xl">
                        <AnimatedCounter value={f.value} suffix={f.suffix} />
                      </div>
                      <div className="mt-2 text-sm font-medium text-muted-foreground">{f.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="relative py-20 border-y border-border/40">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-muted/20" />
        <div className="container">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Yang saya pegang</p>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Nilai & <span className="text-primary-strong">Kepribadian</span>
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => {
              const VIcon = getIcon(v.icon) ?? ShieldCheck;
              return (
                <ScrollReveal key={v.title} delay={i * 0.07}>
                  <div className={`group relative overflow-hidden rounded-2xl border bg-card/70 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${v.border} ${v.glow}`}>
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-0 transition-opacity group-hover:opacity-60" />
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${v.color}`}>
                      <VIcon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-display text-base font-bold text-foreground">{v.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      {education.length > 0 && (
        <section className="py-20">
          <div className="container">
            <ScrollReveal>
              <div className="mb-12 text-center">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Perjalanan akademik</p>
                <h2 className="font-display text-3xl font-bold sm:text-4xl">
                  Riwayat <span className="text-primary-strong">Pendidikan</span>
                </h2>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {education.map((edu, i) => {
                const type = edu.type as EducationType;
                const color = EDU_TYPE_COLOR[type] ?? EDU_TYPE_COLOR.formal;
                const Icon = EDU_TYPE_ICON[type] ?? GraduationCap;
                const years =
                  edu.start_year && edu.end_year
                    ? `${edu.start_year} – ${edu.end_year}`
                    : edu.start_year
                    ? `${edu.start_year} – Sekarang`
                    : "";
                return (
                  <ScrollReveal key={edu.id} delay={i * 0.08}>
                    <article className={`group relative flex flex-col gap-4 overflow-hidden rounded-2xl border bg-card/70 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${color.border} ${color.glow}`}>
                      {/* Accent top bar */}
                      <div className={`absolute inset-x-0 top-0 h-0.5 ${color.dot} scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100`} />

                      {/* Type badge */}
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${color.bg} ${color.text}`}>
                          <Icon className="h-3 w-3" />
                          {EDU_TYPE_LABEL[type]}
                        </span>
                        {edu.is_current && (
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-500">
                            Aktif
                          </span>
                        )}
                      </div>

                      {/* Logo + info */}
                      <div className="flex items-start gap-4">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm">
                          {edu.logo_url ? (
                            <Image src={edu.logo_url} alt={edu.institution} fill sizes="56px" className="object-contain p-1" />
                          ) : (
                            <div className={`flex h-full w-full items-center justify-center ${color.bg}`}>
                              <span className={`font-display text-sm font-black ${color.text}`}>{initials(edu.institution)}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-base font-bold leading-tight text-foreground">{edu.institution}</h3>
                          {edu.field_of_study && <p className="mt-0.5 text-sm text-muted-foreground">{edu.field_of_study}</p>}
                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            {years && <span className="font-mono text-[11px] text-muted-foreground/60">{years}</span>}
                            {typeof edu.gpa === "number" && (
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${color.bg} ${color.text}`}>IPK {edu.gpa.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Achievement */}
                      {edu.achievements && (
                        <div className={`flex items-start gap-2.5 rounded-xl p-3.5 ${color.bg}`}>
                          <Trophy className={`mt-0.5 h-4 w-4 shrink-0 ${color.text}`} />
                          <p className="text-[12px] leading-relaxed text-muted-foreground">{edu.achievements}</p>
                        </div>
                      )}

                      {/* Subjects */}
                      {edu.relevant_subjects.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {edu.relevant_subjects.slice(0, 5).map((s) => (
                            <span key={s} className="rounded-lg bg-muted/60 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                              {s}
                            </span>
                          ))}
                          {edu.relevant_subjects.length > 5 && (
                            <span className="rounded-lg bg-muted/60 px-2.5 py-1 text-[10px] text-muted-foreground/60">
                              +{edu.relevant_subjects.length - 5} lagi
                            </span>
                          )}
                        </div>
                      )}
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── HOBBIES ── */}
      <section className="relative py-20 border-t border-border/40">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-muted/20" />
        <div className="container">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Di luar pekerjaan</p>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Minat & <span className="text-primary-strong">Hobi</span>
              </h2>
            </div>
          </ScrollReveal>
          <div className="mx-auto grid max-w-3xl grid-cols-4 gap-3 sm:grid-cols-8">
            {HOBBIES.map((h, i) => {
              const HIcon = getIcon(h.icon) ?? Code2;
              return (
                <ScrollReveal key={h.label} delay={i * 0.05}>
                  <div className={`group flex flex-col items-center gap-3 rounded-2xl border bg-card/70 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg ${h.border}`}>
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${h.color} transition-transform duration-300 group-hover:scale-110`}>
                      <HIcon className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] font-semibold leading-tight text-muted-foreground transition-colors group-hover:text-foreground">
                      {h.label}
                    </span>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
        <div className="container">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-violet-600 p-10 text-center shadow-2xl shadow-primary/30 md:p-16">
              {/* Decorations */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-grid opacity-[0.08]" />
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-60 w-60 rounded-full bg-white/10 blur-[60px]" />
                <div className="absolute -bottom-10 right-10 h-40 w-40 rounded-full bg-violet-300/20 blur-[40px]" />
              </div>
              <div className="relative">
                <div className="mb-2 text-white/70 text-sm font-semibold uppercase tracking-widest">Mari berkolaborasi</div>
                <h2 className="mb-4 font-display text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                  Punya Proyek Keren? 🚀
                </h2>
                <p className="mb-8 mx-auto max-w-md text-white/80 leading-relaxed">
                  Saya siap bantu wujudkan ide Anda menjadi kenyataan. Dari konsep hingga deliverable.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button asChild size="lg" className="rounded-xl bg-white text-primary hover:bg-white/90 font-semibold shadow-lg shadow-black/20">
                    <Link href="/contact">Hubungi Saya <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                  <Button asChild size="lg" className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm" variant="outline">
                    <Link href="/projects">Lihat Portofolio</Link>
                  </Button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </PublicShell>
  );
}
