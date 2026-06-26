import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, parseJsonBody } from "@/lib/api-helpers";
import { blogSchema } from "@/lib/validations";
import {
  createBlogPost,
  getBlogPosts,
  type BlogPostInput,
} from "@/lib/data/blog";

export async function GET() {
  const auth = await requireAdmin();
  if (auth) return auth;
  const posts = await getBlogPosts();
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
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

  const post = await createBlogPost(result.data as BlogPostInput);
  revalidatePath("/", "layout");
  return NextResponse.json({ post }, { status: 201 });
}
