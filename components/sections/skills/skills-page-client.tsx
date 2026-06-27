"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Monitor, Server, Palette, Clapperboard, Music, Wrench, Brain } from "lucide-react";
import type { Skill, SkillCategory } from "@/types";
import { SKILL_CATEGORY_META } from "@/types";
import { cn } from "@/lib/utils";

const SKILL_ICONS_MAP: Record<string, React.ElementType> = {
  "all": LayoutGrid,
  "frontend": Monitor,
  "backend": Server,
  "design": Palette,
  "video": Clapperboard,
  "audio": Music,
  "tools": Wrench,
  "soft": Brain,
};

// ── Category color themes ─────────────────────────────────────────────────────
const CAT_THEME: Record<string, {
  gradient: string;
  border: string;
  header: string;
  badge: string;
  barColor: string;
  glow: string;
}> = {
  frontend:  { gradient: "from-blue-500/10 to-cyan-500/5",     border: "border-blue-500/20",    header: "bg-blue-500/15 text-blue-400",     badge: "bg-blue-500/20 text-blue-400",     barColor: "bg-blue-500",    glow: "hover:shadow-blue-500/10" },
  backend:   { gradient: "from-green-500/10 to-emerald-500/5", border: "border-green-500/20",   header: "bg-green-500/15 text-green-400",   badge: "bg-green-500/20 text-green-400",   barColor: "bg-green-500",   glow: "hover:shadow-green-500/10" },
  design:    { gradient: "from-purple-500/10 to-pink-500/5",   border: "border-purple-500/20",  header: "bg-purple-500/15 text-purple-400", badge: "bg-purple-500/20 text-purple-400", barColor: "bg-purple-500",  glow: "hover:shadow-purple-500/10" },
  video:     { gradient: "from-pink-500/10 to-rose-500/5",     border: "border-pink-500/20",    header: "bg-pink-500/15 text-pink-400",     badge: "bg-pink-500/20 text-pink-400",     barColor: "bg-pink-500",    glow: "hover:shadow-pink-500/10" },
  audio:     { gradient: "from-emerald-500/10 to-teal-500/5",  border: "border-emerald-500/20", header: "bg-emerald-500/15 text-emerald-400", badge: "bg-emerald-500/20 text-emerald-400", barColor: "bg-emerald-500", glow: "hover:shadow-emerald-500/10" },
  tools:     { gradient: "from-orange-500/10 to-amber-500/5",  border: "border-orange-500/20",  header: "bg-orange-500/15 text-orange-400", badge: "bg-orange-500/20 text-orange-400", barColor: "bg-orange-500",  glow: "hover:shadow-orange-500/10" },
  soft:      { gradient: "from-teal-500/10 to-cyan-500/5",     border: "border-teal-500/20",    header: "bg-teal-500/15 text-teal-400",     badge: "bg-teal-500/20 text-teal-400",     barColor: "bg-teal-500",    glow: "hover:shadow-teal-500/10" },
  other:     { gradient: "from-orange-500/10 to-amber-500/5",  border: "border-orange-500/20",  header: "bg-orange-500/15 text-orange-400", badge: "bg-orange-500/20 text-orange-400", barColor: "bg-orange-500",  glow: "hover:shadow-orange-500/10" },
};

// ── SVG icons per skill ───────────────────────────────────────────────────────
const SKILL_ICONS: Record<string, { svg: React.ReactNode; color: string }> = {
  HTML:             { color:"#E34F26", svg:<svg viewBox="0 0 24 24" fill="#E34F26" className="h-6 w-6"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.239.003.23-2.622L5.48 4.41l.698 8.01h9.126l-.326 3.426-2.974.808-2.974-.808-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg> },
  CSS:              { color:"#1572B6", svg:<svg viewBox="0 0 24 24" fill="#1572B6" className="h-6 w-6"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/></svg> },
  JavaScript:       { color:"#F7DF1E", svg:<svg viewBox="0 0 24 24" className="h-6 w-6"><rect width="24" height="24" rx="2" fill="#F7DF1E"/><path d="M6.235 5.772v12.101c0 .74-.364 1.237-1.047 1.237-.584 0-.972-.274-1.345-.798l-1.297 1.205c.674.92 1.61 1.394 2.875 1.394 1.87 0 3.063-1.068 3.063-3.056V5.772H6.235zm7.083 8.551c.538.956 1.296 1.667 2.651 1.667 1.214 0 2.024-.607 2.024-1.463 0-.986-.792-1.343-2.064-1.908l-.698-.298c-2.049-.873-3.41-1.97-3.41-4.284 0-2.135 1.627-3.762 4.167-3.762 1.81 0 3.108.628 4.043 2.273l-2.217 1.423c-.488-.873-.995-1.215-1.826-1.215-.832 0-1.354.527-1.354 1.215 0 .852.527 1.196 1.742 1.727l.698.299c2.417 1.035 3.777 2.088 3.777 4.46 0 2.556-2.007 3.969-4.705 3.969-2.64 0-4.342-1.25-5.17-2.895l2.35-1.208z" fill="#000"/></svg> },
  TypeScript:       { color:"#3178C6", svg:<svg viewBox="0 0 24 24" className="h-6 w-6"><rect width="24" height="24" rx="2" fill="#3178C6"/><path d="M13.6 15.4v1.74c.28.14.62.25 1 .32.38.07.79.11 1.22.11.42 0 .82-.04 1.2-.13.38-.09.71-.23.99-.43.28-.2.5-.46.67-.78.17-.32.25-.71.25-1.17 0-.33-.05-.63-.14-.88-.09-.26-.23-.49-.42-.69-.18-.2-.41-.39-.68-.55-.27-.16-.58-.32-.94-.46-.26-.1-.48-.2-.67-.29-.19-.09-.35-.18-.47-.28-.12-.1-.22-.2-.28-.31-.06-.11-.09-.24-.09-.38 0-.13.03-.24.09-.34.06-.1.14-.18.25-.25.11-.07.23-.12.38-.15.15-.03.31-.05.49-.05.13 0 .26.01.41.03.15.02.29.06.43.11.14.05.27.12.39.2.12.08.22.18.3.3V12.4c-.24-.09-.52-.16-.82-.21-.3-.05-.63-.08-.99-.08-.41 0-.8.05-1.18.14-.37.09-.7.24-.98.43-.28.2-.51.45-.67.76-.17.31-.25.68-.25 1.11 0 .54.15.99.44 1.35.29.36.75.67 1.36.91.27.1.51.2.72.3.21.1.38.2.53.31.14.11.26.22.33.35.08.12.12.27.12.43 0 .14-.03.26-.08.37-.05.11-.13.2-.23.28-.1.08-.23.13-.38.17-.15.04-.33.06-.53.06-.34 0-.68-.06-1.01-.18-.33-.12-.63-.31-.9-.56zm-2.73-3.87H13v-1.3H8.2v1.3h1.7v6.27h1.97V11.53z" fill="#fff"/></svg> },
  React:            { color:"#61DAFB", svg:<svg viewBox="0 0 24 24" fill="#61DAFB" className="h-6 w-6"><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278z"/></svg> },
  "Next.js":        { color:"#fff",    svg:<svg viewBox="0 0 24 24" className="h-6 w-6"><circle cx="12" cy="12" r="12" fill="#000"/><path d="M9.75 7.5v6.37L16.5 7.5h1.5v9h-1.5v-6.37L9.75 16.5 6 10.5v-3h3.75z" fill="#fff"/></svg> },
  "Tailwind CSS":   { color:"#06B6D4", svg:<svg viewBox="0 0 24 24" fill="#06B6D4" className="h-6 w-6"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg> },
  "Node.js":        { color:"#339933", svg:<svg viewBox="0 0 24 24" className="h-6 w-6"><path d="M12 1.85l-9.5 5.5v11l9.5 5.5 9.5-5.5v-11L12 1.85zm0 2.3l7.5 4.35v8.6L12 21.45l-7.5-4.35V8.5L12 4.15z" fill="#339933"/><path d="M12 6.5L7 9.4v5.8l5 2.9 5-2.9V9.4L12 6.5z" fill="#fff"/></svg> },
  Figma:            { color:"#F24E1E", svg:<svg viewBox="0 0 24 24" className="h-6 w-6"><path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z" fill="#0ACF83"/><path d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4z" fill="#A259FF"/><path d="M4 4c0-2.208 1.792-4 4-4h4v8H8C5.792 8 4 6.208 4 4z" fill="#F24E1E"/><path d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0z" fill="#FF7262"/><path d="M20 12c0 2.208-1.792 4-4 4s-4-1.792-4-4 1.792-4 4-4 4 1.792 4 4z" fill="#1ABCFE"/></svg> },
  Photoshop:        { color:"#31A8FF", svg:<svg viewBox="0 0 24 24" className="h-6 w-6"><rect width="24" height="24" rx="4" fill="#001E36"/><path d="M6.5 7.5h3.25c.875 0 1.563.25 2.063.75S12.5 9.5 12.5 10.25c0 .813-.25 1.438-.75 1.938-.5.5-1.188.75-2.063.75H8.125V16.5H6.5V7.5zm1.625 4H9.5c.5 0 .875-.125 1.125-.375.25-.25.375-.563.375-.938 0-.375-.125-.688-.375-.938-.25-.25-.625-.375-1.125-.375H8.125V11.5z" fill="#31A8FF"/></svg> },
  Illustrator:      { color:"#FF9A00", svg:<svg viewBox="0 0 24 24" className="h-6 w-6"><rect width="24" height="24" rx="4" fill="#330000"/><path d="M12 5.5l4.5 13H15l-1.125-3.375H10.125L9 18.5H7.5L12 5.5zm0 3.25L10.5 13h3L12 8.75z" fill="#FF9A00"/></svg> },
  "Adobe Premiere Pro": { color:"#9999FF", svg:<svg viewBox="0 0 24 24" className="h-6 w-6"><rect width="24" height="24" rx="4" fill="#00005B"/><path d="M6 16.5V7.5h3.375c1.875 0 3 .938 3 2.625 0 1.688-1.125 2.813-3 2.813H7.688V16.5H6zm1.688-4.875H9.25c.938 0 1.5-.563 1.5-1.5s-.563-1.5-1.5-1.5H7.688v3z" fill="#9999FF"/></svg> },
  "Premiere Pro":   { color:"#9999FF", svg:<svg viewBox="0 0 24 24" className="h-6 w-6"><rect width="24" height="24" rx="4" fill="#00005B"/><path d="M6 16.5V7.5h3.375c1.875 0 3 .938 3 2.625 0 1.688-1.125 2.813-3 2.813H7.688V16.5H6zm1.688-4.875H9.25c.938 0 1.5-.563 1.5-1.5s-.563-1.5-1.5-1.5H7.688v3z" fill="#9999FF"/></svg> },
  "After Effects":  { color:"#9999FF", svg:<svg viewBox="0 0 24 24" className="h-6 w-6"><rect width="24" height="24" rx="4" fill="#00005B"/><path d="M12 5.25L17.25 18.75H15.375L14.063 15.375H9.938L8.625 18.75H6.75L12 5.25zm0 3.563l-1.688 4.688h3.375L12 8.813z" fill="#9999FF"/></svg> },
  CapCut:           { color:"#fff",    svg:<svg viewBox="0 0 24 24" className="h-6 w-6"><rect width="24" height="24" rx="6" fill="#000"/><path d="M7 8.5L12 5l5 3.5v7L12 19l-5-3.5V8.5z" fill="none" stroke="#fff" strokeWidth="1.5"/><circle cx="12" cy="12" r="2.5" fill="#fff"/></svg> },
  Kinemaster:       { color:"#FF4060", svg:<svg viewBox="0 0 24 24" className="h-6 w-6"><rect width="24" height="24" rx="6" fill="#FF4060"/><path d="M8 7l9 5-9 5V7z" fill="#fff"/></svg> },
  Audacity:         { color:"#0000CC", svg:<svg viewBox="0 0 24 24" className="h-6 w-6"><rect width="24" height="24" rx="4" fill="#0000CC"/><path d="M12 4c-1.1 0-2 .9-2 2v3.5c-1.2.5-2 1.7-2 3s.8 2.5 2 3V18c0 1.1.9 2 2 2s2-.9 2-2v-2.5c1.2-.5 2-1.7 2-3s-.8-2.5-2-3V6c0-1.1-.9-2-2-2z" fill="#fff"/></svg> },
  Git:              { color:"#F05032", svg:<svg viewBox="0 0 24 24" fill="#F05032" className="h-6 w-6"><path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.606-.403-.545-.545-.676-1.342-.396-2.009L7.636 3.67.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"/></svg> },
  "VS Code":        { color:"#007ACC", svg:<svg viewBox="0 0 24 24" className="h-6 w-6"><path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" fill="#007ACC"/></svg> },
  Canva:            { color:"#00C4CC", svg:<svg viewBox="0 0 24 24" className="h-6 w-6"><circle cx="12" cy="12" r="12" fill="#00C4CC"/><path d="M12 6c-1.8 0-3.4.8-4.5 2.1-.3.4-.3 1 .1 1.3.4.3 1 .3 1.3-.1C9.6 8.5 10.7 8 12 8c2.8 0 5 2.2 5 5s-2.2 5-5 5c-1.3 0-2.4-.5-3.2-1.3-.3-.4-.9-.4-1.3-.1-.4.3-.4.9-.1 1.3C8.6 19.2 10.2 20 12 20c3.9 0 7-3.1 7-7s-3.1-7-7-7z" fill="#fff"/><circle cx="12" cy="12" r="2" fill="#fff"/></svg> },
  WordPress:        { color:"#21759B", svg:<svg viewBox="0 0 24 24" fill="#21759B" className="h-6 w-6"><path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.109m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.93c.648-.03 1.234-.105 1.234-.105.585-.075.516-.93-.065-.899 0 0-1.755.135-2.88.135-.2 0-.438-.006-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61zM12 22.784c-1.059 0-2.08-.152-3.048-.437l3.237-9.406 3.315 9.087c.028.07.061.137.093.204C14.333 22.6 13.19 22.784 12 22.784zm-9.75-9.559c0-1.559.34-3.039.949-4.37l5.23 14.33A10.755 10.755 0 0 1 2.25 13.225zM12 0C5.385 0 0 5.385 0 12c0 6.616 5.385 12.001 12 12.001 6.616 0 12.001-5.385 12.001-12C24.001 5.385 18.616 0 12 0z"/></svg> },
  "Git & GitHub":   { color:"#F05032", svg:<svg viewBox="0 0 24 24" fill="#F05032" className="h-6 w-6"><path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.606-.403-.545-.545-.676-1.342-.396-2.009L7.636 3.67.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"/></svg> },
};

function FallbackIcon({ label }: { label: string }) {
  const colors = ["#6C63FF","#E91E63","#00BCD4","#FF5722","#4CAF50","#FF9800","#9C27B0"];
  const color = colors[label.charCodeAt(0) % colors.length];
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-md text-[9px] font-black text-white" style={{ background: color }}>
      {label.slice(0, 2).toUpperCase()}
    </div>
  );
}

const PCT_LABEL = (pct: number) => {
  if (pct >= 90) return "Expert";
  if (pct >= 70) return "Mahir";
  if (pct >= 50) return "Menengah";
  if (pct >= 30) return "Dasar";
  return "Pemula";
};

// ── Skill Card ────────────────────────────────────────────────────────────────
function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const icon = SKILL_ICONS[skill.name];
  const theme = CAT_THEME[skill.category] ?? CAT_THEME.other;
  const hasCustomIcon = !!skill.icon_url;
  const isDataUrl = hasCustomIcon && skill.icon_url!.startsWith("data:");
  const pct = skill.percentage ?? 60;
  const label = PCT_LABEL(pct);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.04 }}
      className={cn(
        "group relative flex items-center gap-3.5 rounded-2xl border bg-card/60 p-3.5 backdrop-blur-sm",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-default",
        theme.border, theme.glow,
      )}
    >
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-110", theme.header)}>
        {hasCustomIcon ? (
          <Image src={skill.icon_url!} alt={skill.name} width={24} height={24} className="object-contain" unoptimized={isDataUrl} />
        ) : icon ? (
          <span className="[&>svg]:!h-6 [&>svg]:!w-6">{icon.svg}</span>
        ) : (
          <FallbackIcon label={skill.name} />
        )}
      </div>
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-foreground">{skill.name}</span>
          <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold", theme.badge)}>{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/50">
            <motion.div
              className={cn("h-full rounded-full", theme.barColor)}
              initial={{ width: "0%" }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.03, ease: "easeOut" }}
            />
          </div>
          <span className="text-[11px] font-bold text-muted-foreground tabular-nums w-7 text-right">{pct}%</span>
        </div>
      </div>
    </motion.div>
  );
}

const CAT_ACTIVE: Record<string, string> = {
  "all":      "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
  "frontend": "bg-blue-500 text-white shadow-lg shadow-blue-500/25",
  "backend":  "bg-green-500 text-white shadow-lg shadow-green-500/25",
  "design":   "bg-purple-500 text-white shadow-lg shadow-purple-500/25",
  "video":    "bg-pink-500 text-white shadow-lg shadow-pink-500/25",
  "audio":    "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25",
  "tools":    "bg-orange-500 text-white shadow-lg shadow-orange-500/25",
  "soft":     "bg-teal-500 text-white shadow-lg shadow-teal-500/25",
};

// ── Main Skills Page Component ────────────────────────────────────────────────
export function SkillsPageClient({ skills }: { skills: Skill[] }) {
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const filterRef = React.useRef<HTMLDivElement>(null);

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    setTimeout(() => {
      if (filterRef.current) {
        const top = filterRef.current.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 100);
  };

  const categories = React.useMemo(() => {
    const set = new Set(skills.map((s) => s.category));
    return ["all", ...Array.from(set)] as string[];
  }, [skills]);

  const filtered = activeCategory === "all" ? skills : skills.filter((s) => s.category === activeCategory);

  const grouped = React.useMemo(() => {
    if (activeCategory !== "all") return [{ cat: activeCategory, items: filtered }];
    const map = new Map<string, Skill[]>();
    skills.forEach((s) => { if (!map.has(s.category)) map.set(s.category, []); map.get(s.category)!.push(s); });
    return Array.from(map.entries()).map(([cat, items]) => ({ cat, items }));
  }, [skills, activeCategory, filtered]);

  return (
    <div>
      {/* ── Category filter tabs ── */}
      <div ref={filterRef} className="sticky top-16 z-30 mb-10 border-b border-border/50 bg-background/90 py-4 backdrop-blur-xl -mx-4 px-4 sm:-mx-0 sm:px-0">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const meta = cat === "all" ? null : SKILL_CATEGORY_META[cat as SkillCategory];
            const active = activeCategory === cat;
            const Icon = SKILL_ICONS_MAP[cat] || LayoutGrid;
            return (
              <motion.button
                key={cat}
                onClick={() => handleCategory(cat)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
                  active ? (CAT_ACTIVE[cat] ?? "bg-primary text-white") : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {cat === "all" ? "Semua" : meta?.label ?? cat}
                <span className={cn("ml-0.5 rounded-full px-1.5 py-px text-[10px] font-bold tabular-nums", active ? "bg-white/20" : "bg-muted text-muted-foreground")}>
                  {cat === "all" ? skills.length : skills.filter(s => s.category === cat).length}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Grouped skill cards ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="space-y-10"
        >
          {grouped.map(({ cat, items }) => {
            const meta = SKILL_CATEGORY_META[cat as SkillCategory];
            const theme = CAT_THEME[cat] ?? CAT_THEME.other;
            return (
              <div key={cat}>
                {/* Category header */}
                <div className={cn("mb-5 flex items-center gap-3 rounded-2xl border bg-gradient-to-r p-4", theme.gradient, theme.border)}>
                  <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl", theme.header)}>
                    {meta?.emoji ?? "🔧"}
                  </span>
                  <div>
                    <div className="font-bold text-foreground">{meta?.label ?? cat}</div>
                    <div className="text-xs text-muted-foreground">{items.length} skill</div>
                  </div>
                  <div className={cn("ml-auto rounded-full px-3 py-1 text-xs font-bold", theme.badge)}>
                    {items.length} Tools
                  </div>
                </div>
                {/* Skill grid */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((skill, i) => (
                    <SkillCard key={skill.id} skill={skill} index={i} />
                  ))}
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
