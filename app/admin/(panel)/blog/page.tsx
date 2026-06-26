import { getBlogPosts } from "@/lib/data/blog";
import { BlogManager } from "@/components/admin/blog-manager";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();
  return <BlogManager posts={posts} />;
}
