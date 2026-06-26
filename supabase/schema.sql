-- ============================================================================
-- Portfolio Database Schema for Supabase (PostgreSQL)
-- ============================================================================
-- Run this entire file in: Supabase Dashboard → SQL Editor → New query → Run
--
-- This schema mirrors the TypeScript types in types/index.ts 1:1 so that the
-- mock JSON store in lib/data/*.ts can be swapped for Supabase without
-- changing component code.
--
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT everywhere.
-- ============================================================================

-- Required extensions
create extension if not exists "pgcrypto";

-- ============================================================================
-- ENUM TYPES (idempotent — wrapped in DO blocks)
-- ============================================================================
do $$ begin
  create type project_category as enum ('web', 'design', 'video', 'voice');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type nav_location as enum ('navbar', 'navbar-dropdown', 'footer-col-1', 'footer-col-2');
exception when duplicate_object then null; end $$;

do $$ begin
  create type skill_category as enum ('web-frontend', 'web-backend', 'design', 'video', 'audio', 'tools', 'soft-skill');
exception when duplicate_object then null; end $$;

do $$ begin
  create type skill_level as enum ('beginner', 'intermediate', 'advanced', 'expert');
exception when duplicate_object then null; end $$;

do $$ begin
  create type cert_category as enum ('web', 'design', 'video', 'audio', 'academic', 'competition', 'organization');
exception when duplicate_object then null; end $$;

do $$ begin
  create type cert_status as enum ('verified', 'in-progress', 'expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type experience_type as enum ('job', 'freelance', 'organization', 'committee', 'volunteer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type employment_type as enum ('full-time', 'part-time', 'internship', 'remote', 'contract');
exception when duplicate_object then null; end $$;

do $$ begin
  create type education_type as enum ('formal', 'course', 'bootcamp', 'workshop');
exception when duplicate_object then null; end $$;

do $$ begin
  create type blog_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type content_block_type as enum ('text', 'array', 'json');
exception when duplicate_object then null; end $$;

-- ============================================================================
-- TABLES
-- ============================================================================

-- ─── Profile (single row, id=1) ─────────────────────────────────────────────
create table if not exists public.profiles (
  id               integer primary key default 1,
  full_name        text not null,
  tagline          text not null,
  bio              text not null,
  photo_url        text not null,
  cv_url           text,
  instagram_url    text,
  whatsapp_number  text,
  linkedin_url     text,
  github_url       text,
  email            text,
  projects_count   integer not null default 0,
  clients_count    integer not null default 0,
  years_experience integer not null default 0,
  skills           text[] not null default '{}',
  constraint profiles_singleton check (id = 1)
);

-- ─── Projects ───────────────────────────────────────────────────────────────
create table if not exists public.projects (
  id            text primary key,
  title         text not null,
  slug          text not null unique,
  category      project_category not null,
  description   text not null,
  content       text,
  tech_stack    jsonb not null default '[]',
  thumbnail_url text not null,
  gallery       jsonb not null default '[]',
  live_url      text,
  github_url    text,
  links         jsonb not null default '[]',
  status        project_status not null default 'draft',
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ─── Migration: convert old gallery_urls (text[]) to gallery (jsonb) ────────
do $$
begin
  -- Add gallery column if it doesn't exist (safe for existing databases)
  if not exists (select 1 from information_schema.columns where table_name = 'projects' and column_name = 'gallery') then
    alter table public.projects add column gallery jsonb not null default '[]';
  end if;

  -- Migrate old gallery_urls data into new gallery format
  if exists (select 1 from information_schema.columns where table_name = 'projects' and column_name = 'gallery_urls') then
    update public.projects set gallery = (
      select coalesce(jsonb_agg(jsonb_build_object('url', elem, 'caption', '')), '[]'::jsonb)
      from unnest(gallery_urls) as elem
    ) where gallery = '[]'::jsonb and gallery_urls != '{}';

    -- Drop old column after migration
    alter table public.projects drop column gallery_urls;
  end if;

  -- Convert tech_stack from text[] to jsonb
  -- (Use rename → add → update → drop; ALTER USING cannot use aggregate + unnest)
  if exists (
    select 1 from information_schema.columns
    where table_name = 'projects'
      and column_name = 'tech_stack'
      and data_type = 'ARRAY'
      and udt_name = '_text'
  ) then
    alter table public.projects rename column tech_stack to tech_stack_old;
    alter table public.projects add column tech_stack jsonb not null default '[]';
    update public.projects set tech_stack = (
      select coalesce(jsonb_agg(jsonb_build_object('name', elem, 'icon', 'Code2')), '[]'::jsonb)
      from unnest(tech_stack_old) as elem
    );
    alter table public.projects drop column tech_stack_old;
  end if;
end $$;

-- ─── Messages (contact form submissions) ───────────────────────────────────
create table if not exists public.messages (
  id          text primary key,
  name        text not null,
  email       text not null,
  service     project_category,
  message     text not null,
  is_read     boolean not null default false,
  is_archived boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ─── Testimonials ───────────────────────────────────────────────────────────
create table if not exists public.testimonials (
  id          text primary key,
  client_name text not null,
  client_role text,
  avatar_url  text,
  content     text not null,
  rating      integer not null default 5 check (rating between 1 and 5),
  is_visible  boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ─── Skills ─────────────────────────────────────────────────────────────────
create table if not exists public.skills (
  id            text primary key,
  name          text not null,
  category      skill_category not null,
  level         skill_level not null default 'intermediate',
  percentage    integer not null default 0 check (percentage between 0 and 100),
  icon          text,
  icon_url      text,
  display_order integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ─── Certifications ─────────────────────────────────────────────────────────
create table if not exists public.certifications (
  id                    text primary key,
  name                  text not null,
  issuer                text not null,
  issuer_logo_url       text,
  category              cert_category not null,
  issue_date            date,
  expiry_date           date,
  credential_id         text,
  credential_url        text,
  certificate_image_url text,
  badge_status          cert_status not null default 'verified',
  is_public             boolean not null default true,
  is_featured           boolean not null default false,
  display_order         integer not null default 0,
  created_at            timestamptz not null default now()
);

-- ─── Experiences ────────────────────────────────────────────────────────────
create table if not exists public.experiences (
  id              text primary key,
  type            experience_type not null,
  position        text not null,
  company         text not null,
  logo_url        text,
  location        text,
  employment_type employment_type,
  start_date      date not null,
  end_date        date,
  is_current      boolean not null default false,
  description     text,
  tech_stack      text[] not null default '{}',
  achievements    text,
  company_url     text,
  display_order   integer not null default 0,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- ─── Education ──────────────────────────────────────────────────────────────
create table if not exists public.education (
  id                text primary key,
  type              education_type not null,
  institution       text not null,
  field_of_study    text not null,
  logo_url          text,
  degree_level      text,
  start_year        integer,
  end_year          integer,
  is_current        boolean not null default false,
  gpa               numeric(3,2),
  description       text,
  relevant_subjects text[] not null default '{}',
  achievements      text,
  institution_url   text,
  display_order     integer not null default 0,
  created_at        timestamptz not null default now()
);

-- ─── Blog posts ─────────────────────────────────────────────────────────────
create table if not exists public.blog_posts (
  id            text primary key,
  title         text not null,
  slug          text not null unique,
  category      text,
  thumbnail_url text,
  excerpt       text,
  content       text,
  tags          text[] not null default '{}',
  reading_time  integer not null default 1,
  status        blog_status not null default 'draft',
  is_featured   boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─── Site settings (single row, id=1) ───────────────────────────────────────
create table if not exists public.settings (
  id                  integer primary key default 1,
  site_title          text not null,
  site_description    text not null,
  og_image_url        text,
  seo_keywords        text[] not null default '{}',
  google_analytics_id text,
  maintenance_mode    boolean not null default false,
  maintenance_message text,
  accent_color        text not null default '#6C63FF',
  updated_at          timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);

-- ─── Navigation items ───────────────────────────────────────────────────────
create table if not exists public.nav_items (
  id              text primary key,
  location        nav_location not null,
  label           text not null,
  href            text not null,
  icon            text,
  description     text,
  display_order   integer not null default 0,
  is_active       boolean not null default true,
  open_in_new_tab boolean not null default false,
  created_at      timestamptz not null default now()
);

-- ─── Services (4 rows, one per category) ────────────────────────────────────
create table if not exists public.services (
  id               text primary key,
  category         project_category not null unique,
  icon             text not null,
  title            text not null,
  description      text not null,
  features         text[] not null default '{}',
  long_description text not null,
  includes         text[] not null default '{}',
  tools            text[] not null default '{}',
  packages         jsonb not null default '[]',
  faq              jsonb not null default '[]',
  display_order    integer not null default 0,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now()
);

-- ─── Content blocks (key→value store for editable text) ─────────────────────
create table if not exists public.content_blocks (
  id         text primary key,
  key        text not null unique,
  label      text not null,
  section    text not null,
  type       content_block_type not null default 'text',
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
create index if not exists idx_projects_slug     on public.projects(slug);
create index if not exists idx_projects_category on public.projects(category);
create index if not exists idx_projects_status   on public.projects(status);
create index if not exists idx_blog_slug         on public.blog_posts(slug);
create index if not exists idx_blog_status       on public.blog_posts(status);
create index if not exists idx_nav_location      on public.nav_items(location);
create index if not exists idx_services_category on public.services(category);
create index if not exists idx_blocks_section    on public.content_blocks(section);
create index if not exists idx_messages_created  on public.messages(created_at desc);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
-- Strategy:
--   • Public reads filtered by status/visibility (anon key).
--   • All writes restricted to authenticated admins.
--   • The Next.js server uses the SERVICE ROLE key which bypasses RLS entirely,
--     so admin actions from API routes always succeed regardless of auth state.
-- ============================================================================

alter table public.profiles       enable row level security;
alter table public.projects       enable row level security;
alter table public.messages       enable row level security;
alter table public.testimonials   enable row level security;
alter table public.skills         enable row level security;
alter table public.certifications enable row level security;
alter table public.experiences    enable row level security;
alter table public.education      enable row level security;
alter table public.blog_posts     enable row level security;
alter table public.settings       enable row level security;
alter table public.nav_items      enable row level security;
alter table public.services       enable row level security;
alter table public.content_blocks enable row level security;

-- ─── Profiles: public read, admin write ─────────────────────────────────────
drop policy if exists "profiles_read"  on public.profiles;
drop policy if exists "profiles_write" on public.profiles;
create policy "profiles_read"  on public.profiles for select using (true);
create policy "profiles_write" on public.profiles for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ─── Projects: published visible to all, drafts to admin ────────────────────
drop policy if exists "projects_read"  on public.projects;
drop policy if exists "projects_write" on public.projects;
create policy "projects_read"  on public.projects for select
  using (status = 'published' or auth.role() = 'authenticated');
create policy "projects_write" on public.projects for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ─── Messages: only admin can read/write (private contact submissions) ──────
drop policy if exists "messages_all"           on public.messages;
drop policy if exists "messages_public_insert" on public.messages;
create policy "messages_all" on public.messages for all
  using (auth.role() = 'authenticated') with check (true);
-- Allow the public contact form to submit via anon key (insert only):
create policy "messages_public_insert" on public.messages for insert
  to anon, authenticated with check (true);

-- ─── Testimonials: visible to all, writes to admin ──────────────────────────
drop policy if exists "testimonials_read"  on public.testimonials;
drop policy if exists "testimonials_write" on public.testimonials;
create policy "testimonials_read"  on public.testimonials for select
  using (is_visible = true or auth.role() = 'authenticated');
create policy "testimonials_write" on public.testimonials for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ─── Skills: active visible to all ──────────────────────────────────────────
drop policy if exists "skills_read"  on public.skills;
drop policy if exists "skills_write" on public.skills;
create policy "skills_read"  on public.skills for select
  using (is_active = true or auth.role() = 'authenticated');
create policy "skills_write" on public.skills for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ─── Certifications: public visible to all ──────────────────────────────────
drop policy if exists "certs_read"  on public.certifications;
drop policy if exists "certs_write" on public.certifications;
create policy "certs_read"  on public.certifications for select
  using (is_public = true or auth.role() = 'authenticated');
create policy "certs_write" on public.certifications for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ─── Experiences: active visible to all ─────────────────────────────────────
drop policy if exists "exp_read"  on public.experiences;
drop policy if exists "exp_write" on public.experiences;
create policy "exp_read"  on public.experiences for select
  using (is_active = true or auth.role() = 'authenticated');
create policy "exp_write" on public.experiences for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ─── Education: public read, admin write ────────────────────────────────────
drop policy if exists "edu_read"  on public.education;
drop policy if exists "edu_write" on public.education;
create policy "edu_read"  on public.education for select using (true);
create policy "edu_write" on public.education for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ─── Blog: published visible to all, drafts to admin ────────────────────────
drop policy if exists "blog_read"  on public.blog_posts;
drop policy if exists "blog_write" on public.blog_posts;
create policy "blog_read"  on public.blog_posts for select
  using (status = 'published' or auth.role() = 'authenticated');
create policy "blog_write" on public.blog_posts for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ─── Settings: public read, admin write ─────────────────────────────────────
drop policy if exists "settings_read"  on public.settings;
drop policy if exists "settings_write" on public.settings;
create policy "settings_read"  on public.settings for select using (true);
create policy "settings_write" on public.settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ─── Nav items: active visible to all ───────────────────────────────────────
drop policy if exists "nav_read"  on public.nav_items;
drop policy if exists "nav_write" on public.nav_items;
create policy "nav_read"  on public.nav_items for select
  using (is_active = true or auth.role() = 'authenticated');
create policy "nav_write" on public.nav_items for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ─── Services: active visible to all ────────────────────────────────────────
drop policy if exists "svc_read"  on public.services;
drop policy if exists "svc_write" on public.services;
create policy "svc_read"  on public.services for select
  using (is_active = true or auth.role() = 'authenticated');
create policy "svc_write" on public.services for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ─── Content blocks: public read, admin write ───────────────────────────────
drop policy if exists "blocks_read"  on public.content_blocks;
drop policy if exists "blocks_write" on public.content_blocks;
create policy "blocks_read"  on public.content_blocks for select using (true);
create policy "blocks_write" on public.content_blocks for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================================
-- SEED DATA  (mirrors lib/data/seed.ts — uses ON CONFLICT, safe to re-run)
-- ============================================================================

-- ─── Profile ─────────────────────────────────────────────────────────────────
insert into public.profiles (id, full_name, tagline, bio, photo_url, cv_url, instagram_url, whatsapp_number, linkedin_url, github_url, email, projects_count, clients_count, years_experience, skills) values
(1, 'Budi Santoso', 'Mahasiswa Informatika · Web Developer · Creative Designer',
 'Saya Budi, mahasiswa Informatika yang nguli di persimpangan antara kode dan kreativitas. Selama 2+ tahun saya bantu UMKM, konten kreator, dan startup kecil mewujudkan ide mereka lewat website, desain iklan Instagram, editing video, dan voice over. Saya percaya karya yang baik itu rapi, cepat, dan jujur.',
 '/images/avatar.svg', '/images/cv-placeholder.pdf', 'https://instagram.com/', '6281234567890', 'https://linkedin.com/', 'https://github.com/', 'halo@budisantoso.dev',
 42, 28, 2,
 array['HTML','CSS','JavaScript','TypeScript','React','Next.js','Tailwind CSS','Node.js','Figma','Adobe Premiere Pro','After Effects','Photoshop','Illustrator','CapCut','Audacity','Git'])
on conflict (id) do nothing;

-- ─── Settings ───────────────────────────────────────────────────────────────
insert into public.settings (id, site_title, site_description, og_image_url, seo_keywords, google_analytics_id, maintenance_mode, maintenance_message, accent_color, updated_at) values
(1, 'Budi Santoso — Mahasiswa Informatika & Creative Developer',
 'Mahasiswa Informatika yang melayani Web Development, Design Ads Instagram, Editing Video, dan Voice Over.',
 '/images/og-image.svg',
 array['portfolio','web developer','freelancer','design ads','video editing','voice over'],
 null, false, 'Situs sedang dalam pemeliharaan. Kami akan kembali segera!', '#6C63FF', '2024-01-01T00:00:00.000Z')
on conflict (id) do nothing;

-- ─── Projects ───────────────────────────────────────────────────────────────
insert into public.projects (id, title, slug, category, description, content, tech_stack, thumbnail_url, gallery, live_url, github_url, links, status, display_order, created_at) values
('p-web-1', 'Nusantara Coffee — Company Profile', 'nusantara-coffee-company-profile', 'web',
 'Website company profile untuk brand kopi Nusantara Coffee. Fitur katalog produk, cerita brand, dan integrasi WhatsApp untuk pemesanan.',
 'Nusantara Coffee adalah brand kopi lokal yang ingin memperluas jangkauan online.

Saya membangun website company profile dengan Next.js yang fast-loading dan SEO-friendly. Halaman utama menampilkan hero cerita brand, katalog produk dengan filter asal daerah, serta tombol pesan langsung ke WhatsApp.

Hasilnya: loading time di bawah 1 detik, skor Lighthouse 95+, dan peningkatan order WhatsApp sebesar 40% dalam bulan pertama.',
 '[{"name":"Next.js","icon":"Monitor"},{"name":"TypeScript","icon":"Braces"},{"name":"Tailwind CSS","icon":"Palette"},{"name":"Framer Motion","icon":"Zap"}]'::jsonb,
 '/images/project-web-1.svg',
 '[{"url":"/images/project-web-1.svg","caption":"Homepage Nusantara Coffee"},{"url":"/images/gallery-1.svg","caption":"Katalog Produk"},{"url":"/images/gallery-2.svg","caption":"Halaman About Us"}]'::jsonb,
 'https://example.com', 'https://github.com/',
 '[{"platform":"live","url":"https://nusantara-coffee.example.com"},{"platform":"github","url":"https://github.com/budisantoso/nusantara-coffee"}]'::jsonb,
 'published', 1, '2024-09-12T10:00:00.000Z'),
('p-web-2', 'TaskFlow — Aplikasi Manajemen Tugas', 'taskflow-app-manajemen-tugas', 'web',
 'Aplikasi web manajemen tugas dengan drag-and-drop kanban board, otentikasi, dan sinkronisasi real-time.',
 'TaskFlow adalah side project saya mempelajari arsitektur aplikasi full-stack.

Fitur utama: kanban board drag-and-drop, otentikasi pengguna, due date reminder, dan kolaborasi tim. Saya fokus pada UX yang mulus dan performa yang ringan.

Stack modern end-to-end dengan type-safety penuh.',
 '[{"name":"Next.js","icon":"Monitor"},{"name":"React","icon":"AppWindow"},{"name":"Supabase","icon":"Database"},{"name":"Tailwind CSS","icon":"Palette"},{"name":"Zod","icon":"ShieldCheck"}]'::jsonb,
 '/images/project-web-2.svg',
 '[{"url":"/images/project-web-2.svg","caption":"Kanban Board"},{"url":"/images/gallery-3.svg","caption":"Halaman Login"}]'::jsonb,
 'https://example.com', 'https://github.com/',
 '[{"platform":"live","url":"https://taskflow.example.com"},{"platform":"github","url":"https://github.com/budisantoso/taskflow"},{"platform":"youtube","url":"https://youtube.com/watch?v=demo"}]'::jsonb,
 'published', 2, '2024-08-03T10:00:00.000Z'),
('p-design-1', 'Glow Skincare — Kampanye Feed Ramadan', 'glow-skincare-kampanye-feed-ramadan', 'design',
 'Desain 12 konten feed Instagram bertema Ramadan untuk brand skincare Glow. Konsisten brand kit, palette hangat, dan copy persuasif.',
 'Glow Skincare ingin kampanye Ramadan yang elegan namun tetap vibrant.

Saya merancang 12 desain feed dengan grid yang harmonis, palette hangat (gold, dusty rose, deep green), serta tipografi yang mewah. Setiap konten punya CTA jelas untuk drive engagement.

Engagement rate naik 3.5x dibanding bulan sebelumnya.',
 '[{"name":"Figma","icon":"Palette"},{"name":"Photoshop","icon":"Camera"},{"name":"Illustrator","icon":"Sparkles"}]'::jsonb,
 '/images/project-design-1.svg',
 '[{"url":"/images/project-design-1.svg","caption":"Feed Ramadan #1"},{"url":"/images/gallery-1.svg","caption":"Feed Ramadan #2"},{"url":"/images/gallery-2.svg","caption":"Feed Ramadan #3"},{"url":"/images/gallery-3.svg","caption":"Feed Ramadan #4"}]'::jsonb,
 'https://instagram.com/', null,
 '[]'::jsonb, 'published', 3, '2024-07-20T10:00:00.000Z'),
('p-design-2', 'Urban Streetwear — Carousel Edukasi', 'urban-streetwear-carousel-edukasi', 'design',
 'Seri carousel edukatif tentang styling streetwear untuk brand Urban. Format 10-slide yang shareable dan informatif.',
 'Urban Streetwear ingin konten yang saved dan shared, bukan sekadar liked.

Saya buat seri carousel ''5 Cara Style Jaket Bomber'' dengan ilustrasi custom, tipografi bold, dan layout yang mudah dibaca. Formatnya dirancang untuk retention dan shareability.',
 '[{"name":"Figma","icon":"Palette"},{"name":"Illustrator","icon":"Sparkles"},{"name":"Photoshop","icon":"Camera"}]'::jsonb,
 '/images/project-design-2.svg',
 '[{"url":"/images/project-design-2.svg","caption":"Carousel Cover"},{"url":"/images/gallery-2.svg","caption":"Slide Internal"}]'::jsonb,
 'https://instagram.com/', null,
 '[]'::jsonb, 'published', 4, '2024-06-15T10:00:00.000Z'),
('p-video-1', 'Sajian Rasa — Iklan Produk Cinematic', 'sajian-rasa-iklan-produk-cinematic', 'video',
 'Editing iklan produk makanan 30-detik dengan gaya cinematic, color grading hangat, dan sound design yang menggugah selera.',
 'Sajian Rasa butuh iklan 30 detik untuk launching produk baru.

Saya kerjakan editing penuh: pemilihan shot terbaik, color grading warm-tone yang bikin ngiler, motion graphics untuk highlight produk, serta sound design dengan SFX dan musik yang pas.

Video ini jadi creative utama untuk Meta & TikTok Ads.',
 '[{"name":"Premiere Pro","icon":"Camera"},{"name":"After Effects","icon":"Sparkles"},{"name":"DaVinci Resolve","icon":"Layers"}]'::jsonb,
 '/images/project-video-1.svg',
 '[{"url":"/images/project-video-1.svg","caption":"Frame Utama"},{"url":"/images/gallery-1.svg","caption":"Color Grading"}]'::jsonb,
 'https://example.com', null,
 '[]'::jsonb, 'published', 5, '2024-05-28T10:00:00.000Z'),
('p-voice-1', 'EduLearn — Narasi Kursus Online', 'edulearn-narasi-kursus-online', 'voice',
 'Voice over untuk 24 video pembelajaran kursus digital marketing. Nada profesional, jelas, dan ramah untuk audiens pemula.',
 'EduLearn platform edukasi online butuh narator tetap untuk seri kursus mereka.

Saya rekam 24 video voice over dengan tone yang konsisten — profesional tapi tetap approachable. Setiap rekaman di-clean dari noise, di-master untuk loudness standar, dan diserahkan dengan timestamp.

Completion rate kursus naik karena narasi yang enak diikuti.',
 '[{"name":"Audacity","icon":"Music"},{"name":"Adobe Audition","icon":"Music"}]'::jsonb,
 '/images/project-voice-1.svg',
 '[{"url":"/images/project-voice-1.svg","caption":"Studio Recording"},{"url":"/images/gallery-3.svg","caption":"Waveform Preview"}]'::jsonb,
 null, null,
 '[]'::jsonb, 'published', 6, '2024-04-10T10:00:00.000Z')
on conflict (id) do nothing;

-- ─── Messages ───────────────────────────────────────────────────────────────
insert into public.messages (id, name, email, service, message, is_read, is_archived, created_at) values
('m-1', 'Dewi Lestari', 'dewi@example.com', 'web',
 'Hai Budi, saya punya bisnis kuliner dan butuh website company profile. Bisa diskusi budget dan timeline-nya? Terima kasih!',
 false, false, '2024-10-20T08:30:00.000Z'),
('m-2', 'Rizky Pratama', 'rizky@example.com', 'design',
 'Halo, saya butuh desain 20 konten Instagram untuk launching produk baru bulan depan. Mohon info harga dan portofolio terkait ya.',
 false, false, '2024-10-19T14:15:00.000Z'),
('m-3', 'Siti Rahmawati', 'siti@example.com', 'video',
 'Selamat siang, saya tertarik jasa editing video untuk channel YouTube saya. Bisakah kirim rate card? Terima kasih.',
 true, false, '2024-10-18T11:00:00.000Z')
on conflict (id) do nothing;

-- ─── Testimonials ───────────────────────────────────────────────────────────
insert into public.testimonials (id, client_name, client_role, avatar_url, content, rating, is_visible, created_at) values
('t-1', 'Andi Wijaya', 'Founder, Nusantara Coffee', null,
 'Budi sangat profesional. Website yang dibuat cepat, rapi, dan hasilnya melampaui ekspektasi. Order WhatsApp kami naik drastis setelah online. Recommended!',
 5, true, '2024-09-25T10:00:00.000Z'),
('t-2', 'Maya Sari', 'Marketing Lead, Glow Skincare', null,
 'Desain feed Ramadan-nya keren banget. Konsisten dengan brand kami dan engagement naik berkali-kali lipat. Pasti pakai jasa Budi lagi!',
 5, true, '2024-08-05T10:00:00.000Z'),
('t-3', 'Hendra Gunawan', 'Content Creator', null,
 'Editing videonya rapi dan cepat. Budi paham banget tren dan hasilnya selalu on-point. Komunikasinya juga enak.',
 5, true, '2024-06-01T10:00:00.000Z')
on conflict (id) do nothing;

-- ─── Skills ─────────────────────────────────────────────────────────────────
insert into public.skills (id, name, category, level, percentage, icon, icon_url, display_order, is_active, created_at) values
('sk-1',  'React',           'web-frontend', 'expert',       92, 'Code2',         null, 1,  true, '2024-01-01T00:00:00.000Z'),
('sk-2',  'Next.js',         'web-frontend', 'expert',       88, 'Zap',           null, 2,  true, '2024-01-01T00:00:00.000Z'),
('sk-3',  'Tailwind CSS',    'web-frontend', 'expert',       90, 'Paintbrush',    null, 3,  true, '2024-01-01T00:00:00.000Z'),
('sk-4',  'TypeScript',      'web-frontend', 'advanced',     82, 'Terminal',      null, 4,  true, '2024-01-01T00:00:00.000Z'),
('sk-5',  'Node.js',         'web-backend',  'advanced',     78, 'Server',        null, 5,  true, '2024-01-01T00:00:00.000Z'),
('sk-6',  'PostgreSQL',      'web-backend',  'intermediate', 65, 'Database',      null, 6,  true, '2024-01-01T00:00:00.000Z'),
('sk-7',  'Figma',           'design',       'advanced',     85, 'Figma',         null, 7,  true, '2024-01-01T00:00:00.000Z'),
('sk-8',  'Adobe Photoshop', 'design',       'advanced',     80, 'Palette',       null, 8,  true, '2024-01-01T00:00:00.000Z'),
('sk-9',  'Premiere Pro',    'video',        'advanced',     84, 'Film',          null, 9,  true, '2024-01-01T00:00:00.000Z'),
('sk-10', 'Audacity',        'audio',        'intermediate', 70, 'Mic',           null, 10, true, '2024-01-01T00:00:00.000Z'),
('sk-11', 'Git & GitHub',    'tools',        'advanced',     83, 'GitBranch',     null, 11, true, '2024-01-01T00:00:00.000Z'),
('sk-12', 'Komunikasi',      'soft-skill',   'advanced',     86, 'MessageSquare', null, 12, true, '2024-01-01T00:00:00.000Z'),
('sk-13', 'Manajemen Waktu', 'soft-skill',   'advanced',     80, 'Target',        null, 13, true, '2024-01-01T00:00:00.000Z')
on conflict (id) do nothing;

-- ─── Certifications ─────────────────────────────────────────────────────────
insert into public.certifications (id, name, issuer, issuer_logo_url, category, issue_date, expiry_date, credential_id, credential_url, certificate_image_url, badge_status, is_public, is_featured, display_order, created_at) values
('c-1', 'Meta Front-End Developer', 'Meta (Coursera)', null, 'web', '2024-03-15', null, 'META-FE-2024-10293', 'https://coursera.org/verify/', '/images/cert-1.svg', 'verified', true, true, 1, '2024-03-15T00:00:00.000Z'),
('c-2', 'Google UX Design', 'Google', null, 'design', '2024-01-20', null, 'GUX-2024-5521', 'https://coursera.org/verify/', '/images/cert-2.svg', 'verified', true, true, 2, '2024-01-20T00:00:00.000Z'),
('c-3', 'Adobe Certified Professional — Video Design', 'Adobe', null, 'video', '2023-11-05', '2026-11-05', 'ACP-VD-7732', 'https://certiport.pearsonvue.com/', '/images/cert-3.svg', 'verified', true, false, 3, '2023-11-05T00:00:00.000Z'),
('c-4', 'Juara 1 Hackathon Nasional 2024', 'Kementerian Kominfo', null, 'competition', '2024-09-10', null, 'HCK-2024-N1', null, '/images/cert-1.svg', 'verified', true, true, 4, '2024-09-10T00:00:00.000Z'),
('c-5', 'AWS Cloud Practitioner (Esensials)', 'Amazon Web Services', null, 'web', null, null, null, null, '/images/cert-2.svg', 'in-progress', true, false, 5, '2024-10-01T00:00:00.000Z')
on conflict (id) do nothing;

-- ─── Experiences ────────────────────────────────────────────────────────────
insert into public.experiences (id, type, position, company, logo_url, location, employment_type, start_date, end_date, is_current, description, tech_stack, achievements, company_url, display_order, is_active, created_at) values
('e-1', 'freelance', 'Freelance Web Developer', 'Berbagai Klien', null, 'Remote', 'contract', '2023-01-01', null, true,
 'Membangun website company profile, landing page, dan aplikasi web untuk UMKM dan startup kecil.',
 array['Next.js','React','Tailwind CSS','Supabase'], 'Menyelesaikan 40+ proyek dengan rating kepuasan klien 100%.', null, 1, true, '2023-01-01T00:00:00.000Z'),
('e-2', 'job', 'Frontend Developer Intern', 'TechNova Studio', null, 'Jakarta', 'internship', '2024-02-01', '2024-06-30', false,
 'Magang sebagai frontend developer, mengerjakan dashboard internal dan komponen UI reusable.',
 array['React','TypeScript','Tailwind CSS'], 'Mengurangi waktu render dashboard sebesar 35% melalui optimasi komponen.', 'https://example.com', 2, true, '2024-02-01T00:00:00.000Z'),
('e-3', 'committee', 'Head of Media & Creative', 'Himatifa (Himpunan Mahasiswa Informatika)', null, 'Kampus', 'part-time', '2023-08-01', '2024-08-01', false,
 'Memimpin divisi media untuk produksi konten event dan kepengurusan himpunan.',
 array['Premiere Pro','Figma','Photoshop'], 'Menambah engagement Instagram himpunan 3x lipat dalam satu periode.', null, 3, true, '2023-08-01T00:00:00.000Z'),
('e-4', 'volunteer', 'Relawan Pengajar Digital', 'Yayasan Literasi Digital', null, 'Jakarta', null, '2023-06-01', null, true,
 'Mengajar literasi digital dasar untuk pelajar SMA di daerah marginalized.',
 array[]::text[], 'Mentor untuk 50+ pelajar lintas 3 sekolah.', null, 4, true, '2023-06-01T00:00:00.000Z')
on conflict (id) do nothing;

-- ─── Education ──────────────────────────────────────────────────────────────
insert into public.education (id, type, institution, field_of_study, logo_url, degree_level, start_year, end_year, is_current, gpa, description, relevant_subjects, achievements, institution_url, display_order, created_at) values
('ed-1', 'formal', 'Universitas Nusantara Jaya', 'Teknik Informatika', null, 'S1', 2022, null, true, 3.78,
 'Fokus pada rekayasa perangkat lunak dan interaksi manusia-komputer.',
 array['Algoritma & Pemrograman','Basis Data','Rekayasa Perangkat Lunak','Kecerdasan Buatan','UI/UX'],
 'IPK semester 3-5 konsisten > 3.7; asisten dosen mata kuliah Pemrograman Web.', null, 1, '2022-08-01T00:00:00.000Z'),
('ed-2', 'bootcamp', 'Dicoding Academy', 'Belajar Dasar Pemrograman JavaScript', null, 'Sertifikat', 2023, 2023, false, null,
 'Bootcamp fundamental JavaScript ES6+ dan praktik pemrograman modern.',
 array['JavaScript','ES6','Asynchronous'],
 'Lulus dengan predikat ''Sangat Memuaskan''.', 'https://dicoding.com', 2, '2023-05-01T00:00:00.000Z'),
('ed-3', 'course', 'Coursera', 'The Complete React Developer Course', null, 'Sertifikat', 2024, 2024, false, null,
 'Kursus online mendalam tentang React, hooks, dan ekosistemnya.',
 array['React','Redux','Hooks'],
 'Menyelesaikan 5 proyek praktik end-to-end.', 'https://coursera.org', 3, '2024-02-01T00:00:00.000Z')
on conflict (id) do nothing;

-- ─── Blog posts ─────────────────────────────────────────────────────────────
insert into public.blog_posts (id, title, slug, category, thumbnail_url, excerpt, content, tags, reading_time, status, is_featured, published_at, created_at, updated_at) values
('b-1', '5 Tips Membangun Website Cepat dengan Next.js', '5-tips-website-cepat-nextjs', 'Web Development', '/images/blog-1.svg',
 'Performa adalah segalanya. Berikut lima praktik yang saya pakai untuk membuat website Next.js tetap ringan dan kilat.',
 '## Kenapa performa itu penting

Pengunjung modern tidak sabar. Setiap detik tambahan menurunkan konversi. Next.js memberi kita banyak alat bawaan untuk tetap cepat.

## 1. Pakai next/image

Komponen `next/image` mengoptimasi gambar otomatis — lazy loading, format modern, dan sizing yang tepat.

## 2. Kode-split otomatis

Setiap route di App Router otomatis di-split. Pastikan komponen berat di-import dinamis.

```tsx
const HeavyChart = dynamic(() => import(''./HeavyChart''));
```

## 3. Manfaatkan ISR

Incremental Static Regeneration memberi kecepatan statis dengan fleksibilitas dinamis.

## 4. Optimasi font

Pakai `next/font` untuk preload tanpa layout shift.

## 5. Ukur, jangan menebak

Pakai Lighthouse dan `@next/bundle-analyzer` untuk melihat apa yang berat.',
 array['Next.js','Performance','Frontend'], 5, 'published', true, '2024-09-12T10:00:00.000Z', '2024-09-12T10:00:00.000Z', '2024-09-12T10:00:00.000Z'),
('b-2', 'Workflow Editing Video Cinematic untuk Iklan Produk', 'workflow-editing-video-cinematic-iklan', 'Video Editing', '/images/blog-2.svg',
 'Dari footage mentah sampai iklan yang menggugah selera — begini alur kerja editing cinematic saya.',
 '## Persiapan

Sebelum buka timeline, saya selalu tahu dulu emosi apa yang ingin disampaikan. Cinematic bukan cuma soal filter, tapi soal ritme.

## Pemilihan Shot

Pilih shot terbaik di log. Yang punya motion halus dan komposisi rapi diprioritaskan.

## Color Grading

Grading warm-tone bikin makanan terlihat lebih menggoda. Saya pakai node-based grading di DaVinci Resolve.

## Sound Design

Setengah dari kesan cinematic datang dari audio. SFX dan musik harus sejalan dengan visual.',
 array['Video','Editing','Cinematic'], 4, 'published', false, '2024-07-20T10:00:00.000Z', '2024-07-20T10:00:00.000Z', '2024-07-20T10:00:00.000Z'),
('b-3', 'Mendesain Feed Instagram yang Konsisten & Menarik', 'mendesain-feed-instagram-konsisten', 'Design', '/images/blog-3.svg',
 'Feed yang rapi membangun kepercayaan. Ini framework yang saya pakai untuk merancang grid Instagram brand.',
 '## Konsistensi adalah kunci

Brand yang kuat punya visual language yang konsisten. Grid Instagram adalah showcase pertama calon pelanggan.

## Pilih palette terbatas

Maksimal 4 warna utama. Lebih banyak dari itu, feed jadi berisik.

## Buat grid template

Saya selalu merancang template 3-atau-9 grid sebelum produksi konten individual.

## Varian layout

Variasikan antara full-photo, quote, dan carousel agar tidak monoton namun tetap harmonis.',
 array['Design','Instagram','Branding'], 3, 'published', false, '2024-06-15T10:00:00.000Z', '2024-06-15T10:00:00.000Z', '2024-06-15T10:00:00.000Z')
on conflict (id) do nothing;

-- ─── Nav items ──────────────────────────────────────────────────────────────
insert into public.nav_items (id, location, label, href, icon, description, display_order, is_active, open_in_new_tab, created_at) values
('nav-1', 'navbar', 'Home', '/', 'Home', null, 1, true, false, '2024-01-01T00:00:00.000Z'),
('nav-2', 'navbar', 'Portofolio', '/projects', 'FolderKanban', null, 2, true, false, '2024-01-01T00:00:00.000Z'),
('nav-3', 'navbar', 'Layanan', '/services', 'Briefcase', null, 3, true, false, '2024-01-01T00:00:00.000Z'),
('nav-4', 'navbar', 'Blog', '/blog', 'BookOpen', null, 4, true, false, '2024-01-01T00:00:00.000Z'),
('nav-5', 'navbar', 'Kontak', '/contact', 'Mail', null, 6, true, false, '2024-01-01T00:00:00.000Z'),
('navd-1', 'navbar-dropdown', 'Tentang Saya', '/about', 'User', 'Biografi & latar belakang', 1, true, false, '2024-01-01T00:00:00.000Z'),
('navd-2', 'navbar-dropdown', 'Skills', '/skills', 'Wrench', 'Kemampuan teknis & tools', 2, true, false, '2024-01-01T00:00:00.000Z'),
('navd-3', 'navbar-dropdown', 'Sertifikat', '/certifications', 'Award', 'Sertifikat & penghargaan', 3, true, false, '2024-01-01T00:00:00.000Z'),
('navd-4', 'navbar-dropdown', 'Pengalaman', '/experience', 'History', 'Riwayat kerja & organisasi', 4, true, false, '2024-01-01T00:00:00.000Z'),
('f1-1', 'footer-col-1', 'Home', '/', null, null, 1, true, false, '2024-01-01T00:00:00.000Z'),
('f1-2', 'footer-col-1', 'Portofolio', '/projects', null, null, 2, true, false, '2024-01-01T00:00:00.000Z'),
('f1-3', 'footer-col-1', 'Layanan', '/services', null, null, 3, true, false, '2024-01-01T00:00:00.000Z'),
('f1-4', 'footer-col-1', 'Blog', '/blog', null, null, 4, true, false, '2024-01-01T00:00:00.000Z'),
('f1-5', 'footer-col-1', 'Kontak', '/contact', null, null, 5, true, false, '2024-01-01T00:00:00.000Z'),
('f2-1', 'footer-col-2', 'Tentang Saya', '/about', null, null, 1, true, false, '2024-01-01T00:00:00.000Z'),
('f2-2', 'footer-col-2', 'Skills', '/skills', null, null, 2, true, false, '2024-01-01T00:00:00.000Z'),
('f2-3', 'footer-col-2', 'Sertifikat', '/certifications', null, null, 3, true, false, '2024-01-01T00:00:00.000Z'),
('f2-4', 'footer-col-2', 'Pengalaman', '/experience', null, null, 4, true, false, '2024-01-01T00:00:00.000Z'),
('f2-5', 'footer-col-2', 'Pendidikan', '/education', null, null, 5, true, false, '2024-01-01T00:00:00.000Z')
on conflict (id) do nothing;

-- ─── Content blocks ─────────────────────────────────────────────────────────
insert into public.content_blocks (id, key, label, section, type, value, updated_at) values
('cb-hero-roles', 'hero.roles', 'Hero — Daftar Role (typewriter)', 'hero', 'array',
 '["Web Developer","Creative Designer","Video Editor","Voice Over Artist","Mahasiswa Informatika"]'::jsonb, '2024-01-01T00:00:00.000Z'),
('cb-hero-stats', 'hero.stats', 'Hero — Statistik', 'hero', 'json',
 '[{"value":"2+","label":"Tahun\nPengalaman"},{"value":"50+","label":"Proyek\nSelesai"},{"value":"30+","label":"Klien\nPuas"}]'::jsonb, '2024-01-01T00:00:00.000Z'),
('cb-process-steps', 'process.steps', 'Process — Langkah Kerja', 'process', 'json',
 '[{"title":"Diskusi","tag":"Mulai di sini","description":"Kita ngobrol santai soal ide, tujuan, dan kebutuhan Anda. Saya dengarkan dulu, baru kasih saran."},{"title":"Perencanaan","tag":"Transparan","description":"Saya susun konsep, timeline, dan scope kerja yang jelas. Tidak ada biaya tersembunyi."},{"title":"Eksekusi","tag":"Update Berkala","description":"Proses pengerjaan transparan dengan update berkala. Anda bisa pantau progresnya."},{"title":"Revisi & Selesai","tag":"Garansi Puas","description":"Revisi sampai hasil sesuai harapan, lalu serah terima rapi beserta file lengkapnya."}]'::jsonb, '2024-01-01T00:00:00.000Z'),
('cb-cta-trust', 'contact_cta.trust_items', 'Contact CTA — Item Kepercayaan', 'contact-cta', 'array',
 '["Respons < 24 jam","Garansi Revisi","Kerja Transparan"]'::jsonb, '2024-01-01T00:00:00.000Z'),
('cb-about-values', 'about.values', 'Tentang — Nilai & Kepribadian', 'about', 'json',
 '[{"title":"Integritas","desc":"Jujur dalam setiap proses dan deliverable. Tidak ada janji kosong.","icon":"ShieldCheck","color":"bg-blue-500/15 text-blue-500","border":"border-blue-500/20","glow":"hover:shadow-blue-500/10"},{"title":"Detail-Oriented","desc":"Memperhatikan hal kecil yang membuat hasil terasa premium.","icon":"Target","color":"bg-purple-500/15 text-purple-500","border":"border-purple-500/20","glow":"hover:shadow-purple-500/10"},{"title":"Selalu Belajar","desc":"Teknologi bergerak cepat — saya ikut bergerak dengannya.","icon":"Lightbulb","color":"bg-amber-500/15 text-amber-500","border":"border-amber-500/20","glow":"hover:shadow-amber-500/10"},{"title":"Kolaboratif","desc":"Komunikasi terbuka dan transparan dengan klien serta tim.","icon":"Users","color":"bg-green-500/15 text-green-500","border":"border-green-500/20","glow":"hover:shadow-green-500/10"},{"title":"Kreatif","desc":"Mencari solusi out-of-the-box, bukan template generik.","icon":"Sparkles","color":"bg-pink-500/15 text-pink-500","border":"border-pink-500/20","glow":"hover:shadow-pink-500/10"},{"title":"Passionate","desc":"Mengerjakan tiap proyek dengan antusiasme layaknya karya sendiri.","icon":"Heart","color":"bg-rose-500/15 text-rose-500","border":"border-rose-500/20","glow":"hover:shadow-rose-500/10"}]'::jsonb, '2024-01-01T00:00:00.000Z'),
('cb-about-hobbies', 'about.hobbies', 'Tentang — Minat & Hobi', 'about', 'json',
 '[{"label":"Coding","icon":"Code2","color":"text-blue-500 bg-blue-500/10","border":"border-blue-500/20"},{"label":"Fotografi","icon":"Camera","color":"text-violet-500 bg-violet-500/10","border":"border-violet-500/20"},{"label":"Musik","icon":"Music","color":"text-pink-500 bg-pink-500/10","border":"border-pink-500/20"},{"label":"Membaca","icon":"BookOpen","color":"text-amber-500 bg-amber-500/10","border":"border-amber-500/20"},{"label":"Olahraga","icon":"Dumbbell","color":"text-green-500 bg-green-500/10","border":"border-green-500/20"},{"label":"Ngopi","icon":"Coffee","color":"text-orange-500 bg-orange-500/10","border":"border-orange-500/20"},{"label":"Traveling","icon":"Plane","color":"text-sky-500 bg-sky-500/10","border":"border-sky-500/20"},{"label":"Design","icon":"Palette","color":"text-rose-500 bg-rose-500/10","border":"border-rose-500/20"}]'::jsonb, '2024-01-01T00:00:00.000Z')
on conflict (id) do nothing;

-- ─── Services (built from the hardcoded SERVICES source) ────────────────────
insert into public.services (id, category, icon, title, description, features, long_description, includes, tools, packages, faq, display_order, is_active, created_at) values
('svc-web', 'web', 'Code2', 'Web Developer',
 'Website dan aplikasi web modern, cepat, dan responsif menggunakan Next.js, React, dan Tailwind CSS.',
 array['Landing page','Company profile','Web app','Optimasi SEO'],
 'Saya membangun website yang tidak hanya cantik, tapi juga cepat, aman, dan mudah ditemukan di Google. Menggunakan teknologi modern seperti Next.js dan Tailwind CSS, setiap situs dioptimalkan untuk performa maksimal dan pengalaman pengguna terbaik di semua perangkat.',
 array['Desain UI/UX responsif (mobile-first)','Optimasi kecepatan & Core Web Vitals','Setup SEO dasar (meta, sitemap, robots)','Integrasi WhatsApp / form kontak','Domain & hosting guidance','Revisi hingga 3x'],
 array['Next.js','React','Tailwind CSS','TypeScript','Supabase','Vercel'],
 '[{"name":"Basic","tagline":"Landing page 1 halaman","perks":["1 halaman","Mobile responsive","Form kontak","Revisi 2x"]},{"name":"Standard","tagline":"Company profile lengkap","perks":["Sampai 5 halaman","SEO dasar","Integrasi WA","Revisi 3x"],"featured":true},{"name":"Premium","tagline":"Web app custom","perks":["Halaman tak terbatas","Database & auth","Dashboard admin","Revisi 5x","Garansi 30 hari"]}]'::jsonb,
 '[{"q":"Berapa lama pengerjaan website?","a":"Landing page 3-5 hari, company profile 1-2 minggu, web app tergantung kompleksitas (estimasi di awal)."},{"q":"Apakah saya dapat file source code-nya?","a":"Tentu, semua source code diserahkan beserta dokumentasi singkat setelah proyek selesai."},{"q":"Bisa pakai domain sendiri?","a":"Bisa. Saya bantu setup domain, DNS, dan deploy ke hosting pilihan Anda."}]'::jsonb,
 1, true, '2024-01-01T00:00:00.000Z'),
('svc-design', 'design', 'Palette', 'Design Ads Instagram',
 'Desain konten iklan produk yang scroll-stopping untuk Instagram — feed, story, dan carousel.',
 array['Feed design','Story ads','Carousel','Brand kit'],
 'Konten Instagram yang berkualitas adalah etalase pertama brand Anda. Saya merancang desain iklan yang eye-catching, konsisten dengan brand identity, dan dirancang untuk konversi — bukan sekadar cantik dilihat.',
 array['Riset referensi & moodboard','Desain feed, story, atau carousel','Brand kit (warna, font, style guide)','File siap pakai (PNG/JPG + source)','Variasi ukuran (feed, story, square)','Revisi hingga 3x'],
 array['Figma','Adobe Photoshop','Adobe Illustrator','Canva Pro'],
 '[{"name":"Basic","tagline":"9 konten feed","perks":["9 desain feed","1 style guide","1x revisi"]},{"name":"Standard","tagline":"Bundle lengkap","perks":["12 feed + 6 story","Carousel edukasi","Brand kit","Revisi 3x"],"featured":true},{"name":"Premium","tagline":"Konten 1 bulan","perks":["30 konten lengkap","Strategy kalender","Caption copywriting","Revisi unlimited (dalam scope)"]}]'::jsonb,
 '[{"q":"Apakah termasuk copywriting caption?","a":"Paket Premium termasuk caption. Untuk paket lain bisa add-on dengan biaya tambahan."},{"q":"Bisa minta revisi kalau kurang cocok?","a":"Tentu, setiap paket punya jatah revisi. Saya pastikan hasil sesuai visi Anda."},{"q":"File format apa yang dikirim?","a":"PNG/JPG siap upload + source file Figma/PSD agar Anda fleksibel edit nanti."}]'::jsonb,
 2, true, '2024-01-01T00:00:00.000Z'),
('svc-video', 'video', 'Clapperboard', 'Editing Video',
 'Editing video konten maupun komersial: cinematic, reels, dan video promosi produk.',
 array['Reels/TikTok','Promo produk','Color grading','Subtitle'],
 'Video yang well-edited bisa melipatgandakan engagement. Saya mengedit dengan ritme yang tepat, color grading yang menggugah, dan sound design yang imersif — untuk reels, iklan, maupun konten YouTube.',
 array['Editing (cut, transition, pacing)','Color grading sesuai mood','Sound design (SFX + musik)','Subtitle/caption burned-in','Motion graphics dasar','Export multi-format (Reels, 16:9, dll)'],
 array['Adobe Premiere Pro','After Effects','DaVinci Resolve','CapCut'],
 '[{"name":"Basic","tagline":"Reels/TikTok 30-60dtk","perks":["1 video pendek","Subtitle","1x revisi"]},{"name":"Standard","tagline":"Iklan produk","perks":["Video 30-90dtk","Color grading","Motion graphics","Revisi 3x"],"featured":true},{"name":"Premium","tagline":"Full production","perks":["Video panjang (>2mnt)","Advanced VFX","Voice over sync","Multi-format export","Revisi 5x"]}]'::jsonb,
 '[{"q":"Apakah footage harus saya sediakan?","a":"Ya, klien menyediakan footage mentah. Saya bisa rekomendasikan stock footage bila perlu."},{"q":"Berapa ukuran file maksimal footage?","a":"Tidak ada batas keras, tapi sebaiknya via Google Drive/Dropbox. Saya guide proses transfer-nya."},{"q":"Bisa edit ulang setelah final?","a":"Final approval berarti selesai. Revisi kecil di dalam 7 hari gratis; di luar itu add-on."}]'::jsonb,
 3, true, '2024-01-01T00:00:00.000Z'),
('svc-voice', 'voice', 'Mic', 'Voice Over',
 'Pengisian suara untuk iklan, konten, narasi, dan e-learning dengan nada yang pas.',
 array['Iklan radio','Narasi video','Audiobook','Dubbing'],
 'Suara yang tepat bisa mengangkat pesan Anda ke level berikutnya. Saya menyediakan voice over dengan nada yang bisa disesuaikan — profesional, hangat, energik, atau santai — untuk iklan, narasi korporat, dan konten edukasi.',
 array['Konsultasi nada & gaya baca','Rekaman dengan mic kondenser studio','Cleaning noise & mastering loudness','Format sesuai platform (WAV/MP3)','2 take per baris untuk pilihan','Revisi minor 2x'],
 array['Audacity','Adobe Audition','Audio-Technica AT2020'],
 '[{"name":"Basic","tagline":"Spot iklan 30dtk","perks":["Durasi <1 mnt","1 gaya baca","1x revisi"]},{"name":"Standard","tagline":"Narasi/konten","perks":["Durasi 1-5 mnt","Multitrack","Revisi 2x"],"featured":true},{"name":"Premium","tagline":"Audiobook/e-learning","perks":["Durasi >5 mnt","Konsistensi episode","Mastering premium","Revisi 3x"]}]'::jsonb,
 '[{"q":"Bagaimana cara kirim naskah?","a":"Cukup kirim via WhatsApp/email dalam format Google Doc atau teks biasa dengan catatan intonasi bila perlu."},{"q":"Apakah ada sample suara?","a":"Ada. Saya kirim reel demo berbagai gaya baca sebelum kita deal."},{"q":"Berapa lama pengerjaan?","a":"Spot pendek 1-2 hari, konten panjang 3-7 hari tergantung durasi dan kompleksitas."}]'::jsonb,
 4, true, '2024-01-01T00:00:00.000Z')
on conflict (id) do nothing;

-- ============================================================================
-- DONE.  Verify in the Table Editor — you should see data in all 13 tables.
-- ============================================================================
