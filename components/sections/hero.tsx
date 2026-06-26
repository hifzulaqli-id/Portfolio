"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  Globe,
  Video,
  Mic,
  Palette,
  Code2,
  Star,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Profile, ContentBlock } from "@/types";

const DEFAULT_ROLES = [
  "Web Developer",
  "Creative Designer",
  "Video Editor",
  "Voice Over Artist",
  "Mahasiswa Informatika",
];

const SKILL_BADGES = [
  { icon: Globe, label: "Web Dev", sub: "React & Next.js", color: "from-blue-500/15 to-indigo-500/15 border-blue-500/25 text-blue-400" },
  { icon: Video, label: "Editing", sub: "Video & Motion", color: "from-pink-500/15 to-rose-500/15 border-pink-500/25 text-pink-400" },
  { icon: Mic, label: "Voice Over", sub: "Dubbing & Narasi", color: "from-emerald-500/15 to-teal-500/15 border-emerald-500/25 text-emerald-400" },
  { icon: Palette, label: "Design", sub: "UI & Grafis", color: "from-orange-500/15 to-amber-500/15 border-orange-500/25 text-orange-400" },
];

const DEFAULT_STATS = [
  { value: "2+", label: "Tahun\nPengalaman", icon: Star },
  { value: "50+", label: "Proyek\nSelesai", icon: CheckCircle2 },
  { value: "30+", label: "Klien\nPuas", icon: Zap },
];

// Extract editable content from blocks (fall back to defaults if missing).
function useHeroData(blocks: ContentBlock[] = []) {
  const rolesBlock = blocks.find((b) => b.key === "hero.roles");
  const statsBlock = blocks.find((b) => b.key === "hero.stats");

  const roles =
    rolesBlock && Array.isArray(rolesBlock.value)
      ? (rolesBlock.value as string[])
      : DEFAULT_ROLES;

  const rawStats =
    statsBlock && Array.isArray(statsBlock.value)
      ? (statsBlock.value as { value: string; label: string }[])
      : null;
  const stats = rawStats
    ? rawStats.map((s, i) => ({
        value: s.value,
        label: s.label,
        icon: DEFAULT_STATS[i % DEFAULT_STATS.length].icon,
      }))
    : DEFAULT_STATS;

  return { roles, stats };
}

interface HeroProps {
  profile: Profile;
  blocks?: ContentBlock[];
}

export function Hero({ profile, blocks }: HeroProps) {
  const { roles, stats } = useHeroData(blocks);
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-dots opacity-30 mask-fade-b" />
        <div className="absolute left-1/4 top-20 h-80 w-80 rounded-full bg-primary/8 blur-[80px]" />
        <div className="absolute right-1/4 top-40 h-64 w-64 rounded-full bg-secondary/8 blur-[60px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-48 w-[600px] rounded-full bg-primary/5 blur-[60px]" />
      </div>

      <div className="container">
        {/* ── Three-column layout ── */}
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">

          {/* ── Left Column ── */}
          <div className="flex flex-col items-start gap-6 lg:items-start">

            {/* Availability inline badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/8 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Tersedia untuk proyek baru
            </motion.div>

            {/* Greeting + name */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                👋 Halo, perkenalkan saya
              </p>
              <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl text-balance">
                {profile.full_name}
              </h1>
              <div className="mt-3 flex items-center gap-2 font-mono text-sm text-muted-foreground">
                <Code2 className="h-4 w-4 text-primary" />
                <Typewriter words={roles} />
              </div>
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-sm text-sm text-muted-foreground leading-relaxed text-balance"
            >
              {profile.bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Button asChild size="lg" variant="gradient">
                <Link href="/projects">
                  Lihat Portofolio
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              {profile.cv_url && (
                <Button asChild size="lg" variant="outline">
                  <a href={profile.cv_url} download>
                    <Download className="h-4 w-4" />
                    Download CV
                  </a>
                </Button>
              )}
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-6 pt-1 border-t border-border/50 w-full"
            >
              {stats.map((s, i) => (
                <div key={s.label} className={`flex flex-col pt-4 ${i < stats.length - 1 ? "pr-6 border-r border-border/50" : ""}`}>
                  <span className="font-display text-2xl font-bold text-primary leading-none">
                    {s.value}
                  </span>
                  <span className="mt-0.5 text-[10px] text-muted-foreground leading-tight whitespace-pre-line">
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Center: Profile Photo ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative mx-auto flex justify-center"
          >
            {/* Glow behind photo */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-primary/25 via-primary/10 to-transparent blur-2xl scale-110" />
            {/* Ground shadow */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-8 w-48 rounded-full bg-primary/20 blur-xl" />

            {/* Photo — portrait, no circle */}
            <div className="relative h-[460px] w-[308px] sm:h-[500px] sm:w-[334px]">
              <Image
                src={profile.photo_url}
                alt={profile.full_name}
                fill
                priority
                sizes="(max-width: 640px) 308px, 334px"
                className="object-contain object-bottom"
                style={{ filter: "drop-shadow(0 24px 48px rgba(108,99,255,0.35))" }}
              />
            </div>

            {/* Floating badge — Web Dev */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-10 top-16 flex items-center gap-2 rounded-2xl border border-border bg-card/90 px-3 py-2.5 text-xs font-medium backdrop-blur-md shadow-xl"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                <Globe className="h-4 w-4" />
              </span>
              <div>
                <div className="font-semibold text-foreground">Web Dev</div>
                <div className="text-[10px] text-muted-foreground">React & Next.js</div>
              </div>
            </motion.div>

            {/* Floating badge — Editing */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -right-10 top-20 flex items-center gap-2 rounded-2xl border border-border bg-card/90 px-3 py-2.5 text-xs font-medium backdrop-blur-md shadow-xl"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-500/20 text-pink-400">
                <Video className="h-4 w-4" />
              </span>
              <div>
                <div className="font-semibold text-foreground">Editing</div>
                <div className="text-[10px] text-muted-foreground">Video & Motion</div>
              </div>
            </motion.div>

            {/* Floating badge — Voice Over */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -left-8 bottom-20 flex items-center gap-2 rounded-2xl border border-border bg-card/90 px-3 py-2.5 text-xs font-medium backdrop-blur-md shadow-xl"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Mic className="h-4 w-4" />
              </span>
              <div>
                <div className="font-semibold text-foreground">Voice Over</div>
                <div className="text-[10px] text-muted-foreground">Dubbing & Narasi</div>
              </div>
            </motion.div>

            {/* Floating badge — Design */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute -right-8 bottom-24 flex items-center gap-2 rounded-2xl border border-border bg-card/90 px-3 py-2.5 text-xs font-medium backdrop-blur-md shadow-xl"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400">
                <Palette className="h-4 w-4" />
              </span>
              <div>
                <div className="font-semibold text-foreground">Design</div>
                <div className="text-[10px] text-muted-foreground">UI & Grafis</div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right Column ── */}
          <div className="hidden lg:flex flex-col gap-4 items-start">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Keahlian Utama
              </p>
              <div className="flex flex-col gap-2">
                {SKILL_BADGES.map((skill, i) => (
                  <motion.div
                    key={skill.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                    className={`flex items-center gap-3 rounded-xl border bg-gradient-to-r px-4 py-3 backdrop-blur-sm ${skill.color}`}
                  >
                    <skill.icon className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground">{skill.label}</div>
                      <div className="text-[10px] text-muted-foreground">{skill.sub}</div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <div
                          key={j}
                          className={`h-1.5 w-1.5 rounded-full ${j < 4 ? "bg-current opacity-80" : "bg-current opacity-20"}`}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Open for work card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="w-full rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Open for Work</div>
                  <div className="text-[11px] text-muted-foreground">Siap terima proyek baru</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-primary to-emerald-400" />
                </div>
                <span className="text-xs text-muted-foreground">75% capacity</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Typewriter({ words }: { words: string[] }) {
  const [index, setIndex] = React.useState(0);
  const [text, setText] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    const current = words[index % words.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => i + 1);
    } else {
      timeout = setTimeout(
        () => {
          setText((t) =>
            deleting
              ? current.slice(0, t.length - 1)
              : current.slice(0, t.length + 1)
          );
        },
        deleting ? 45 : 85
      );
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, index, words]);

  return (
    <span className="text-foreground">
      {text}
      <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-primary align-middle">
        &nbsp;
      </span>
    </span>
  );
}
