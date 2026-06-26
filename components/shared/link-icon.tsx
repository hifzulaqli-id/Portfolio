import {
  ExternalLink,
  Github,
  Youtube,
  Figma,
  Dribbble,
  Globe,
  Link as LinkIcon2,
} from "lucide-react";
import type { LinkPlatform } from "@/types";
import { cn } from "@/lib/utils";

// ── SVG Brand Icons (for platforms without lucide icons) ──────────────────────

function KaggleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.281.18.046.149.034.238-.034.27l-6.555 6.344 6.836 8.507c.095.104.117.208.093.327z" />
    </svg>
  );
}

function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M7.5 11c1.38 0 2.5-1.12 2.5-2.5S8.88 6 7.5 6H3v5h4.5zM3 18h5c1.38 0 2.5-1.12 2.5-2.5S9.38 13 8 13H3v5zm12-9h6v1.5h-6V9zm3 11c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-1.5c1.93 0 3.5-1.57 3.5-3.5S19.93 11.5 18 11.5s-3.5 1.57-3.5 3.5 1.57 3.5 3.5 3.5z" />
    </svg>
  );
}

// ── Platform Metadata ────────────────────────────────────────────────────────

const LINK_META: Record<LinkPlatform, {
  icon: any;
  label: string;
  color: string;
  hoverBorder: string;
}> = {
  live: {
    icon: ExternalLink,
    label: "Live Demo",
    color: "text-emerald-400",
    hoverBorder: "hover:border-emerald-500/50 hover:bg-emerald-500/5",
  },
  github: {
    icon: Github,
    label: "GitHub",
    color: "text-foreground",
    hoverBorder: "hover:border-foreground/30 hover:bg-foreground/5",
  },
  youtube: {
    icon: Youtube,
    label: "YouTube",
    color: "text-red-500",
    hoverBorder: "hover:border-red-500/50 hover:bg-red-500/5",
  },
  kaggle: {
    icon: KaggleIcon,
    label: "Kaggle",
    color: "text-sky-400",
    hoverBorder: "hover:border-sky-400/50 hover:bg-sky-400/5",
  },
  figma: {
    icon: Figma,
    label: "Figma",
    color: "text-purple-500",
    hoverBorder: "hover:border-purple-500/50 hover:bg-purple-500/5",
  },
  behance: {
    icon: BehanceIcon,
    label: "Behance",
    color: "text-blue-500",
    hoverBorder: "hover:border-blue-500/50 hover:bg-blue-500/5",
  },
  dribbble: {
    icon: Dribbble,
    label: "Dribbble",
    color: "text-pink-500",
    hoverBorder: "hover:border-pink-500/50 hover:bg-pink-500/5",
  },
  website: {
    icon: Globe,
    label: "Website",
    color: "text-primary",
    hoverBorder: "hover:border-primary/50 hover:bg-primary/5",
  },
  other: {
    icon: LinkIcon2,
    label: "Link",
    color: "text-muted-foreground",
    hoverBorder: "hover:border-border hover:bg-muted/50",
  },
};

export function ProjectLinkIcon({
  platform,
  url,
  className,
  showLabel = true,
  size = "default",
}: {
  platform: LinkPlatform;
  url: string;
  className?: string;
  showLabel?: boolean;
  size?: "default" | "sm" | "lg";
}) {
  const meta = LINK_META[platform];
  const Icon = meta.icon;

  const sizeClasses = {
    sm: "gap-1.5 rounded-lg px-2.5 py-1.5 text-xs",
    default: "gap-2 rounded-xl px-4 py-2.5 text-sm",
    lg: "gap-2.5 rounded-xl px-5 py-3 text-base",
  };

  const iconSize = {
    sm: "h-3.5 w-3.5",
    default: "h-4.5 w-4.5",
    lg: "h-5 w-5",
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center border border-border bg-background/60 font-medium backdrop-blur-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        meta.hoverBorder,
        sizeClasses[size],
        meta.color,
        className
      )}
    >
      <Icon className={cn(iconSize[size], "shrink-0")} />
      {showLabel && <span>{meta.label}</span>}
    </a>
  );
}

/**
 * Get platform metadata
 */
export function getPlatformMeta(platform: LinkPlatform) {
  return LINK_META[platform];
}
