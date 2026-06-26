import type { Metadata } from "next";
import { PenLine } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { BlogGrid } from "@/components/sections/blog/blog-grid";
import { getBlogPosts } from "@/lib/data/blog";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export const metadata: Metadata = {
  title: "Blog | Hifzul Aqli",
  description:
    "Tulisan seputar web development, design, video editing, dan pengalaman kreatif dari Hifzul Aqli.",
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getBlogPosts({ publishedOnly: true });

  return (
    <PublicShell>
      {/* ── Hero Header ── */}
      <section className="relative overflow-hidden pt-28 pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-dots opacity-20 mask-fade-b" />
          <div className="absolute left-1/2 top-0 h-96 w-[700px] -translate-x-1/2 rounded-full bg-primary/8 blur-[100px]" />
        </div>

        <div className="container text-center">
          <ScrollReveal>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <PenLine className="h-3.5 w-3.5" />
              — Blog
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Catatan &{" "}
              <span className="text-primary-strong">Tulisan</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Insight, tutorial, dan cerita dari perjalanan kreatif serta teknis saya —{" "}
              <strong className="text-foreground">{posts.length} artikel</strong> tersedia.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Blog Grid ── */}
      <section className="pb-20">
        <div className="container">
          <BlogGrid posts={posts} />
        </div>
      </section>
    </PublicShell>
  );
}
