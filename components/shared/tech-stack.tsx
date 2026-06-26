"use client";

import { cn } from "@/lib/utils";
import { getIcon, getTechIcon } from "@/lib/icons";
import type { TechItem } from "@/types";

interface TechStackProps {
  items: TechItem[];
  /** Visual style variant */
  variant?: "badge" | "pill" | "card" | "grid";
  /** Max items to show (rest shown as +N) */
  max?: number;
  /** Extra class */
  className?: string;
}

// ── Badge style (compact, for cards) ─────────────────────────────────────────
function TechBadge({ tech, className }: { tech: TechItem; className?: string }) {
  const iconName = tech.icon || getTechIcon(tech.name);
  const Icon = getIcon(iconName);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-muted/60 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-muted-foreground transition-colors",
        className
      )}
    >
      {Icon && <Icon className="h-3 w-3 shrink-0" />}
      {tech.name}
    </span>
  );
}

// ── Pill style (medium, for detail pages) ────────────────────────────────────
function TechPill({ tech, className }: { tech: TechItem; className?: string }) {
  const iconName = tech.icon || getTechIcon(tech.name);
  const Icon = getIcon(iconName);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-primary/5",
        className
      )}
    >
      {Icon ? (
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-muted/80">
          <Icon className="h-3 w-3" />
        </span>
      ) : (
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary text-[9px] font-bold">
          {tech.name.charAt(0)}
        </span>
      )}
      {tech.name}
    </span>
  );
}

// ── Card style (large, for sidebar) ─────────────────────────────────────────
function TechCard({ tech, className }: { tech: TechItem; className?: string }) {
  const iconName = tech.icon || getTechIcon(tech.name);
  const Icon = getIcon(iconName);

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl border border-border/50 bg-card/40 px-3 py-2 transition-all hover:border-primary/30 hover:bg-primary/5",
        className
      )}
    >
      {Icon ? (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/80">
          <Icon className="h-4 w-4" />
        </span>
      ) : (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
          {tech.name.charAt(0)}
        </span>
      )}
      <span className="text-sm font-medium text-foreground">{tech.name}</span>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export function TechStack({ items, variant = "pill", max, className }: TechStackProps) {
  if (items.length === 0) return null;

  const visible = max ? items.slice(0, max) : items;
  const remaining = max ? items.length - max : 0;
  const Component =
    variant === "badge" ? TechBadge :
    variant === "card" ? TechCard :
    variant === "grid" ? TechCard :
    TechPill;

  const isGrid = variant === "grid" || variant === "card";

  return (
    <div
      className={cn(
        isGrid ? "grid grid-cols-2 gap-2" : "flex flex-wrap items-center gap-1.5",
        className
      )}
    >
      {visible.map((tech) => (
        <Component key={tech.name} tech={tech} />
      ))}
      {remaining > 0 && !isGrid && (
        <span className="rounded-full border border-dashed border-border/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
          +{remaining}
        </span>
      )}
    </div>
  );
}
