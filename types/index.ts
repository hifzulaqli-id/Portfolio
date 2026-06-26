// Shared domain types — mirror the Supabase schema 1:1 for a clean swap later.

export type ProjectCategory = "web" | "design" | "video" | "voice";
export type DesignType = "instagram_feed" | "poster";
export type ProjectStatus = "draft" | "published";

export type LinkPlatform =
  | "live"
  | "github"
  | "youtube"
  | "kaggle"
  | "figma"
  | "behance"
  | "dribbble"
  | "website"
  | "other";

export interface ProjectLink {
  platform: LinkPlatform;
  url: string;
}

export interface GalleryItem {
  url: string;
  caption: string;
}

export interface TechItem {
  name: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  design_type?: DesignType | null;
  description: string;
  /** Long-form content with simple markdown-ish line breaks. */
  content?: string;
  tech_stack: TechItem[];
  thumbnail_url: string;
  gallery: GalleryItem[];
  /** @deprecated Use links array instead */
  live_url?: string | null;
  /** @deprecated Use links array instead */
  github_url?: string | null;
  /** Flexible project links (live, github, youtube, kaggle, etc) */
  links?: ProjectLink[];
  status: ProjectStatus;
  display_order: number;
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  service?: ProjectCategory | null;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_role?: string | null;
  avatar_url?: string | null;
  content: string;
  rating: number; // 1-5
  is_visible: boolean;
  created_at: string;
}

export interface Profile {
  id: number;
  full_name: string;
  tagline: string;
  bio: string;
  photo_url: string;
  cv_url?: string | null;
  instagram_url?: string | null;
  whatsapp_number?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  email?: string | null;
  projects_count: number;
  clients_count: number;
  years_experience: number;
  skills: string[];
}

export interface StoreData {
  profile: Profile;
  projects: Project[];
  messages: Message[];
  testimonials: Testimonial[];
  skills: Skill[];
  certifications: Certification[];
  experiences: Experience[];
  education: Education[];
  blog_posts: BlogPost[];
  settings: SiteSettings;
  nav_items: NavItem[];
  services: Service[];
  content_blocks: ContentBlock[];
}

// ─────────────────────────── Navigation Items ──────────────────
export type NavLocation =
  | "navbar"
  | "navbar-dropdown"
  | "footer-col-1"
  | "footer-col-2";

export interface NavItem {
  id: string;
  location: NavLocation;
  label: string;
  href: string;
  /** Lucide icon name (e.g. "Home", "FolderKanban") OR null */
  icon?: string | null;
  /** Short description shown under dropdown items */
  description?: string | null;
  display_order: number;
  is_active: boolean;
  open_in_new_tab: boolean;
  created_at: string;
}

export const NAV_LOCATION_META: Record<
  NavLocation,
  { label: string; hint: string }
> = {
  navbar: { label: "Navbar Utama", hint: "Bar menu atas (desktop & mobile)" },
  "navbar-dropdown": {
    label: "Dropdown Profil",
    hint: "Item di dalam dropdown 'Profil' navbar",
  },
  "footer-col-1": {
    label: "Footer — Jelajahi",
    hint: "Kolum pertama footer",
  },
  "footer-col-2": {
    label: "Footer — Tentang",
    hint: "Kolum kedua footer",
  },
};

// ─────────────────────────── Skills ────────────────────────────
export type SkillCategory =
  | "web-frontend"
  | "web-backend"
  | "design"
  | "video"
  | "audio"
  | "tools"
  | "soft-skill";
export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  percentage: number; // 0-100
  /** Lucide icon name (e.g., "Code2", "Palette") OR custom icon URL */
  icon?: string | null;
  /** @deprecated Use icon field */
  icon_url?: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export const SKILL_CATEGORY_META: Record<SkillCategory, { label: string; emoji: string }> = {
  "web-frontend": { label: "Web Frontend", emoji: "🎨" },
  "web-backend": { label: "Web Backend", emoji: "⚙️" },
  design: { label: "Design", emoji: "🖌️" },
  video: { label: "Video Editing", emoji: "🎬" },
  audio: { label: "Audio", emoji: "🎵" },
  tools: { label: "Tools & Software", emoji: "🛠️" },
  "soft-skill": { label: "Soft Skills", emoji: "🧠" },
};

export const SKILL_LEVEL_META: Record<
  SkillLevel,
  { label: string; color: string }
> = {
  beginner: { label: "Beginner", color: "text-sky-400" },
  intermediate: { label: "Intermediate", color: "text-emerald-400" },
  advanced: { label: "Advanced", color: "text-amber-400" },
  expert: { label: "Expert", color: "text-fuchsia-400" },
};

// ─────────────────────────── Certifications ────────────────────
export type CertCategory =
  | "web"
  | "design"
  | "video"
  | "audio"
  | "academic"
  | "competition"
  | "organization";
export type CertStatus = "verified" | "in-progress" | "expired";

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuer_logo_url?: string | null;
  category: CertCategory;
  issue_date?: string | null; // ISO date
  expiry_date?: string | null;
  credential_id?: string | null;
  credential_url?: string | null;
  certificate_image_url?: string | null;
  badge_status: CertStatus;
  is_public: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export const CERT_CATEGORY_META: Record<CertCategory, { label: string; emoji: string }> = {
  web: { label: "Web", emoji: "🌐" },
  design: { label: "Design", emoji: "🎨" },
  video: { label: "Video", emoji: "🎬" },
  audio: { label: "Audio", emoji: "🎙️" },
  academic: { label: "Akademik", emoji: "🎓" },
  competition: { label: "Kompetisi", emoji: "🏆" },
  organization: { label: "Organisasi", emoji: "🤝" },
};

export const CERT_STATUS_META: Record<
  CertStatus,
  { label: string; variant: "success" | "warning" | "muted" }
> = {
  verified: { label: "Verified", variant: "success" },
  "in-progress": { label: "In Progress", variant: "warning" },
  expired: { label: "Expired", variant: "muted" },
};

// ─────────────────────────── Experience ────────────────────────
export type ExperienceType =
  | "job"
  | "freelance"
  | "organization"
  | "committee"
  | "volunteer";
export type EmploymentType =
  | "full-time"
  | "part-time"
  | "internship"
  | "remote"
  | "contract";

export interface Experience {
  id: string;
  type: ExperienceType;
  position: string;
  company: string;
  logo_url?: string | null;
  location?: string | null;
  employment_type?: EmploymentType | null;
  start_date: string; // ISO date
  end_date?: string | null;
  is_current: boolean;
  description?: string | null;
  tech_stack: string[];
  achievements?: string | null;
  company_url?: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export const EXPERIENCE_TYPE_META: Record<
  ExperienceType,
  { label: string; emoji: string }
> = {
  job: { label: "Pekerjaan/Magang", emoji: "💼" },
  freelance: { label: "Freelance", emoji: "🚀" },
  organization: { label: "Organisasi", emoji: "🤝" },
  committee: { label: "Kepanitiaan", emoji: "📋" },
  volunteer: { label: "Volunteer", emoji: "❤️" },
};

export const EMPLOYMENT_TYPE_META: Record<EmploymentType, { label: string }> = {
  "full-time": { label: "Full-time" },
  "part-time": { label: "Part-time" },
  internship: { label: "Magang" },
  remote: { label: "Remote" },
  contract: { label: "Kontrak" },
};

// ─────────────────────────── Education ─────────────────────────
export type EducationType = "formal" | "course" | "bootcamp" | "workshop";

export interface Education {
  id: string;
  type: EducationType;
  institution: string;
  field_of_study: string;
  logo_url?: string | null;
  degree_level?: string | null;
  start_year?: number | null;
  end_year?: number | null;
  is_current: boolean;
  gpa?: number | null;
  description?: string | null;
  relevant_subjects: string[];
  achievements?: string | null;
  institution_url?: string | null;
  display_order: number;
  created_at: string;
}

export const EDUCATION_TYPE_META: Record<
  EducationType,
  { label: string; emoji: string }
> = {
  formal: { label: "Formal", emoji: "🎓" },
  course: { label: "Kursus Online", emoji: "💻" },
  bootcamp: { label: "Bootcamp", emoji: "🔥" },
  workshop: { label: "Workshop & Seminar", emoji: "🎤" },
};

// ─────────────────────────── Blog ──────────────────────────────
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category?: string | null;
  thumbnail_url?: string | null;
  excerpt?: string | null;
  content?: string | null; // markdown
  tags: string[];
  reading_time: number; // minutes
  status: "draft" | "published";
  is_featured: boolean;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────── Site Settings ─────────────────────
export interface SiteSettings {
  id: number;
  site_title: string;
  site_description: string;
  og_image_url?: string | null;
  seo_keywords: string[];
  google_analytics_id?: string | null;
  maintenance_mode: boolean;
  maintenance_message?: string | null;
  accent_color: string; // hex, default #6C63FF
  updated_at: string;
}

// ---- UI helper maps ----
export const CATEGORY_META: Record<
  ProjectCategory,
  { label: string; short: string; emoji: string }
> = {
  web: { label: "Web Development", short: "Web Dev", emoji: "🌐" },
  design: { label: "Design Ads Instagram", short: "Design", emoji: "🎨" },
  video: { label: "Editing Video", short: "Video", emoji: "🎬" },
  voice: { label: "Voice Over", short: "Voice", emoji: "🎙️" },
};

// ─────────────────────────── Services ──────────────────────────
// Editable service content. Categories (web/design/video/voice) are locked —
// admin edits CONTENT only (title, description, packages, faq, etc.).

export interface ServicePackage {
  name: string;
  tagline?: string;
  perks: string[];
  featured?: boolean;
}

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface Service {
  id: string;
  category: ProjectCategory; // locked: web | design | video | voice
  icon: string; // Lucide icon name, e.g. "Code2"
  title: string;
  description: string;
  features: string[];
  longDescription: string;
  includes: string[];
  tools: string[];
  packages: ServicePackage[];
  faq: ServiceFaq[];
  display_order: number;
  is_active: boolean;
  created_at: string;
}

// ─────────────────────────── Content Blocks ────────────────────
// Generic key→value store for editable text/arrays on sections
// (hero roles, process steps, contact-cta trust items, etc.).

export type ContentBlockType = "text" | "array" | "json";

export interface ContentBlock {
  id: string;
  /** Unique key, namespaced by section. e.g. "hero.roles", "process.steps" */
  key: string;
  /** Human label shown in admin, e.g. "Hero — Daftar Role" */
  label: string;
  /** Section grouping for admin UI, e.g. "hero", "process", "contact-cta" */
  section: string;
  type: ContentBlockType;
  /** Stored value: string for text, string[] for array, array-of-objects for json */
  value: string | string[] | Record<string, unknown>[];
  updated_at: string;
}

export const CATEGORY_BADGE_VARIANT: Record<
  ProjectCategory,
  "web" | "design" | "video" | "voice"
> = {
  web: "web",
  design: "design",
  video: "video",
  voice: "voice",
};

export const SERVICES: {
  category: ProjectCategory;
  icon: string;
  title: string;
  description: string;
  features: string[];
  longDescription: string;
  includes: string[];
  tools: string[];
  packages: { name: string; tagline: string; perks: string[]; featured?: boolean }[];
  faq: { q: string; a: string }[];
}[] = [
  {
    category: "web",
    icon: "Code2",
    title: "Web Developer",
    description:
      "Website dan aplikasi web modern, cepat, dan responsif menggunakan Next.js, React, dan Tailwind CSS.",
    features: ["Landing page", "Company profile", "Web app", "Optimasi SEO"],
    longDescription:
      "Saya membangun website yang tidak hanya cantik, tapi juga cepat, aman, dan mudah ditemukan di Google. Menggunakan teknologi modern seperti Next.js dan Tailwind CSS, setiap situs dioptimalkan untuk performa maksimal dan pengalaman pengguna terbaik di semua perangkat.",
    includes: [
      "Desain UI/UX responsif (mobile-first)",
      "Optimasi kecepatan & Core Web Vitals",
      "Setup SEO dasar (meta, sitemap, robots)",
      "Integrasi WhatsApp / form kontak",
      "Domain & hosting guidance",
      "Revisi hingga 3x",
    ],
    tools: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Supabase", "Vercel"],
    packages: [
      { name: "Basic", tagline: "Landing page 1 halaman", perks: ["1 halaman", "Mobile responsive", "Form kontak", "Revisi 2x"] },
      { name: "Standard", tagline: "Company profile lengkap", perks: ["Sampai 5 halaman", "SEO dasar", "Integrasi WA", "Revisi 3x"], featured: true },
      { name: "Premium", tagline: "Web app custom", perks: ["Halaman tak terbatas", "Database & auth", "Dashboard admin", "Revisi 5x", "Garansi 30 hari"] },
    ],
    faq: [
      { q: "Berapa lama pengerjaan website?", a: "Landing page 3-5 hari, company profile 1-2 minggu, web app tergantung kompleksitas (estimasi di awal)." },
      { q: "Apakah saya dapat file source code-nya?", a: "Tentu, semua source code diserahkan beserta dokumentasi singkat setelah proyek selesai." },
      { q: "Bisa pakai domain sendiri?", a: "Bisa. Saya bantu setup domain, DNS, dan deploy ke hosting pilihan Anda." },
    ],
  },
  {
    category: "design",
    icon: "Palette",
    title: "Design Ads Instagram",
    description:
      "Desain konten iklan produk yang scroll-stopping untuk Instagram — feed, story, dan carousel.",
    features: ["Feed design", "Story ads", "Carousel", "Brand kit"],
    longDescription:
      "Konten Instagram yang berkualitas adalah etalase pertama brand Anda. Saya merancang desain iklan yang eye-catching, konsisten dengan brand identity, dan dirancang untuk konversi — bukan sekadar cantik dilihat.",
    includes: [
      "Riset referensi & moodboard",
      "Desain feed, story, atau carousel",
      "Brand kit (warna, font, style guide)",
      "File siap pakai (PNG/JPG + source)",
      "Variasi ukuran (feed, story, square)",
      "Revisi hingga 3x",
    ],
    tools: ["Figma", "Adobe Photoshop", "Adobe Illustrator", "Canva Pro"],
    packages: [
      { name: "Basic", tagline: "9 konten feed", perks: ["9 desain feed", "1 style guide", "1x revisi"] },
      { name: "Standard", tagline: "Bundle lengkap", perks: ["12 feed + 6 story", "Carousel edukasi", "Brand kit", "Revisi 3x"], featured: true },
      { name: "Premium", tagline: "Konten 1 bulan", perks: ["30 konten lengkap", "Strategy kalender", "Caption copywriting", "Revisi unlimited (dalam scope)"] },
    ],
    faq: [
      { q: "Apakah termasuk copywriting caption?", a: "Paket Premium termasuk caption. Untuk paket lain bisa add-on dengan biaya tambahan." },
      { q: "Bisa minta revisi kalau kurang cocok?", a: "Tentu, setiap paket punya jatah revisi. Saya pastikan hasil sesuai visi Anda." },
      { q: "File format apa yang dikirim?", a: "PNG/JPG siap upload + source file Figma/PSD agar Anda fleksibel edit nanti." },
    ],
  },
  {
    category: "video",
    icon: "Clapperboard",
    title: "Editing Video",
    description:
      "Editing video konten maupun komersial: cinematic, reels, dan video promosi produk.",
    features: ["Reels/TikTok", "Promo produk", "Color grading", "Subtitle"],
    longDescription:
      "Video yang well-edited bisa melipatgandakan engagement. Saya mengedit dengan ritme yang tepat, color grading yang menggugah, dan sound design yang imersif — untuk reels, iklan, maupun konten YouTube.",
    includes: [
      "Editing (cut, transition, pacing)",
      "Color grading sesuai mood",
      "Sound design (SFX + musik)",
      "Subtitle/caption burned-in",
      "Motion graphics dasar",
      "Export multi-format (Reels, 16:9, dll)",
    ],
    tools: ["Adobe Premiere Pro", "After Effects", "DaVinci Resolve", "CapCut"],
    packages: [
      { name: "Basic", tagline: "Reels/TikTok 30-60dtk", perks: ["1 video pendek", "Subtitle", "1x revisi"] },
      { name: "Standard", tagline: "Iklan produk", perks: ["Video 30-90dtk", "Color grading", "Motion graphics", "Revisi 3x"], featured: true },
      { name: "Premium", tagline: "Full production", perks: ["Video panjang (>2mnt)", "Advanced VFX", "Voice over sync", "Multi-format export", "Revisi 5x"] },
    ],
    faq: [
      { q: "Apakah footage harus saya sediakan?", a: "Ya, klien menyediakan footage mentah. Saya bisa rekomendasikan stock footage bila perlu." },
      { q: "Berapa ukuran file maksimal footage?", a: "Tidak ada batas keras, tapi sebaiknya via Google Drive/Dropbox. Saya guide proses transfer-nya." },
      { q: "Bisa edit ulang setelah final?", a: "Final approval berarti selesai. Revisi kecil di dalam 7 hari gratis; di luar itu add-on." },
    ],
  },
  {
    category: "voice",
    icon: "Mic",
    title: "Voice Over",
    description:
      "Pengisian suara untuk iklan, konten, narasi, dan e-learning dengan nada yang pas.",
    features: ["Iklan radio", "Narasi video", "Audiobook", "Dubbing"],
    longDescription:
      "Suara yang tepat bisa mengangkat pesan Anda ke level berikutnya. Saya menyediakan voice over dengan nada yang bisa disesuaikan — profesional, hangat, energik, atau santani — untuk iklan, narasi korporat, dan konten edukasi.",
    includes: [
      "Konsultasi nada & gaya baca",
      "Rekaman dengan mic kondenser studio",
      "Cleaning noise & mastering loudness",
      "Format sesuai platform (WAV/MP3)",
      "2 take per baris untuk pilihan",
      "Revisi minor 2x",
    ],
    tools: ["Audacity", "Adobe Audition", "Audio-Technica AT2020"],
    packages: [
      { name: "Basic", tagline: "Spot iklan 30dtk", perks: ["Durasi <1 mnt", "1 gaya baca", "1x revisi"] },
      { name: "Standard", tagline: "Narasi/konten", perks: ["Durasi 1-5 mnt", "Multitrack", "Revisi 2x"], featured: true },
      { name: "Premium", tagline: "Audiobook/e-learning", perks: ["Durasi >5 mnt", "Konsistensi episode", "Mastering premium", "Revisi 3x"] },
    ],
    faq: [
      { q: "Bagaimana cara kirim naskah?", a: "Cukup kirim via WhatsApp/email dalam format Google Doc atau teks biasa dengan catatan intonasi bila perlu." },
      { q: "Apakah ada sample suara?", a: "Ada. Saya kirim reel demo berbagai gaya baca sebelum kita deal." },
      { q: "Berapa lama pengerjaan?", a: "Spot pendek 1-2 hari, konten panjang 3-7 hari tergantung durasi dan kompleksitas." },
    ],
  },
];
