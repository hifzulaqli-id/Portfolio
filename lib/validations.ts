import { z } from "zod";

export const CATEGORY_VALUES = ["web", "design", "video", "voice"] as const;
export const STATUS_VALUES = ["draft", "published"] as const;
export const DESIGN_TYPE_VALUES = ["instagram_feed", "poster"] as const;
export const LINK_PLATFORM_VALUES = [
  "live",
  "github",
  "youtube",
  "kaggle",
  "figma",
  "behance",
  "dribbble",
  "website",
  "other",
] as const;

/** Accept absolute URLs (http/https), root-relative paths (/images/x.svg), OR data URLs (base64). */
const urlOrPath = z
  .string()
  .trim()
  .refine(
    (v) =>
      v === "" ||
      /^https?:\/\//.test(v) ||
      v.startsWith("/") ||
      /^data:image\/[a-z]+;base64,/.test(v),
    "URL tidak valid (pakai https://, /path, atau data:image)"
  );

const toNullIfEmpty = (v: string | undefined | null) =>
  v && v.trim() ? v : null;

export const projectSchema = z
  .object({
    title: z.string().min(3, "Judul minimal 3 karakter").max(120),
    slug: z
      .string()
      .max(140)
      .optional()
      .or(z.literal(""))
      .transform((v) => (v ? v : undefined)),
    category: z.enum(CATEGORY_VALUES),
    design_type: z
      .enum(DESIGN_TYPE_VALUES)
      .optional()
      .nullable()
      .default(null),
    description: z.string().min(10, "Deskripsi minimal 10 karakter").max(280),
    content: z.string().max(8000).optional().or(z.literal("")),
    tech_stack: z.array(z.object({ name: z.string().min(1), icon: z.string().default("Code2") })).default([]),
    thumbnail_url: urlOrPath,
    gallery: z.array(z.object({ url: urlOrPath, caption: z.string().default("") })).default([]),
    // New flexible links array — filter out links with empty URLs before saving
    links: z
      .array(
        z.object({
          platform: z.enum(LINK_PLATFORM_VALUES),
          url: z.string(),
        })
      )
      .default([])
      .transform((arr) => arr.filter((l) => l.url.trim().length > 0)),
    // Legacy fields - kept for backward compatibility
    live_url: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform(toNullIfEmpty),
    github_url: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform(toNullIfEmpty),
    status: z.enum(STATUS_VALUES).default("draft"),
    display_order: z.coerce.number().int().min(0).default(0),
  })
  .superRefine((data, ctx) => {
    // If not design category, design_type must be null
    if (data.category !== "design" && data.design_type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "design_type hanya untuk kategori design",
        path: ["design_type"],
      });
    }
    // Instagram feed requires at least 3 gallery images
    if (data.design_type === "instagram_feed" && data.gallery.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Instagram Feed minimal membutuhkan 3 gambar gallery",
        path: ["gallery"],
      });
    }
  });
export type ProjectFormValues = z.infer<typeof projectSchema>;

export const messageSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(80),
  email: z.string().email("Email tidak valid"),
  service: z.enum(CATEGORY_VALUES).optional(),
  message: z
    .string()
    .min(10, "Pesan minimal 10 karakter")
    .max(2000, "Pesan terlalu panjang"),
});
export type MessageFormValues = z.infer<typeof messageSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const profileSchema = z.object({
  full_name: z.string().min(2).max(80),
  tagline: z.string().max(140).optional().or(z.literal("")),
  bio: z.string().max(2000).optional().or(z.literal("")),
  photo_url: urlOrPath,
  cv_url: z.string().optional().or(z.literal("")).transform(toNullIfEmpty),
  instagram_url: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform(toNullIfEmpty),
  whatsapp_number: z
    .string()
    .max(20)
    .optional()
    .or(z.literal(""))
    .transform(toNullIfEmpty),
  linkedin_url: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform(toNullIfEmpty),
  github_url: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform(toNullIfEmpty),
  email: z
    .string()
    .email()
    .optional()
    .or(z.literal(""))
    .transform(toNullIfEmpty),
  projects_count: z.coerce.number().int().min(0).default(0),
  clients_count: z.coerce.number().int().min(0).default(0),
  years_experience: z.coerce.number().int().min(0).default(0),
  skills: z.array(z.string()).default([]),
});
export type ProfileFormValues = z.infer<typeof profileSchema>;

// ─────────────────────────── Skills ────────────────────────────
export const SKILL_CATEGORY_VALUES = [
  "web-frontend",
  "web-backend",
  "design",
  "video",
  "audio",
  "tools",
  "soft-skill",
] as const;
export const SKILL_LEVEL_VALUES = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
] as const;

export const skillSchema = z.object({
  name: z.string().min(2, "Nama skill minimal 2 karakter").max(80),
  category: z.enum(SKILL_CATEGORY_VALUES),
  level: z.enum(SKILL_LEVEL_VALUES),
  percentage: z.coerce
    .number()
    .int()
    .min(0, "Minimal 0")
    .max(100, "Maksimal 100"),
  icon_url: z.string().optional().or(z.literal("")).transform(toNullIfEmpty),
  display_order: z.coerce.number().int().min(0).default(0),
  is_active: z.coerce.boolean().default(true),
});
export type SkillFormValues = z.infer<typeof skillSchema>;

// ─────────────────────────── Certifications ────────────────────
export const CERT_CATEGORY_VALUES = [
  "web",
  "design",
  "video",
  "audio",
  "academic",
  "competition",
  "organization",
] as const;
export const CERT_STATUS_VALUES = ["verified", "in-progress", "expired"] as const;

export const certificationSchema = z.object({
  name: z.string().min(3, "Nama sertifikat minimal 3 karakter").max(160),
  issuer: z.string().min(2, "Nama penerbit minimal 2 karakter").max(120),
  issuer_logo_url: z.string().optional().or(z.literal("")).transform(toNullIfEmpty),
  category: z.enum(CERT_CATEGORY_VALUES),
  issue_date: z.string().optional().or(z.literal("")).transform(toNullIfEmpty),
  expiry_date: z.string().optional().or(z.literal("")).transform(toNullIfEmpty),
  credential_id: z.string().max(120).optional().or(z.literal("")).transform(toNullIfEmpty),
  credential_url: z.string().optional().or(z.literal("")).transform(toNullIfEmpty),
  certificate_image_url: z.string().optional().or(z.literal("")).transform(toNullIfEmpty),
  badge_status: z.enum(CERT_STATUS_VALUES).default("verified"),
  is_public: z.coerce.boolean().default(true),
  is_featured: z.coerce.boolean().default(false),
  display_order: z.coerce.number().int().min(0).default(0),
});
export type CertificationFormValues = z.infer<typeof certificationSchema>;

// ─────────────────────────── Experience ────────────────────────
export const EXPERIENCE_TYPE_VALUES = [
  "job",
  "freelance",
  "organization",
  "committee",
  "volunteer",
] as const;
export const EMPLOYMENT_TYPE_VALUES = [
  "full-time",
  "part-time",
  "internship",
  "remote",
  "contract",
] as const;

export const experienceSchema = z.object({
  type: z.enum(EXPERIENCE_TYPE_VALUES),
  position: z.string().min(2, "Posisi minimal 2 karakter").max(120),
  company: z.string().min(2, "Nama perusahaan/organisasi minimal 2 karakter").max(120),
  logo_url: z.string().optional().or(z.literal("")).transform(toNullIfEmpty),
  location: z.string().max(120).optional().or(z.literal("")).transform(toNullIfEmpty),
  employment_type: z.preprocess(
    (v) => (v === "" || v == null ? null : v),
    z.enum(EMPLOYMENT_TYPE_VALUES).nullable()
  ),
  start_date: z.string().min(4, "Tanggal mulai wajib"),
  end_date: z.string().optional().or(z.literal("")).transform(toNullIfEmpty),
  is_current: z.coerce.boolean().default(false),
  description: z.string().max(2000).optional().or(z.literal("")),
  tech_stack: z.array(z.string()).default([]),
  achievements: z.string().max(2000).optional().or(z.literal("")),
  company_url: z.string().optional().or(z.literal("")).transform(toNullIfEmpty),
  display_order: z.coerce.number().int().min(0).default(0),
  is_active: z.coerce.boolean().default(true),
});
export type ExperienceFormValues = z.infer<typeof experienceSchema>;

// ─────────────────────────── Education ─────────────────────────
export const EDUCATION_TYPE_VALUES = [
  "formal",
  "course",
  "bootcamp",
  "workshop",
] as const;

export const educationSchema = z.object({
  type: z.enum(EDUCATION_TYPE_VALUES),
  institution: z.string().min(2, "Nama institusi minimal 2 karakter").max(120),
  field_of_study: z.string().min(2, "Jurusan/nama kursus minimal 2 karakter").max(120),
  logo_url: z.string().optional().or(z.literal("")).transform(toNullIfEmpty),
  degree_level: z.string().max(60).optional().or(z.literal("")).transform(toNullIfEmpty),
  start_year: z.coerce.number().int().min(1900).max(2100).optional().or(z.literal(0)).transform((v) => (v ? v : null)),
  end_year: z.coerce.number().int().min(1900).max(2100).optional().or(z.literal(0)).transform((v) => (v ? v : null)),
  is_current: z.coerce.boolean().default(false),
  gpa: z.coerce.number().min(0).max(4).optional().or(z.literal(0)).transform((v) => (v ? v : null)),
  description: z.string().max(2000).optional().or(z.literal("")),
  relevant_subjects: z.array(z.string()).default([]),
  achievements: z.string().max(2000).optional().or(z.literal("")),
  institution_url: z.string().optional().or(z.literal("")).transform(toNullIfEmpty),
  display_order: z.coerce.number().int().min(0).default(0),
});
export type EducationFormValues = z.infer<typeof educationSchema>;

// ─────────────────────────── Blog ──────────────────────────────
export const BLOG_STATUS_VALUES = ["draft", "published"] as const;

export const blogSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(200),
  slug: z.string().max(200).optional().or(z.literal("")).transform((v) => (v ? v : undefined)),
  category: z.string().max(60).optional().or(z.literal("")).transform(toNullIfEmpty),
  thumbnail_url: z.string().optional().or(z.literal("")).transform(toNullIfEmpty),
  excerpt: z.string().max(400).optional().or(z.literal("")),
  content: z.string().max(60000).optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  reading_time: z.coerce.number().int().min(0).optional(),
  status: z.enum(BLOG_STATUS_VALUES).default("draft"),
  is_featured: z.coerce.boolean().default(false),
  published_at: z.string().optional().or(z.literal("")).transform(toNullIfEmpty),
});
export type BlogFormValues = z.infer<typeof blogSchema>;

// ─────────────────────────── Site Settings ─────────────────────
export const ACCENT_PRESETS = ["#6C63FF", "#00D4AA", "#EC4899", "#F97316", "#3B82F6", "#8B5CF6"] as const;

export const siteSettingsSchema = z.object({
  site_title: z.string().min(2).max(160),
  site_description: z.string().max(400).optional().or(z.literal("")),
  og_image_url: z.string().optional().or(z.literal("")).transform(toNullIfEmpty),
  seo_keywords: z.array(z.string()).default([]),
  google_analytics_id: z.string().max(40).optional().or(z.literal("")).transform(toNullIfEmpty),
  maintenance_mode: z.coerce.boolean().default(false),
  maintenance_message: z.string().max(400).optional().or(z.literal("")),
  accent_color: z.string().default("#6C63FF"),
});
export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

// ─────────────────────────── Navigation Items ──────────────────
export const NAV_LOCATION_VALUES = [
  "navbar",
  "navbar-dropdown",
  "footer-col-1",
  "footer-col-2",
] as const;

export const navItemSchema = z.object({
  location: z.enum(NAV_LOCATION_VALUES),
  label: z.string().min(1, "Label wajib").max(60),
  href: z.string().min(1, "URL/href wajib").max(200),
  icon: z.string().max(60).optional().or(z.literal("")).transform(toNullIfEmpty),
  description: z.string().max(160).optional().or(z.literal("")).transform(toNullIfEmpty),
  display_order: z.coerce.number().int().min(0).default(0),
  is_active: z.coerce.boolean().default(true),
  open_in_new_tab: z.coerce.boolean().default(false),
});
export type NavItemFormValues = z.infer<typeof navItemSchema>;

// ─────────────────────────── Testimonials ──────────────────────
export const testimonialSchema = z.object({
  client_name: z.string().min(2, "Nama minimal 2 karakter").max(80),
  client_role: z.string().max(120).optional().or(z.literal("")).transform(toNullIfEmpty),
  avatar_url: z.string().optional().or(z.literal("")).transform(toNullIfEmpty),
  content: z.string().min(10, "Testimoni minimal 10 karakter").max(1000),
  rating: z.coerce.number().int().min(1, "Minimal 1").max(5, "Maksimal 5"),
  is_visible: z.coerce.boolean().default(true),
});
export type TestimonialFormValues = z.infer<typeof testimonialSchema>;

// ─────────────────────────── Services ──────────────────────────
export const SERVICE_CATEGORY_VALUES = CATEGORY_VALUES; // locked: web/design/video/voice

const servicePackageSchema = z.object({
  name: z.string().min(1, "Nama paket wajib").max(60),
  tagline: z.string().max(120).optional().or(z.literal("")),
  perks: z.array(z.string()).default([]),
  featured: z.boolean().optional(),
});

const serviceFaqSchema = z.object({
  q: z.string().min(3, "Pertanyaan minimal 3 karakter").max(200),
  a: z.string().min(3, "Jawaban minimal 3 karakter").max(600),
});

export const serviceSchema = z.object({
  icon: z.string().min(1, "Icon wajib").max(60),
  title: z.string().min(2, "Judul minimal 2 karakter").max(120),
  description: z.string().min(10, "Deskripsi minimal 10 karakter").max(400),
  features: z.array(z.string()).default([]),
  longDescription: z.string().max(2000).optional().or(z.literal("")),
  includes: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  packages: z.array(servicePackageSchema).default([]),
  faq: z.array(serviceFaqSchema).default([]),
  display_order: z.coerce.number().int().min(0).default(0),
  is_active: z.coerce.boolean().default(true),
});
export type ServiceFormValues = z.infer<typeof serviceSchema>;

// ─────────────────────────── Content Blocks ────────────────────
export const CONTENT_BLOCK_TYPE_VALUES = ["text", "array", "json"] as const;

export const contentBlockSchema = z.object({
  label: z.string().min(1, "Label wajib").max(120),
  section: z.string().min(1).max(60),
  type: z.enum(CONTENT_BLOCK_TYPE_VALUES),
  value: z.custom<string | string[] | Record<string, unknown>[]>(
    (v) => typeof v === "string" || Array.isArray(v) || (typeof v === "object" && v !== null),
    "Nilai tidak valid"
  ),
});
export type ContentBlockFormValues = z.infer<typeof contentBlockSchema>;
