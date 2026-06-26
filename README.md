# Portfolio — Mahasiswa Informatika

Web portfolio profesional untuk mahasiswa Informatika yang menawarkan 4 layanan:
**Web Developer**, **Design Ads Instagram**, **Editing Video**, dan **Voice Over**.

Dibangun dengan **Next.js 14 (App Router) + TypeScript + Tailwind CSS**. Punya
situs publik lengkap (landing, galeri proyek, detail proyek, kontak) **plus**
panel admin terproteksi (dashboard, CRUD proyek, pesan masuk, edit profil).

Saat ini berjalan di atas **mock JSON store** — semuanya langsung jalan tanpa
setup backend. Klien Supabase sudah terpasang dan siap dipakai (lihat
[Switch to Supabase](#-switch-ke-supabase)).

---

## 🚀 Menjalankan Secara Lokal

```bash
# 1. Install dependencies
npm install

# 2. (opsional) buat .env.local dari contoh
cp .env.example .env.local

# 3. Jalankan dev server
npm run dev
```

Buka **http://localhost:3000**.

### Login Admin

Buka **http://localhost:3000/admin/login**

```
Email:    admin@portfolio.local
Password: admin123
```

Ubah kredensial ini via `ADMIN_EMAIL` / `ADMIN_PASSWORD` di `.env.local`.

---

## 📂 Struktur Proyek

```
app/
├── page.tsx                  # Landing page
├── projects/
│   ├── page.tsx              # Galeri semua proyek
│   └── [slug]/page.tsx       # Detail proyek (ISR)
├── contact/page.tsx          # Form kontak
├── admin/
│   ├── layout.tsx            # Guard auth + sidebar
│   ├── login/page.tsx
│   ├── page.tsx              # Dashboard
│   ├── projects/page.tsx     # CRUD proyek
│   ├── messages/page.tsx     # Pesan masuk
│   └── profile/page.tsx      # Edit profil
└── api/                      # Route handlers (contact, auth, admin)
components/
├── ui/                       # shadcn/ui primitives
├── layout/                   # Navbar, Footer, PublicShell
├── sections/                 # Hero, Services, Portfolio, dll
├── admin/                    # Sidebar, ProjectForm, dll
└── shared/                   # ProjectCard, ThemeToggle, dll
lib/
├── data/                     # Mock store + access functions
│   ├── store.ts              # JSON file store
│   └── seed.ts               # Initial placeholder data
├── supabase/                 # client.ts + server.ts (ready to use)
├── auth.ts                   # Mock cookie auth
├── validations.ts            # Zod schemas
└── utils.ts
middleware.ts                 # Protects /admin/*
```

---

## 🎨 Design System

| Token | Nilai | Pemakaian |
|-------|-------|-----------|
| Background | `#0A0A0F` | Latar utama (dark default) |
| Surface | `#13131A` | Card |
| Primary | `#6C63FF` | Accent ungu elektrik |
| Secondary | `#00D4AA` | Accent teal/mint |
| Text | `#F0F0F5` / `#8888A0` | Utama / sekunder |
| Border | `#1E1E2E` | Divider |

Font: **Space Grotesk** (display), **Inter** (body), **JetBrains Mono** (label).
Dark mode sebagai default, dengan toggle light mode.

---

## 🧩 Fitur

**Publik**
- Landing page: Hero (typewriter), About, Services (glass cards), Portfolio
  (filter kategori), Process (timeline), Testimonials, Contact CTA
- Galeri proyek dengan filter per kategori
- Detail proyek: galeri, tech stack, navigasi prev/next, ISR
- Form kontak dengan validasi Zod + toast notifikasi
- Fully responsive, dark/light mode, animasi Framer Motion ringan

**Admin** (protected via middleware)
- Dashboard: statistik, chart proyek per kategori, pesan terbaru
- CRUD proyek (dialog form: tech tags, gallery, status publish/draft)
- Manajemen pesan: baca, tandai dibaca, arsip, hapus
- Edit profil: bio, skills, sosial media, statistik

---

## 🔄 Switch ke Supabase

Mock store di `lib/data/` bekerja sempurna untuk development lokal. Untuk
produksi (Vercel, filesystem read-only), pindahkan ke Supabase:

1. **Buat project Supabase** → jalankan SQL di **`supabase/schema.sql`**
   melalui SQL Editor.

2. **Set environment variables** di `.env.local` (dan di Vercel):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx...
   SUPABASE_SERVICE_ROLE_KEY=eyJxxxx...
   ```

3. **Ganti implementasi** fungsi di `lib/data/*.ts` untuk memakai
   `lib/supabase/server.ts`. Signature-nya sudah identik dengan mock —
   cukup ganti isi fungsi. Contoh:
   ```ts
   // lib/data/projects.ts
   import { createClient } from "@/lib/supabase/server";
   export async function getProjects() {
     const sb = await createClient();
     if (!sb) return []; // fallback
     const { data } = await sb.from("projects").select("*");
     return data ?? [];
   }
   ```

4. **Auth:** ganti mock cookie auth di `lib/auth.ts` dengan
   `supabase.auth.signInWithPassword()`. Middleware tetap berfungsi
   dengan penyesuaian pengecekan session.

5. **Upload gambar:** Admin panel kini support upload gambar langsung (auto-compressed
   ke base64, max 400px width, ~300KB). Dalam mock mode, base64 disimpan di JSON store.
   Saat migrasi ke Supabase, bisa:
   - Tetap simpan base64 di kolom text DB, ATAU
   - Migrate ke Supabase Storage: decode base64 → upload ke bucket → simpan public URL
   
   ImageInput component (`components/admin/image-input.tsx`) berfungsi untuk kedua mode.

---

## ▲ Deploy ke Vercel

1. Push repo ke GitHub.
2. Import ke [vercel.com](https://vercel.com).
3. Set environment variables (lihat `.env.example`).
4. Deploy otomatis tiap push ke `main`.

> Catatan: di Vercel, filesystem read-only → mock store tidak persist.
> Pakai Supabase (langkah di atas) untuk produksi.

---

## 🛠️ Teknologi

Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui (hand-written) ·
Framer Motion · React Hook Form · Zod · Supabase (client) ·
Lucide Icons · next-themes · Recharts · Sonner

Semua free / open-source. Tidak ada dependency berbayar.

---

## 📝 Catatan

- Data placeholder memakai nama fiktif "Budi Santoso". Edit via admin panel
  (`/admin/profile`) atau langsung di `lib/data/seed.ts`.
- Reset data mock kapan saja: hapus file `lib/data/store.json` — akan
  ter-seed ulang otomatis saat server berjalan.
