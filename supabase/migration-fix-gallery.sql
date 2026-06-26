-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  MIGRATION: gallery_urls (text[]) → gallery (jsonb)                     ║
-- ║  tech_stack (text[]) → tech_stack (jsonb)                              ║
-- ║  Run ini di Supabase SQL Editor                                        ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- ─── STEP 1: Tambah kolom gallery (jsonb) jika belum ada ──────────────────
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'projects' and column_name = 'gallery'
  ) then
    alter table public.projects add column gallery jsonb not null default '[]';
  end if;
end $$;

-- ─── STEP 2: Migrasi data lama gallery_urls → gallery ────────────────────
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'projects' and column_name = 'gallery_urls'
  ) then
    update public.projects set gallery = (
      select coalesce(
        jsonb_agg(jsonb_build_object('url', elem, 'caption', '')),
        '[]'::jsonb
      )
      from unnest(gallery_urls) as elem
    )
    where gallery = '[]'::jsonb and gallery_urls is not null and gallery_urls != '{}';

    alter table public.projects drop column gallery_urls;

    raise notice '✅ gallery_urls berhasil di-migrate ke gallery (jsonb)';
  else
    raise notice 'ℹ️  Kolom gallery_urls tidak ditemukan — skip step 2';
  end if;
end $$;

-- ─── STEP 3: Konversi tech_stack dari text[] ke jsonb [{name, icon}] ─────
-- (Pendekatan aman: rename → add → update → drop. ALTER USING tidak bisa pakai aggregate+unnest)
do $$
begin
  -- Cek apakah tech_stack masih type text[] (array of text)
  if exists (
    select 1 from information_schema.columns
    where table_name = 'projects'
      and column_name = 'tech_stack'
      and data_type = 'ARRAY'
      and udt_name = '_text'
  ) then
    -- 3a. Rename kolom lama
    alter table public.projects rename column tech_stack to tech_stack_old;

    -- 3b. Buat kolom baru dengan type jsonb
    alter table public.projects add column tech_stack jsonb not null default '[]';

    -- 3c. Isi kolom baru dari data lama (konversi setiap string → {name, icon})
    update public.projects set tech_stack = (
      select coalesce(
        jsonb_agg(jsonb_build_object('name', elem, 'icon', 'Code2')),
        '[]'::jsonb
      )
      from unnest(tech_stack_old) as elem
    );

    -- 3d. Drop kolom lama
    alter table public.projects drop column tech_stack_old;

    raise notice '✅ tech_stack berhasil dikonversi dari text[] ke jsonb';
  else
    raise notice 'ℹ️  tech_stack sudah jsonb — skip step 3';
  end if;
end $$;

-- ─── STEP 4: Validasi — tampilkan hasil akhir ────────────────────────────
select
  id,
  title,
  jsonb_array_length(gallery) as gallery_count,
  jsonb_array_length(tech_stack) as tech_count,
  case when gallery = '[]'::jsonb then '⚠️ KOSONG' else '✅ OK' end as gallery_status
from public.projects
order by display_order;

-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  SELESAI!                                                               ║
-- ║  Output query terakhir akan tampilkan:                                  ║
-- ║   - jumlah gambar per project (gallery_count)                           ║
-- ║   - jumlah teknologi per project (tech_count)                           ║
-- ║   - status gallery (KOSONG = perlu isi ulang lewat admin)              ║
-- ╚══════════════════════════════════════════════════════════════════════╝
