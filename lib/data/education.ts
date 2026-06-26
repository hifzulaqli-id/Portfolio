import type { Education } from "@/types";
import { createClient, createServiceClient } from "@/lib/supabase/server";

function genId(): string {
  return "ed-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
}

export async function getEducation(opts?: {
  type?: Education["type"];
}): Promise<Education[]> {
  const sb = await createClient();
  if (!sb) return [];

  let query = sb.from("education").select("*").order("start_year", { ascending: false });

  if (opts?.type) {
    query = query.eq("type", opts.type);
  }

  const { data } = await query;
  return (data as Education[]) ?? [];
}

export async function getEducationItem(id: string): Promise<Education | null> {
  const sb = await createClient();
  if (!sb) return null;

  const { data } = await sb.from("education").select("*").eq("id", id).single();
  return (data as Education) ?? null;
}

export type EducationInput = Omit<Education, "id" | "created_at">;

export async function createEducation(input: EducationInput): Promise<Education> {
  const sb = createServiceClient();
  if (!sb) throw new Error("Database not configured");

  const edu = {
    ...input,
    id: genId(),
    created_at: new Date().toISOString(),
  };

  const { data, error } = await sb.from("education").insert(edu).select().single();
  if (error) throw error;
  return data as Education;
}

export async function updateEducation(
  id: string,
  patch: Partial<Education>
): Promise<Education | null> {
  const sb = createServiceClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from("education")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return null;
  return data as Education;
}

export async function deleteEducation(id: string): Promise<boolean> {
  const sb = createServiceClient();
  if (!sb) return false;

  const { error } = await sb.from("education").delete().eq("id", id);
  return !error;
}
