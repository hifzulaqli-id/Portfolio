import type { ContentBlock } from "@/types";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function getAllContentBlocks(): Promise<ContentBlock[]> {
  const sb = await createClient();
  if (!sb) return [];

  const { data } = await sb.from("content_blocks").select("*").order("section", { ascending: true });
  return (data as ContentBlock[]) ?? [];
}

export async function getContentBlock(key: string): Promise<ContentBlock | null> {
  const sb = await createClient();
  if (!sb) return null;

  const { data } = await sb.from("content_blocks").select("*").eq("key", key).single();
  return (data as ContentBlock) ?? null;
}

export async function getContentBlocksBySection(
  section: string
): Promise<ContentBlock[]> {
  const sb = await createClient();
  if (!sb) return [];

  const { data } = await sb.from("content_blocks").select("*").eq("section", section);
  return (data as ContentBlock[]) ?? [];
}

export async function upsertContentBlock(
  key: string,
  value: string | string[] | Record<string, unknown>[]
): Promise<ContentBlock | null> {
  const sb = createServiceClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from("content_blocks")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("key", key)
    .select()
    .single();

  if (error) return null;
  return data as ContentBlock;
}
