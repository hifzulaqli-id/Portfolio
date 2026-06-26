import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, parseJsonBody } from "@/lib/api-helpers";
import { blogSchema } from "@/lib/validations";
import { deleteBlogPost, updateBlogPost } from "@/lib/data/blog";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.response;

  const result = blogSchema.safeParse(parsed.data);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validasi gagal", issues: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const post = await updateBlogPost(params.id, result.data);
  revalidatePath("/", "layout");
  return NextResponse.json({ post });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth) return auth;
  const ok = await deleteBlogPost(params.id);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok });
}
