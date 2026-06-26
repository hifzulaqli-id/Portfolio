import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/api-helpers";
import { toggleBlogStatus } from "@/lib/data/blog";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth) return auth;
  const post = await toggleBlogStatus(params.id);
  revalidatePath("/", "layout");
  return NextResponse.json({ post });
}
