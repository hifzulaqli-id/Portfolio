import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { projectSchema } from "@/lib/validations";
import {
  createProject,
  getProjects,
  type ProjectInput,
} from "@/lib/data/projects";

async function ensureAuth() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const auth = await ensureAuth();
  if (auth) return auth;
  const projects = await getProjects();
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
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
    console.error("[POST /api/admin/projects] Validation failed:", fieldErrors);
    return NextResponse.json(
      { error: "Validasi gagal", details: fieldErrors },
      { status: 422 }
    );
  }

  const d = parsed.data;
  const input: ProjectInput = {
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
  };

  try {
    const project = await createProject(input);
    revalidatePath("/", "layout");
    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal membuat proyek";
    console.error("[POST /api/admin/projects] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
