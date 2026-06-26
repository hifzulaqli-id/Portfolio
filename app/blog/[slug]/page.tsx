import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home, Clock, ArrowLeft } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogContent } from "@/components/sections/blog/blog-content";
import { ShareButton } from "@/components/sections/blog/share-button";
import { getBlogPostBySlug, getBlogSlugs } from "@/lib/data/blog";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

type Params = { params: { slug: string } };

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: "Artikel Tidak Ditemukan" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.thumbnail_url ? [{ url: post.thumbnail_url }] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: Params) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post || post.status !== "published") notFound();

  return (
    <PublicShell>
      <article className="pt-24">
        {/* Breadcrumb */}
        <div className="container">
          <nav className="flex items-center gap-1.5 py-4 text-xs text-muted-foreground">
            <Link href="/" className="flex items-center gap-1 hover:text-primary">
              <Home className="h-3 w-3" />
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/blog" className="hover:text-primary">
              Blog
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="line-clamp-1 text-foreground">{post.title}</span>
          </nav>
        </div>

        {/* Header */}
        <div className="container max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 pb-4">
            {post.category && <Badge variant="default">{post.category}</Badge>}
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {post.reading_time} menit baca
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl text-balance">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              {post.excerpt}
            </p>
          )}
          {post.published_at && (
            <div className="mt-4 font-mono text-xs text-muted-foreground">
              Diterbitkan {formatDate(post.published_at, { dateStyle: "long" })}
            </div>
          )}
        </div>

        {/* Cover */}
        {post.thumbnail_url && (
          <div className="container max-w-4xl py-8">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border">
              <Image
                src={post.thumbnail_url}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Content + TOC */}
        <div className="container max-w-4xl pb-10">
          {post.content && <BlogContent content={post.content} />}
        </div>

        {/* Tags + share */}
        <div className="container max-w-4xl border-t border-border py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="muted" className="font-mono text-[11px]">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
            <ShareButton title={post.title} />
          </div>
        </div>

        {/* Back nav */}
        <div className="container max-w-4xl py-6">
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4" />
              Semua Artikel
            </Link>
          </Button>
        </div>
      </article>
    </PublicShell>
  );
}
