import type { BlogPost } from "@/types";
import { slugify } from "@/lib/utils";
import { estimateReadingTime } from "@/lib/blog-utils";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export { estimateReadingTime };

function genId(): string {
  return "b-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
}

export async function getBlogPosts(opts?: {
  publishedOnly?: boolean;
  category?: string;
}): Promise<BlogPost[]> {
  const sb = await createClient();
  if (!sb) return [];

  let query = sb.from("blog_posts").select("*").order("created_at", { ascending: false });

  if (opts?.publishedOnly) {
    query = query.eq("status", "published");
  }
  if (opts?.category) {
    query = query.eq("category", opts.category);
  }

  const { data } = await query;
  return (data as BlogPost[])?.sort(
    (a, b) =>
      new Date(b.published_at ?? b.created_at).getTime() -
      new Date(a.published_at ?? a.created_at).getTime()
  ) ?? [];
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const sb = await createClient();
  if (!sb) return null;

  const { data } = await sb.from("blog_posts").select("*").eq("slug", slug).single();
  return (data as BlogPost) ?? null;
}

export async function getBlogSlugs(): Promise<string[]> {
  const all = await getBlogPosts({ publishedOnly: true });
  return all.map((p) => p.slug);
}

export async function getBlogCategories(): Promise<string[]> {
  const sb = await createClient();
  if (!sb) return [];

  // Group by category isn't directly exposed nicely without RPC, so we fetch and map
  const { data } = await sb.from("blog_posts").select("category").not("category", "is", null);
  
  const set = new Set<string>();
  data?.forEach((p) => p.category && set.add(p.category));
  return Array.from(set);
}

export type BlogPostInput = Omit<
  BlogPost,
  "id" | "created_at" | "updated_at" | "slug" | "reading_time"
> &
  Partial<Pick<BlogPost, "slug" | "reading_time">>;

export async function createBlogPost(input: BlogPostInput): Promise<BlogPost> {
  const sb = createServiceClient();
  if (!sb) throw new Error("Database not configured");

  const now = new Date().toISOString();
  const slug =
    input.slug && input.slug.trim()
      ? slugify(input.slug)
      : slugify(input.title);

  const post = {
    id: genId(),
    title: input.title,
    slug,
    category: input.category ?? null,
    thumbnail_url: input.thumbnail_url ?? null,
    excerpt: input.excerpt ?? null,
    content: input.content ?? null,
    tags: input.tags ?? [],
    reading_time: input.reading_time || estimateReadingTime(input.content ?? ""),
    status: input.status,
    is_featured: input.is_featured,
    published_at: input.published_at ?? (input.status === "published" ? now : null),
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await sb.from("blog_posts").insert(post).select().single();
  if (error) throw error;
  return data as BlogPost;
}

export async function updateBlogPost(
  id: string,
  patch: Partial<BlogPost>
): Promise<BlogPost | null> {
  const sb = createServiceClient();
  if (!sb) return null;

  let updateData = { ...patch, updated_at: new Date().toISOString() };

  if (patch.slug && patch.slug.trim()) {
    updateData.slug = slugify(patch.slug);
  }

  if (patch.content !== undefined && patch.reading_time === undefined) {
    updateData.reading_time = estimateReadingTime(patch.content ?? "");
  }

  const { data, error } = await sb
    .from("blog_posts")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) return null;
  return data as BlogPost;
}

export async function toggleBlogStatus(id: string): Promise<BlogPost | null> {
  const sb = createServiceClient();
  if (!sb) return null;

  const { data: current } = await sb.from("blog_posts").select("status, published_at").eq("id", id).single();
  if (!current) return null;

  const newStatus = current.status === "published" ? "draft" : "published";
  
  return updateBlogPost(id, {
    status: newStatus,
    published_at:
      newStatus === "published"
        ? current.published_at ?? new Date().toISOString()
        : current.published_at,
  });
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const sb = createServiceClient();
  if (!sb) return false;

  const { error } = await sb.from("blog_posts").delete().eq("id", id);
  return !error;
}
