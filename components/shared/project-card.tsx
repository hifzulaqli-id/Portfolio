import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Globe, Palette, Video, Mic, ExternalLink } from "lucide-react";
import {
  CATEGORY_META,
  type Project,
} from "@/types";
import { cn } from "@/lib/utils";
import { getIcon, getTechIcon } from "@/lib/icons";
import { isDataUrl } from "@/lib/image-upload";

const CATEGORY_CARD_THEME: Record<
  string,
  { badge: string; glow: string; accentBar: string }
> = {
  web:    { badge: "bg-blue-500/15 text-blue-500 border-blue-500/30",    glow: "hover:shadow-blue-500/15",    accentBar: "bg-blue-500" },
  design: { badge: "bg-purple-500/15 text-purple-500 border-purple-500/30", glow: "hover:shadow-purple-500/15", accentBar: "bg-purple-500" },
  video:  { badge: "bg-pink-500/15 text-pink-500 border-pink-500/30",    glow: "hover:shadow-pink-500/15",    accentBar: "bg-pink-500" },
  voice:  { badge: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30", glow: "hover:shadow-emerald-500/15", accentBar: "bg-emerald-500" },
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  web: Globe, design: Palette, video: Video, voice: Mic,
};

interface ProjectCardProps {
  project: Project;
  className?: string;
  priority?: boolean;
}

export function ProjectCard({ project, className, priority }: ProjectCardProps) {
  const meta = CATEGORY_META[project.category];
  const theme = CATEGORY_CARD_THEME[project.category];
  const Icon = CATEGORY_ICONS[project.category] ?? Globe;

  const isMedia = project.category === "video" || project.category === "voice";
  const href = isMedia && project.media_url ? project.media_url : `/projects/${project.slug}`;
  const isExternal = href.startsWith("http");

  const commonProps = {
    className: cn(
      "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-2 hover:border-transparent hover:shadow-2xl",
      theme?.glow,
      className
    ),
  };

  const InnerContent = (
    <>
      {/* Thumbnail — image if available, otherwise category icon placeholder */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted/40">
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
            unoptimized={isDataUrl(project.thumbnail_url)}
          />
        ) : (
          // Category icon placeholder for video/voice without thumbnail
          <div className={cn(
            "absolute inset-0 flex items-center justify-center bg-gradient-to-br",
            project.category === "video" && "from-pink-500/15 via-card to-pink-500/5",
            project.category === "voice" && "from-emerald-500/15 via-card to-emerald-500/5",
            (project.category === "web" || project.category === "design") && "from-primary/10 via-card to-primary/5"
          )}>
            <Icon className="h-14 w-14 text-muted-foreground/40 transition-transform duration-500 group-hover:scale-110" />
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Category badge */}
        <div
          className={cn(
            "absolute left-3 top-3 flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-bold backdrop-blur-md shadow-sm",
            theme?.badge
          )}
        >
          <Icon className="h-3 w-3" />
          {meta.short}
        </div>

        {/* Arrow icon top-right */}
        <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-gray-900 opacity-0 shadow-md backdrop-blur-md transition-all duration-300 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0">
          <ArrowUpRight className="h-4 w-4" />
        </div>

        {/* Hover CTA */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="flex items-center gap-1.5 rounded-xl bg-white/90 px-4 py-2 text-xs font-bold text-gray-900 shadow-lg backdrop-blur-md">
            {isMedia && project.category === "video" ? (
              <><Video className="h-3.5 w-3.5" /> Tonton Video</>
            ) : isMedia && project.category === "voice" ? (
              <><Mic className="h-3.5 w-3.5" /> Putar Audio</>
            ) : (
              <><ExternalLink className="h-3.5 w-3.5" /> Lihat Detail</>
            )}
          </span>
        </div>
      </div>

      {/* Accent bottom bar */}
      <div className={cn("h-0.5 w-0 transition-all duration-300 group-hover:w-full", theme?.accentBar)} />

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
    </>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...commonProps}>
        {InnerContent}
      </a>
    );
  }

  return (
    <Link href={href} {...commonProps}>
      {InnerContent}
    </Link>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-[16/10] animate-pulse bg-muted/60" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded-lg bg-muted/60" />
        <div className="h-4 w-full animate-pulse rounded-lg bg-muted/60" />
        <div className="h-4 w-2/3 animate-pulse rounded-lg bg-muted/60" />
        <div className="flex gap-2 pt-2">
          <div className="h-4 w-12 animate-pulse rounded-md bg-muted/60" />
          <div className="h-4 w-10 animate-pulse rounded-md bg-muted/60" />
          <div className="h-4 w-14 animate-pulse rounded-md bg-muted/60" />
        </div>
      </div>
    </div>
  );
}
