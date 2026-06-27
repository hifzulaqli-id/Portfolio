import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { projectSchema } from "@/lib/validations";
import {
  deleteProject,
  toggleProjectStatus,
  updateProject,
} from "@/lib/data/projects";

async function ensureAuth() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await ensureAuth();
  if (auth) return auth;

  try {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const sb = await createServiceClient();
    if (!sb) return NextResponse.json({ error: "DB Error" }, { status: 500 });

    const { data, error } = await sb.from("projects").select("*").eq("id", params.id).single();
    if (error) throw error;
    
    // We need to apply the migrateProjectRow logic
    const { migrateProjectRow } = await import("@/lib/data/projects");
    const project = migrateProjectRow(data as Record<string, unknown>);
    
    return NextResponse.json({ project });
  } catch (err) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await ensureAuth();
  if (auth) return auth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    console.error("[PUT /api/admin/projects/:id] Validation failed:", fieldErrors);
    return NextResponse.json(
      { error: "Validasi gagal", details: fieldErrors },
      { status: 422 }
    );
  }

  const d = parsed.data;

  try {
    const project = await updateProject(params.id, {
      title: d.title,
      slug: d.slug,
      category: d.category,
      design_type: d.design_type,
      description: d.description,
      content: d.content,
      tech_stack: d.tech_stack,
      thumbnail_url: d.thumbnail_url,
      media_url: d.media_url,
      gallery: d.gallery,
      links: d.links,
      live_url: d.live_url,
      github_url: d.github_url,
      status: d.status,
      display_order: d.display_order,
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ project });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal menyimpan proyek";
    console.error("[PUT /api/admin/projects/:id] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await ensureAuth();
  if (auth) return auth;

  try {
    await deleteProject(params.id);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal menghapus proyek";
    console.error("[DELETE /api/admin/projects/:id] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
