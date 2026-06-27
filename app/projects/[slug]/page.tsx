import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Github,
  Home,
  Calendar,
  FolderOpen,
  Tag,
  Eye,
} from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { ProjectLinkIcon } from "@/components/shared/link-icon";
import { TechStack } from "@/components/shared/tech-stack";
import { GalleryLightbox } from "@/components/shared/gallery-lightbox";
import { VideoEmbed } from "@/components/shared/video-embed";
import { AudioPlayer } from "@/components/shared/audio-player";
import {
  getProjectBySlug,
  getProjectNeighbors,
  getAllSlugs,
} from "@/lib/data/projects";
import {
  CATEGORY_BADGE_VARIANT,
  CATEGORY_META,
} from "@/types";
import { formatDate, cn } from "@/lib/utils";
import { isDataUrl } from "@/lib/image-upload";

export const revalidate = 60;

type Params = { params: { slug: string } };

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Proyek Tidak Ditemukan" };
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [{ url: project.thumbnail_url }],
    },
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const project = await getProjectBySlug(params.slug);
  if (!project || project.status !== "published") notFound();

  const { prev, next } = await getProjectNeighbors(params.slug);
  const meta = CATEGORY_META[project.category];

  // Use the proper gallery field (GalleryItem[]) with captions
  const gallery: { url: string; caption: string }[] =
    project.gallery && project.gallery.length > 0
      ? project.gallery
      : [{ url: project.thumbnail_url, caption: project.title }];

  const isIgFeed = project.category === "design" && project.design_type === "instagram_feed";
  const isPoster = project.category === "design" && project.design_type === "poster";
  const isVideo = project.category === "video";
  const isVoice = project.category === "voice";

  // Determine gallery variant
  const galleryVariant = isIgFeed
    ? "instagram_feed"
    : isPoster
    ? "poster"
    : "default";

  const hasContent = project.content && project.content.trim().length > 0;
  const hasTechStack = project.tech_stack && project.tech_stack.length > 0;
  const hasLinks = project.links && project.links.length > 0;
  const hasLegacyLinks = !hasLinks && (project.live_url || project.github_url);

  return (
    <PublicShell>
      <article className="pt-24">
        {/* Breadcrumb */}
        <div className="container">
          <nav className="flex items-center gap-1.5 py-4 text-xs text-muted-foreground">
            <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Home className="h-3 w-3" />
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/projects" className="hover:text-primary transition-colors">
              Proyek
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="line-clamp-1 text-foreground font-medium">{project.title}</span>
          </nav>
        </div>

        {/* Hero Section */}
        <ScrollReveal className="container">
          <div className="grid gap-4 pb-6">
            {/* Category + Date */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={CATEGORY_BADGE_VARIANT[project.category]} className="gap-1.5">
                <span>{meta.emoji}</span> {meta.label}
              </Badge>
              <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatDate(project.created_at)}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl text-balance">
              {project.title}
            </h1>

            {/* Description */}
            <p className="max-w-3xl text-base text-muted-foreground md:text-lg leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Hero Image / Media */}
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-card">
            {(isVideo || isVoice) && project.media_url ? (
              <VideoEmbed url={project.media_url} className="h-full w-full rounded-none border-0" />
            ) : (
              <Image
                src={project.thumbnail_url}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
                unoptimized={isDataUrl(project.thumbnail_url)}
              />
            )}
          </div>

          {/* Action Buttons — Project Links */}
          <div className="mt-6 flex flex-wrap gap-3">
            {hasLinks &&
              project.links!.map((link, i) => (
                <ProjectLinkIcon
                  key={i}
                  platform={link.platform}
                  url={link.url}
                  size="lg"
                />
              ))}
            {hasLegacyLinks && (
              <>
                {project.live_url && (
                  <Button asChild variant="gradient" size="lg">
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Lihat Live
                    </a>
                  </Button>
                )}
                {project.github_url && (
                  <Button asChild variant="outline" size="lg">
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                      Lihat GitHub
                    </a>
                  </Button>
                )}
              </>
            )}
          </div>
        </ScrollReveal>

        {/* Content + Sidebar */}
        <div className="container mt-12 grid gap-10 lg:grid-cols-[1fr_20rem]">
          <ScrollReveal>
            {/* About Project */}
            <h2 className="font-display text-2xl font-bold flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Tentang Proyek
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
              {hasContent ? (
                project.content!.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              ) : (
                <p>{project.description}</p>
              )}
            </div>

            {/* Gallery — uses GalleryLightbox with captions & lightbox navigation */}
            <div className="mt-12">
              <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                Galeri
                <span className="ml-2 rounded-full bg-muted/60 px-2.5 py-0.5 text-xs font-mono font-normal text-muted-foreground">
                  {gallery.length} {gallery.length === 1 ? "gambar" : "gambar"}
                </span>
              </h2>
              <div className="mt-4">
                <GalleryLightbox items={gallery} variant={galleryVariant} />
              </div>
            </div>
          </ScrollReveal>

          {/* Sidebar */}
          <ScrollReveal delay={0.1}>
            <aside className="sticky top-24 space-y-6">
              {/* Tech Stack with icons */}
              {hasTechStack && (
                <div className="rounded-2xl border border-border bg-card/40 p-6">
                  <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" />
                    Tech Stack
                  </h3>
                  <div className="mt-4">
                    <TechStack items={project.tech_stack} variant="card" />
                  </div>
                </div>
              )}

              {/* Project Details */}
              <div className="rounded-2xl border border-border bg-card/40 p-6">
                <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <FolderOpen className="h-3.5 w-3.5" />
                  Detail
                </h3>
                <dl className="mt-3 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Kategori</dt>
                    <dd className="font-medium flex items-center gap-1.5">
                      <span>{meta.emoji}</span> {meta.label}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Tanggal</dt>
                    <dd className="font-medium">
                      {formatDate(project.created_at, {
                        month: "short",
                        year: "numeric",
                      })}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Status</dt>
                    <dd className="font-medium text-emerald-400">Published</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Galeri</dt>
                    <dd className="font-medium">{gallery.length} gambar</dd>
                  </div>
                  {hasTechStack && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Teknologi</dt>
                      <dd className="font-medium">{project.tech_stack.length} tools</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Quick Links */}
              {(hasLinks || hasLegacyLinks) && (
                <div className="rounded-2xl border border-border bg-card/40 p-6">
                  <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Links
                  </h3>
                  <div className="mt-3 space-y-2">
                    {hasLinks &&
                      project.links!.map((link, i) => (
                        <ProjectLinkIcon
                          key={i}
                          platform={link.platform}
                          url={link.url}
                          size="sm"
                          className="w-full justify-center"
                        />
                      ))}
                    {hasLegacyLinks && (
                      <>
                        {project.live_url && (
                          <ProjectLinkIcon
                            platform="live"
                            url={project.live_url}
                            size="sm"
                            className="w-full justify-center"
                          />
                        )}
                        {project.github_url && (
                          <ProjectLinkIcon
                            platform="github"
                            url={project.github_url}
                            size="sm"
                            className="w-full justify-center"
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </ScrollReveal>
        </div>

        {/* Prev / Next nav */}
        <div className="container mt-16 border-t border-border py-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card/40 p-5 transition-all hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-0.5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/80 transition-all group-hover:bg-primary/10">
                  <ArrowLeft className="h-5 w-5 text-muted-foreground transition-all group-hover:text-primary group-hover:-translate-x-0.5" />
                </div>
                <span className="min-w-0">
                  <span className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Proyek Sebelumnya
                  </span>
                  <span className="block truncate font-semibold group-hover:text-primary transition-colors">
                    {prev.title}
                  </span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group flex items-center justify-end gap-4 rounded-2xl border border-border bg-card/40 p-5 text-right transition-all hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-0.5"
              >
                <span className="min-w-0">
                  <span className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Proyek Berikutnya
                  </span>
                  <span className="block truncate font-semibold group-hover:text-primary transition-colors">
                    {next.title}
                  </span>
                </span>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/80 transition-all group-hover:bg-primary/10">
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-0.5" />
                </div>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </article>
    </PublicShell>
  );
}
