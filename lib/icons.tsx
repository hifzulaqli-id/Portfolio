// Icon registry: maps Lucide icon names (stored as strings in the DB)
// to their component references. Used by navbar/footer, project tech stack, and admin UI.
//
// Add an entry here whenever you introduce a new icon option in the admin.
import type { LucideIcon } from "lucide-react";
import {
  Home,
  FolderKanban,
  Briefcase,
  BookOpen,
  Mail,
  User,
  Award,
  History,
  Wrench,
  GraduationCap,
  Phone,
  MessageCircle,
  Sparkles,
  Github,
  Linkedin,
  Instagram,
  Twitter,
  Youtube,
  Globe,
  ShieldCheck,
  Target,
  Lightbulb,
  Heart,
  Code2,
  Camera,
  Music,
  Dumbbell,
  Coffee,
  Plane,
  Palette,
  Download,
  Database,
  FileJson,
  Terminal,
  Cpu,
  Cloud,
  Server,
  Smartphone,
  Monitor,
  Layers,
  Box,
  Braces,
  Gem,
  Zap,
  AppWindow,
  LayoutGrid,
  GitBranch,
  Boxes,
  Binary,
  Workflow,
  type LucideProps,
} from "lucide-react";

export const ICON_REGISTRY: Record<string, LucideIcon> = {
  Home,
  FolderKanban,
  Briefcase,
  BookOpen,
  Mail,
  User,
  Award,
  History,
  Wrench,
  GraduationCap,
  Phone,
  MessageCircle,
  Sparkles,
  Github,
  Linkedin,
  Instagram,
  Twitter,
  Youtube,
  Globe,
  ShieldCheck,
  Target,
  Lightbulb,
  Heart,
  Code2,
  Camera,
  Music,
  Dumbbell,
  Coffee,
  Plane,
  Palette,
  Download,
  Database,
  FileJson,
  Terminal,
  Cpu,
  Cloud,
  Server,
  Smartphone,
  Monitor,
  Layers,
  Box,
  Braces,
  Gem,
  Zap,
  AppWindow,
  LayoutGrid,
  GitBranch,
  Boxes,
  Binary,
  Workflow,
};

/** Returns the icon component for a given name, or null if unknown/missing. */
export function getIcon(name?: string | null): LucideIcon | null {
  if (!name) return null;
  return ICON_REGISTRY[name] ?? null;
}

/** A thin wrapper that renders an icon by name, falling back gracefully. */
export function DynamicIcon({
  name,
  ...props
}: { name?: string | null } & Omit<LucideProps, "name">) {
  const Icon = getIcon(name);
  if (!Icon) return null;
  return <Icon {...props} />;
}

/** Sorted list of available icon names — used by the admin select field. */
export const ICON_OPTIONS = Object.keys(ICON_REGISTRY).sort();

// ── Auto-detect icon from tech name ───────────────────────────────────────────
const TECH_ICON_MAP: Record<string, string> = {
  // Languages
  javascript: "FileJson",
  typescript: "Braces",
  python: "Code2",
  java: "Gem",
  php: "Code2",
  rust: "Cpu",
  go: "Zap",
  c: "Terminal",
  "c++": "Terminal",
  "c#": "Gem",
  ruby: "Gem",
  swift: "Zap",
  kotlin: "Gem",
  dart: "Target",
  sql: "Database",
  html: "Code2",
  css: "Palette",
  sass: "Palette",
  scss: "Palette",

  // Frontend frameworks
  react: "AppWindow",
  nextjs: "Monitor",
  "next.js": "Monitor",
  vue: "Layers",
  "vue.js": "Layers",
  angular: "ShieldCheck",
  svelte: "Zap",
  nuxt: "Monitor",
  remix: "Workflow",
  tailwindcss: "Palette",
  "tailwind css": "Palette",
  tailwind: "Palette",
  bootstrap: "LayoutGrid",
  material: "Layers",
  shadcn: "Boxes",

  // Backend frameworks
  "node.js": "Server",
  nodejs: "Server",
  node: "Server",
  express: "Server",
  "express.js": "Server",
  nestjs: "Server",
  "nest.js": "Server",
  fastapi: "Zap",
  django: "ShieldCheck",
  flask: "Cpu",
  laravel: "Boxes",
  spring: "Layers",
  rails: "Gem",

  // Database
  postgresql: "Database",
  postgres: "Database",
  mysql: "Database",
  mongodb: "Database",
  redis: "Database",
  firebase: "Cloud",
  supabase: "Database",
  prisma: "Layers",
  sqlite: "Database",

  // Cloud / Infra
  aws: "Cloud",
  gcp: "Cloud",
  vercel: "Cloud",
  docker: "Boxes",
  kubernetes: "Server",
  linux: "Terminal",

  // Tools
  git: "GitBranch",
  github: "Github",
  vscode: "Code2",
  figma: "Palette",
  canva: "Palette",
  photoshop: "Camera",
  premiere: "Film",
  "adobe premiere": "Camera",
  aftereffects: "Sparkles",
  "after effects": "Sparkles",
  davinci: "Camera",

  // AI / ML
  tensorflow: "Brain",
  pytorch: "Cpu",
  keras: "Layers",
  opencv: "Camera",
  scikit: "Binary",
  pandas: "FileJson",
  numpy: "Binary",
  jupyter: "BookOpen",
  kaggle: "Database",

  // Mobile
  "react native": "Smartphone",
  flutter: "Smartphone",
  expo: "AppWindow",
  android: "Smartphone",
  ios: "Smartphone",

  // Other
  api: "Terminal",
  rest: "Workflow",
  graphql: "Workflow",
  websocket: "Zap",
  socket: "Zap",
  auth: "ShieldCheck",
  jwt: "ShieldCheck",
  oauth: "ShieldCheck",
  stripe: "CreditCard",
  razorpay: "CreditCard",
  testing: "Terminal",
  jest: "Terminal",
  cypress: "Monitor",
  playwright: "Monitor",
};

/** Auto-detect the best icon name for a given technology name. */
export function getTechIcon(techName: string): string {
  const key = techName.toLowerCase().trim();
  return TECH_ICON_MAP[key] ?? "Code2";
}
