import * as Icons from "lucide-react";
import { type LucideIcon } from "lucide-react";

/**
 * Curated list of Lucide icons for skills
 */
export const CURATED_SKILL_ICONS = [
  "Code2",
  "Palette",
  "Database",
  "Server",
  "Terminal",
  "Film",
  "Music",
  "Cpu",
  "GitBranch",
  "Figma",
  "PenTool",
  "Camera",
  "Mic",
  "Box",
  "Cloud",
  "Layout",
  "Zap",
  "Layers",
  "Package",
  "Wrench",
  "Globe",
  "Smartphone",
  "Monitor",
  "Paintbrush",
  "Video",
  "Headphones",
  "MessageSquare",
  "Users",
  "Target",
  "Lightbulb",
] as const;

export type CuratedIconName = (typeof CURATED_SKILL_ICONS)[number];

/**
 * Renders a Lucide icon by name with fallback
 */
export function LucideIcon({
  name,
  className,
  fallback = "Code2",
}: {
  name: string;
  className?: string;
  fallback?: string;
}) {
  const IconComponent = ((Icons as any)[name] || (Icons as any)[fallback]) as LucideIcon;
  return <IconComponent className={className} />;
}

/**
 * Get icon metadata for display in picker
 */
export function getIconMeta(name: CuratedIconName) {
  const labels: Record<CuratedIconName, string> = {
    Code2: "Code",
    Palette: "Palette",
    Database: "Database",
    Server: "Server",
    Terminal: "Terminal",
    Film: "Film",
    Music: "Music",
    Cpu: "CPU",
    GitBranch: "Git",
    Figma: "Figma",
    PenTool: "Pen",
    Camera: "Camera",
    Mic: "Microphone",
    Box: "Box",
    Cloud: "Cloud",
    Layout: "Layout",
    Zap: "Zap",
    Layers: "Layers",
    Package: "Package",
    Wrench: "Wrench",
    Globe: "Globe",
    Smartphone: "Mobile",
    Monitor: "Monitor",
    Paintbrush: "Paintbrush",
    Video: "Video",
    Headphones: "Headphones",
    MessageSquare: "Message",
    Users: "Users",
    Target: "Target",
    Lightbulb: "Lightbulb",
  };

  return {
    name,
    label: labels[name] || name,
  };
}
