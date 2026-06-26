"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ArrowUpRight,
  PenLine,
  BookOpen,
  Search,
  Tag,
  Flame,
  Calendar,
} from "lucide-react";
import type { BlogPost } from "@/types";
import { cn, formatDate } from "@/lib/utils";

// ── Blog Card ─────────────────────────────────────────────────────────────────
function BlogCard({ post, index, featured = false }: { post: BlogPost; index: number; featured?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      layout
    >
      <Link
        href={`/blog/${post.slug}`}
        className={cn(
          "group flex overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10",
          featured ? "flex-row" : "flex-col"
        )}
      >
        {/* Thumbnail */}
        <div className={cn("relative overflow-hidden bg-muted/40 flex-shrink-0", featured ? "w-64 min-h-full" : "aspect-[16/9]")}>
          {post.thumbnail_url ? (
            <Image
              src={post.thumbnail_url}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full min-h-[200px] items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <PenLine className="h-10 w-10 text-primary/30" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Featured badge */}
          {post.is_featured && (
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-xl border border-orange-400/40 bg-orange-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm shadow-sm">
              <Flame className="h-3 w-3" /> Featured
            </span>
          )}

          {/* Category */}
          {post.category && !post.is_featured && (
            <span className="absolute left-3 top-3 rounded-xl border border-primary/30 bg-primary/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm shadow-sm">
              {post.category}
            </span>
          )}

          {/* Arrow hover */}
          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-gray-900 opacity-0 shadow-md backdrop-blur-md transition-all duration-300 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-lg bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                >
                  <Tag className="h-2.5 w-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex-1">
            <h3
              className={cn(
                "font-display font-bold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2",
                featured ? "text-xl" : "text-base"
              )}
            >
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 border-t border-border/50 pt-3 text-[11px] text-muted-foreground">
            {post.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(post.published_at, { day: "numeric", month: "short", year: "numeric" })}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.reading_time} mnt baca
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

const CAT_COLORS: Record<string, string> = {
  "all": "bg-primary text-primary-foreground",
  "Web Development": "bg-blue-500 text-white",
  "Video Editing": "bg-pink-500 text-white",
  "Design": "bg-purple-500 text-white",
};

// ── Main Grid ─────────────────────────────────────────────────────────────────
export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const filterRef = React.useRef<HTMLDivElement>(null);

  const handleCategory = (cat: string) => {
    setCategory(cat);
    setTimeout(() => {
      if (filterRef.current) {
        const top = filterRef.current.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 100);
  };

  const categories = React.useMemo(() => {
    const set = new Set(posts.map((p) => p.category).filter(Boolean) as string[]);
    return ["all", ...Array.from(set)];
  }, [posts]);

  const filtered = React.useMemo(() => {
    let result = category === "all" ? posts : posts.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, category, search]);

  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 py-24 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted/60">
          <PenLine className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <div>
          <p className="font-semibold text-foreground">Belum ada artikel</p>
          <p className="mt-1 text-sm text-muted-foreground">Tulisan akan muncul di sini</p>
        </div>
      </motion.div>
    );
  }

  const featured = filtered.find((p) => p.is_featured);
  const rest = filtered.filter((p) => !p.is_featured);

  return (
    <div>
      {/* ── Filter + Search ── */}
      <div ref={filterRef} className="sticky top-16 z-30 mb-8 border-b border-border/60 bg-background/90 py-4 backdrop-blur-xl sm:-mx-0 sm:px-0 -mx-4 px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = category === cat;
              const activeColor = CAT_COLORS[cat] || "bg-primary text-primary-foreground";
              return (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={cn(
                    "flex flex-shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
                    active
                      ? activeColor
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  {cat === "all" ? <BookOpen className="h-3.5 w-3.5" /> : <Tag className="h-3.5 w-3.5" />}
                  {cat === "all" ? "Semua" : cat}
                </button>
              );
            })}
          </div>

        {/* Search */}
        <div className="relative flex-shrink-0 sm:w-56">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari artikel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-xl border border-border bg-card/60 pl-9 pr-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        </div>
      </div>

      {/* Result count */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          <strong className="text-foreground">{filtered.length}</strong> dari {posts.length} artikel
        </span>
        {search && (
          <button
            onClick={() => setSearch("")}
            className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            ✕ Hapus
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 py-20 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted/60">
              <Search className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <p className="font-semibold text-foreground">Tidak ditemukan</p>
            <p className="text-sm text-muted-foreground">Coba ganti kata pencarian</p>
            <button
              onClick={() => { setCategory("all"); setSearch(""); }}
              className="mt-2 rounded-xl border border-border bg-card/60 px-4 py-2 text-sm font-medium hover:border-primary/40 transition-colors"
            >
              Reset Filter
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={`${category}-${search}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Featured post — horizontal card on top */}
            {featured && (
              <div className="mb-8">
                <BlogCard post={featured} index={0} featured />
              </div>
            )}

            {/* Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, i) => (
                <BlogCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
