import type { Project } from "@/types";
import { slugify } from "@/lib/utils";
import { createClient, createServiceClient } from "@/lib/supabase/server";

/** Migrate old Supabase row format to new format on-the-fly */
function migrateProjectRow(row: Record<string, unknown>): Project {
  const p = { ...row };

  // gallery_urls: text[] → gallery: jsonb
  if ("gallery_urls" in p && !("gallery" in p)) {
    const oldUrls = Array.isArray(p.gallery_urls) ? (p.gallery_urls as string[]) : [];
    p.gallery = oldUrls.map((url: string) => ({ url, caption: "" }));
    delete p.gallery_urls;
  }

  // tech_stack: text[] → jsonb [{name, icon}]
  if (Array.isArray(p.tech_stack) && p.tech_stack.length > 0 && typeof p.tech_stack[0] === "string") {
    p.tech_stack = (p.tech_stack as string[]).map((name: string) => ({
      name,
      icon: "Code2",
    }));
  }

  // Ensure links exists (legacy rows may not have it)
  if (!p.links) p.links = [];

  return p as unknown as Project;
}

export async function getProjects(opts?: {
  publishedOnly?: boolean;
  category?: Project["category"];
}): Promise<Project[]> {
  const sb = await createClient();
  if (!sb) return [];
  
  let query = sb.from("projects").select("*").order("display_order", { ascending: true });
  
  if (opts?.publishedOnly) {
    query = query.eq("status", "published");
  }
  if (opts?.category) {
    query = query.eq("category", opts.category);
  }
  
  const { data } = await query;
  return (data ?? []).map((row) => migrateProjectRow(row as Record<string, unknown>));
}

export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  const all = await getProjects({ publishedOnly: true });
  return all.slice(0, limit);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const sb = await createClient();
  if (!sb) return null;
  const { data } = await sb.from("projects").select("*").eq("slug", slug).single();
  if (!data) return null;
  return migrateProjectRow(data as Record<string, unknown>);
}

export async function getProjectNeighbors(
  slug: string
): Promise<{ prev: Project | null; next: Project | null }> {
  const all = await getProjects({ publishedOnly: true });
  const idx = all.findIndex((p) => p.slug === slug);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null,
  };
}

export async function getAllSlugs(): Promise<string[]> {
  const all = await getProjects({ publishedOnly: true });
  return all.map((p) => p.slug);
}

function genId(): string {
  return (
    "p-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 7)
  );
}

export type ProjectInput = Omit<
  Project,
  "id" | "created_at" | "display_order" | "slug"
> &
  Partial<Pick<Project, "display_order" | "slug">>;

export async function createProject(input: ProjectInput): Promise<Project> {
  const sb = createServiceClient();
  if (!sb) throw new Error("Database error");

  const slug =
    input.slug && input.slug.trim()
      ? slugify(input.slug)
      : slugify(input.title);

  const { data: maxData } = await sb
    .from("projects")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);
    
  const maxOrder = maxData && maxData.length > 0 ? maxData[0].display_order : 0;

  const project = {
    id: genId(),
    title: input.title,
    slug,
    category: input.category,
    design_type: input.design_type ?? null,
    description: input.description,
    content: input.content ?? "",
    tech_stack: input.tech_stack ?? [],
    thumbnail_url: input.thumbnail_url,
    gallery: input.gallery ?? [],
    links: input.links ?? [],
    live_url: input.live_url ?? null,
    github_url: input.github_url ?? null,
    status: input.status,
    display_order: input.display_order ?? maxOrder + 1,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await sb.from("projects").insert(project).select().single();
  if (error) {
    console.error("[createProject] Supabase error:", error.message, error.details);
    throw new Error(error.message);
  }
  return migrateProjectRow(data as Record<string, unknown>);
}

export async function updateProject(
  id: string,
  patch: Partial<Project>
): Promise<Project> {
  const sb = createServiceClient();
  if (!sb) throw new Error("Database error");

  let updateData = { ...patch };
  if (patch.slug && patch.slug.trim()) {
    updateData.slug = slugify(patch.slug);
  }

  const { data, error } = await sb.from("projects").update(updateData).eq("id", id).select().single();
  if (error) {
    console.error("[updateProject] Supabase error:", error.message, error.details);
    throw new Error(error.message);
  }
  if (!data) throw new Error("Proyek tidak ditemukan setelah update");

  return migrateProjectRow(data as Record<string, unknown>);
}

export async function toggleProjectStatus(id: string): Promise<Project> {
  const sb = createServiceClient();
  if (!sb) throw new Error("Database error");

  const { data: current, error: fetchErr } = await sb.from("projects").select("status").eq("id", id).single();
  if (fetchErr || !current) throw new Error("Proyek tidak ditemukan");

  const { data, error } = await sb
    .from("projects")
    .update({ status: current.status === "published" ? "draft" : "published" })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) throw new Error("Gagal mengubah status");
  return migrateProjectRow(data as Record<string, unknown>);
}

export async function deleteProject(id: string): Promise<boolean> {
  const sb = createServiceClient();
  if (!sb) throw new Error("Database error");
  
  const { error } = await sb.from("projects").delete().eq("id", id);
  if (error) {
    console.error("[deleteProject] Supabase error:", error.message);
    throw new Error(error.message);
  }
  return true;
}
