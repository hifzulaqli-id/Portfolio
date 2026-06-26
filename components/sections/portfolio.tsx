"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Globe, Palette, Video, Mic, LayoutGrid } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProjectCard } from "@/components/shared/project-card";
import { Button } from "@/components/ui/button";
import { CATEGORY_META, type Project, type ProjectCategory } from "@/types";
import { cn } from "@/lib/utils";

type Filter = "all" | ProjectCategory;

const FILTERS: { key: Filter; label: string; icon: React.ElementType; activeBg: string }[] = [
  { key: "all",    label: "Semua",                icon: LayoutGrid, activeBg: "bg-primary text-primary-foreground" },
  { key: "web",    label: "Web Developer",        icon: Globe,      activeBg: "bg-blue-500 text-white" },
  { key: "design", label: "Design Ads Instagram", icon: Palette,    activeBg: "bg-purple-500 text-white" },
  { key: "video",  label: "Editing Video",        icon: Video,      activeBg: "bg-pink-500 text-white" },
  { key: "voice",  label: "Voice Over",           icon: Mic,        activeBg: "bg-emerald-500 text-white" },
];

const CATEGORY_COLOR: Record<string, string> = {
  web:    "bg-blue-500/20 text-blue-500 border-blue-500/40",
  design: "bg-purple-500/20 text-purple-500 border-purple-500/40",
  video:  "bg-pink-500/20 text-pink-500 border-pink-500/40",
  voice:  "bg-emerald-500/20 text-emerald-500 border-emerald-500/40",
};

interface PortfolioProps {
  projects: Project[];
  showAllLink?: boolean;
}

export function Portfolio({ projects, showAllLink = true }: PortfolioProps) {
  const [filter, setFilter] = React.useState<Filter>("all");

  const filtered = React.useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((p) => p.category === filter);
  }, [filter, projects]);

  return (
    <section id="portofolio" className="section-pad relative overflow-hidden">
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-primary/5 blur-[80px]" />
        <div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-secondary/5 blur-[80px]" />
      </div>

      <div className="container">
        <SectionHeading
          eyebrow="Portofolio"
          title={
            <>
              Proyek <span className="text-primary-strong">Terbaru</span>
            </>
          }
          description="Beberapa karya yang sudah saya kerjakan untuk klien dan proyek pribadi."
        />

        {/* Filter tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "flex flex-shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
                  active
                    ? f.activeBg
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <f.icon className="h-4 w-4" />
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center text-muted-foreground"
            >
              Belum ada proyek di kategori ini.
            </motion.p>
          ) : (
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {showAllLink && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-12 flex justify-center"
          >
            <Button
              asChild
              variant="outline"
              size="lg"
              className="group rounded-xl border-border/80 hover:border-primary/50"
            >
              <Link href="/projects">
                Lihat Semua Proyek
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
