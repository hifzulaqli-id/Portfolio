import type { Experience } from "@/types";
import { createClient, createServiceClient } from "@/lib/supabase/server";

function genId(): string {
  return "e-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
}

export async function getExperiences(opts?: {
  activeOnly?: boolean;
  type?: Experience["type"];
}): Promise<Experience[]> {
  const sb = await createClient();
  if (!sb) return [];

  let query = sb.from("experiences").select("*").order("start_date", { ascending: false });

  if (opts?.activeOnly) {
    query = query.eq("is_active", true);
  }
  if (opts?.type) {
    query = query.eq("type", opts.type);
  }

  const { data } = await query;
  return (data as Experience[]) ?? [];
}

export async function getExperience(id: string): Promise<Experience | null> {
  const sb = await createClient();
  if (!sb) return null;

  const { data } = await sb.from("experiences").select("*").eq("id", id).single();
  return (data as Experience) ?? null;
}

export type ExperienceInput = Omit<Experience, "id" | "created_at">;

export async function createExperience(
  input: ExperienceInput
): Promise<Experience> {
  const sb = createServiceClient();
  if (!sb) throw new Error("Database not configured");

  const exp = {
    ...input,
    id: genId(),
    created_at: new Date().toISOString(),
  };

  const { data, error } = await sb.from("experiences").insert(exp).select().single();
  if (error) throw error;
  return data as Experience;
}

export async function updateExperience(
  id: string,
  patch: Partial<Experience>
): Promise<Experience | null> {
  const sb = createServiceClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from("experiences")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return null;
  return data as Experience;
}

export async function toggleExperienceActive(id: string): Promise<Experience | null> {
  const sb = createServiceClient();
  if (!sb) return null;

  const { data: current } = await sb.from("experiences").select("is_active").eq("id", id).single();
  if (!current) return null;

  const { data, error } = await sb
    .from("experiences")
    .update({ is_active: !current.is_active })
    .eq("id", id)
    .select()
    .single();

  if (error) return null;
  return data as Experience;
}

export async function deleteExperience(id: string): Promise<boolean> {
  const sb = createServiceClient();
  if (!sb) return false;

  const { error } = await sb.from("experiences").delete().eq("id", id);
  return !error;
}
