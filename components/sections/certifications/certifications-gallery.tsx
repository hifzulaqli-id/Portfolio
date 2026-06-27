"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award, CalendarDays, ShieldCheck, Clock, XCircle,
  ExternalLink, Search, Star, Filter, Globe, Palette, Film, Trophy, LayoutGrid,
} from "lucide-react";
import { Lightbox, type LightboxItem } from "@/components/shared/lightbox";
import { CERT_CATEGORY_META, CERT_STATUS_META, type Certification } from "@/types";
import { cn, formatDate } from "@/lib/utils";

const STATUS_ICON = { verified: ShieldCheck, "in-progress": Clock, expired: XCircle };
const STATUS_COLOR: Record<string, string> = {
  verified:    "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  "in-progress": "bg-amber-500/15 text-amber-500 border-amber-500/30",
  expired:     "bg-red-500/15 text-red-500 border-red-500/30",
};

const CERT_COLORS: Record<string, string> = {
  web: "bg-blue-500 text-white",
  design: "bg-purple-500 text-white",
  video: "bg-pink-500 text-white",
  competition: "bg-amber-500 text-white",
  default: "bg-primary text-white",
};

const CERT_ICONS_MAP: Record<string, React.ElementType> = {
  "all": LayoutGrid,
  "web": Globe,
  "design": Palette,
  "video": Film,
  "competition": Trophy,
};

export function CertificationsGallery({ items }: { items: Certification[] }) {
  const [filter, setFilter] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");
  const filterRef = React.useRef<HTMLDivElement>(null);

  const handleFilter = (cat: string) => {
    setFilter(cat);
    setTimeout(() => {
      if (filterRef.current) {
        const top = filterRef.current.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 100);
  };
  const [lightboxIdx, setLightboxIdx] = React.useState(-1);

  const categories = React.useMemo(() => {
    const set = new Set(items.map((c) => c.category));
    return ["all", ...Array.from(set)];
  }, [items]);

  const filtered = React.useMemo(() => {
    let result = filter === "all" ? items : items.filter((c) => c.category === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, filter, search]);

  const lightboxItems: LightboxItem[] = React.useMemo(
    () => filtered.map((c) => ({
      src: c.certificate_image_url || "/images/cert-1.svg",
      alt: c.name,
      caption: (
        <>
          <strong className="text-foreground">{c.name}</strong> — {c.issuer}
          {c.credential_id ? ` · ID: ${c.credential_id}` : ""}
        </>
      ),
      link: c.credential_url ?? undefined,
    })),
    [filtered]
  );

  const featuredCount = items.filter((c) => c.is_featured).length;
  const verifiedCount = items.filter((c) => c.badge_status === "verified").length;

  return (
    <div>

      {/* ── Filter + Search bar ── */}
      <div ref={filterRef} className="sticky top-16 z-30 mb-8 border-b border-border/60 bg-background/90 py-4 backdrop-blur-xl sm:-mx-0 sm:px-0 -mx-4 px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = filter === cat;
              const meta = cat === "all" ? null : CERT_CATEGORY_META[cat as Certification["category"]];
              
              let activeColor = "bg-primary text-white";
              if (cat === "web") activeColor = "bg-blue-500 text-white";
              if (cat === "design") activeColor = "bg-purple-500 text-white";
              if (cat === "video") activeColor = "bg-pink-500 text-white";
              if (cat === "competition") activeColor = "bg-amber-500 text-white";
              
              const Icon = CERT_ICONS_MAP[cat] || LayoutGrid;

              return (
                <button
                  key={cat}
                  onClick={() => handleFilter(cat)}
                  className={cn(
                    "flex flex-shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
                    active
                      ? activeColor
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {cat === "all" ? "Semua" : meta?.label ?? cat}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative flex-shrink-0 sm:w-52">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari sertifikat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-xl border border-border bg-card/60 pl-9 pr-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Result count */}
      <div className="mb-5 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          <strong className="text-foreground">{filtered.length}</strong> dari {items.length} sertifikat
        </span>
        {search && (
          <button onClick={() => setSearch("")} className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground hover:bg-muted/80">
            ✕ Hapus
          </button>
        )}
      </div>

      {/* ── Grid ── */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 py-24 text-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted/60">
              <Award className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <p className="font-semibold text-foreground">Tidak ditemukan</p>
            <p className="text-sm text-muted-foreground">Coba ubah filter atau kata pencarian</p>
          </motion.div>
        ) : (
          <motion.div
            key={`${filter}-${search}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((cert, i) => {
              const meta = CERT_STATUS_META[cert.badge_status];
              const StatusIcon = STATUS_ICON[cert.badge_status];
              const catMeta = CERT_CATEGORY_META[cert.category];
              const statusColor = STATUS_COLOR[cert.badge_status];

              return (
                <motion.button
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  onClick={() => setLightboxIdx(i)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted/40">
                    <Image
                      src={cert.certificate_image_url || "/images/cert-1.svg"}
                      alt={cert.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized={cert.certificate_image_url?.startsWith("data:")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Category badge */}
                    <span className="absolute left-3 top-3 flex items-center gap-1 rounded-xl border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md shadow-sm">
                      {catMeta.emoji} {catMeta.label}
                    </span>

                    {/* Featured */}
                    {cert.is_featured && (
                      <span className="absolute right-3 top-3 flex items-center gap-1 rounded-xl border border-amber-400/40 bg-amber-500/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md shadow-sm">
                        <Star className="h-3 w-3 fill-white" /> Featured
                      </span>
                    )}

                    {/* Hover open icon */}
                    <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-gray-900 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex-1">
                      <h3 className="font-display text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2">
                        {cert.name}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-muted-foreground">{cert.issuer}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/50 pt-3">
                      {cert.issue_date && (
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <CalendarDays className="h-3 w-3" />
                          {formatDate(cert.issue_date, { month: "short", year: "numeric" })}
                        </span>
                      )}
                      <span className={cn("flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold", statusColor)}>
                        <StatusIcon className="h-3 w-3" />
                        {meta.label}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <Lightbox
        items={lightboxItems}
        index={lightboxIdx}
        onClose={() => setLightboxIdx(-1)}
        onNavigate={setLightboxIdx}
      />
    </div>
  );
}
