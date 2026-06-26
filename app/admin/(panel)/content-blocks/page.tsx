import { getAllContentBlocks } from "@/lib/data/content-blocks";
import { ContentBlockManager } from "@/components/admin/content-block-manager";

export const dynamic = "force-dynamic";

export default async function AdminContentBlocksPage() {
  const blocks = await getAllContentBlocks();
  return <ContentBlockManager blocks={blocks} />;
}
