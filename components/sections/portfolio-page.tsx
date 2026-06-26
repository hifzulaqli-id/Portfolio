"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Globe,
  Palette,
  Video,
  Mic,
  LayoutGrid,
  Search,
  FolderOpen,
  ExternalLink,
} from "lucide-react";
import { CATEGORY_META, type Project, type ProjectCategory } from "@/types";
import { cn } from "@/lib/utils";
import { getIcon, getTechIcon } from "@/lib/icons";
import { isDataUrl } from "@/lib/image-upload";

// ── Types ────────────────────────────────────────────────────────────────────
type Filter = "all" | ProjectCategory;

// ── Category config ───────────────────────────────────────────────────────────
const FILTERS: {
  key: Filter;
  label: string;
  icon: React.ElementType;
  activeBg: string;
}[] = [
  { key: "all",    label: "Semua",                icon: LayoutGrid, activeBg: "bg-primary text-primary-foreground" },
  { key: "web",    label: "Web Developer",        icon: Globe,      activeBg: "bg-blue-500 text-white" },
  { key: "design", label: "Design Ads Instagram", icon: Palette,    activeBg: "bg-purple-500 text-white" },
  { key: "video",  label: "Editing Video",        icon: Video,      activeBg: "bg-pink-500 text-white" },
  { key: "voice",  label: "Voice Over",           icon: Mic,        activeBg: "bg-emerald-500 text-white" },
];

const CATEGORY_CARD_THEME: Record<string, { badge: string; glow: string; icon: string }> = {
  web:    { badge: "bg-blue-500/15 text-blue-500 border-blue-500/30",    glow: "group-hover:shadow-blue-500/15",    icon: "bg-blue-500/15 text-blue-500" },
  design: { badge: "bg-purple-500/15 text-purple-500 border-purple-500/30", glow: "group-hover:shadow-purple-500/15", icon: "bg-purple-500/15 text-purple-500" },
  video:  { badge: "bg-pink-500/15 text-pink-500 border-pink-500/30",    glow: "group-hover:shadow-pink-500/15",    icon: "bg-pink-500/15 text-pink-500" },
  voice:  { badge: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30", glow: "group-hover:shadow-emerald-500/15", icon: "bg-emerald-500/15 text-emerald-500" },
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  web: Globe, design: Palette, video: Video, voice: Mic,
};

// ── Project Card ─────────────────────────────────────────────────────────────
function ProjectCardNew({ project, index }: { project: Project; index: number }) {
  const meta = CATEGORY_META[project.category];
  const theme = CATEGORY_CARD_THEME[project.category];
  const Icon = CATEGORY_ICONS[project.category] ?? Globe;
  const isIgFeed = project.category === "design" && project.design_type === "instagram_feed";
  const isPoster = project.category === "design" && project.design_type === "poster";

  // Collect gallery image URLs for IG mini grid preview
  const galleryUrls = project.gallery?.map((g) => g.url).filter(Boolean) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      layout
    >
      <Link
        href={`/projects/${project.slug}`}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-400 hover:-translate-y-2 hover:border-transparent hover:shadow-2xl",
          theme?.glow
        )}
      >
        {/* Thumbnail */}
        {isIgFeed && galleryUrls.length > 0 ? (
          // Instagram Feed: mini 3-col grid preview
          <div className="relative aspect-square overflow-hidden bg-muted/40">
            <div className="grid grid-cols-3 gap-0.5 h-full w-full">
              {galleryUrls.slice(0, 9).map((url, i) => (
                <div key={i} className="relative aspect-square overflow-hidden bg-muted/40">
                  <Image
                    src={url}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover"
                    unoptimized={isDataUrl(url)}
                  />
                </div>
              ))}
            </div>
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Category badge */}
            <div className={cn(
              "absolute left-3 top-3 flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-bold backdrop-blur-md shadow-sm",
              theme?.badge
            )}>
              <Icon className="h-3 w-3" />
              {meta.short}
            </div>

            {/* Arrow button on hover */}
            <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-gray-900 opacity-0 shadow-md backdrop-blur-md transition-all duration-300 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0">
              <ArrowUpRight className="h-4 w-4" />
            </div>

            {/* View overlay on hover */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              <span className="flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-xs font-bold text-gray-900 shadow-lg backdrop-blur-md">
                <ExternalLink className="h-3.5 w-3.5" />
                Lihat Detail
              </span>
            </div>
          </div>
        ) : (
          // Default / Poster: single image thumbnail
          <div className={cn(
            "relative overflow-hidden bg-muted/40",
            isPoster ? "aspect-[3/4]" : "aspect-[16/10]"
          )}>
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-600 group-hover:scale-108"
              unoptimized={isDataUrl(project.thumbnail_url)}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Category badge */}
            <div className={cn(
              "absolute left-3 top-3 flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-bold backdrop-blur-md shadow-sm",
              theme?.badge
            )}>
              <Icon className="h-3 w-3" />
              {meta.short}
            </div>

            {/* Arrow button on hover */}
            <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-gray-900 opacity-0 shadow-md backdrop-blur-md transition-all duration-300 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0">
              <ArrowUpRight className="h-4 w-4" />
            </div>

            {/* View overlay on hover */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              <span className="flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-xs font-bold text-gray-900 shadow-lg backdrop-blur-md">
                <ExternalLink className="h-3.5 w-3.5" />
                Lihat Detail
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div>
            <h3 className="font-display text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-1">
              {project.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </div>

          {/* Tech stack with icons */}
          {project.tech_stack.length > 0 && (
            <div className="mt-auto flex flex-wrap items-center gap-1.5 border-t border-border/50 pt-3">
              {project.tech_stack.slice(0, 4).map((tech) => {
                const iconName = tech.icon || getTechIcon(tech.name);
                const TechIcon = getIcon(iconName);
                return (
                  <span
                    key={tech.name}
                    className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {TechIcon && <TechIcon className="h-2.5 w-2.5 shrink-0" />}
                    {tech.name}
                  </span>
                );
              })}
              {project.tech_stack.length > 4 && (
                <span className="rounded-md bg-muted/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  +{project.tech_stack.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <div className={cn("flex items-center gap-3 rounded-2xl border border-border bg-card/60 px-4 py-3 backdrop-blur-sm", color)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-current/10">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="font-display text-xl font-bold text-foreground leading-none">{value}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export function PortfolioPage({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = React.useState<Filter>("all");
  const [search, setSearch] = React.useState("");
  const filterRef = React.useRef<HTMLDivElement>(null);

  const handleFilter = (key: Filter) => {
    setFilter(key);
    setTimeout(() => {
      if (filterRef.current) {
        const top = filterRef.current.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 100);
  };

  const filtered = React.useMemo(() => {
    let result = projects;
    if (filter !== "all") result = result.filter((p) => p.category === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tech_stack.some((t) => t.name.toLowerCase().includes(q))
      );
    }
    return result;
  }, [filter, projects, search]);

  const counts = React.useMemo(() => ({
    all: projects.length,
    web: projects.filter((p) => p.category === "web").length,
    design: projects.filter((p) => p.category === "design").length,
    video: projects.filter((p) => p.category === "video").length,
    voice: projects.filter((p) => p.category === "voice").length,
  }), [projects]);

  return (
    <>
      {/* ── Hero Header ── */}
      <section className="relative overflow-hidden pt-28 pb-20">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-dots opacity-20 mask-fade-b" />
          <div className="absolute left-1/2 top-0 h-96 w-[700px] -translate-x-1/2 rounded-full bg-primary/8 blur-[100px]" />
        </div>

        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <FolderOpen className="h-3.5 w-3.5" />
              — Portofolio
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Semua{" "}
              <span className="text-primary-strong">Proyek</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Jelajahi <strong className="text-foreground">{projects.length} proyek</strong> lintas kategori — web, desain, video, hingga voice over.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ── Filter + Search bar ── */}
      <div ref={filterRef} className="sticky top-16 z-30 border-b border-border/60 bg-background/90 py-4 backdrop-blur-xl">
        <div className="container">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => {
                const active = filter === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => handleFilter(f.key)}
                    className={cn(
                      "flex flex-shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
                      active
                        ? f.activeBg
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <f.icon className="h-4 w-4" />
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative flex-shrink-0 sm:w-56">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari proyek..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-xl border border-border bg-card/60 pl-9 pr-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <section className="py-12">
        <div className="container">
          {/* Result count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 flex items-center gap-2"
          >
            <span className="text-sm text-muted-foreground">
              Menampilkan{" "}
              <strong className="text-foreground">{filtered.length}</strong>{" "}
              dari {projects.length} proyek
            </span>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                ✕ Hapus filter
              </button>
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-24 text-center"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted/60">
                  <FolderOpen className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Proyek tidak ditemukan</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Coba ganti filter atau kata pencarian
                  </p>
                </div>
                <button
                  onClick={() => { setFilter("all"); setSearch(""); }}
                  className="mt-2 rounded-xl border border-border bg-card/60 px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 transition-colors"
                >
                  Reset Filter
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`${filter}-${search}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filtered.map((project, i) => (
                  <ProjectCardNew key={project.id} project={project} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-border/50 bg-card/20 py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">
                Tertarik Kerja Sama?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Proyek Anda bisa jadi karya berikutnya di sini.
              </p>
            </div>
            <Link
              href="/contact"
              className="group mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              Hubungi Saya
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
