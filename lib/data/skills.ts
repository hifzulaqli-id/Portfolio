import type { Skill } from "@/types";
import { createClient, createServiceClient } from "@/lib/supabase/server";

function genId(prefix: string): string {
  return (
    prefix +
    "-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 7)
  );
}

export async function getSkills(opts?: { activeOnly?: boolean }): Promise<Skill[]> {
  const sb = await createClient();
  if (!sb) return [];

  let query = sb.from("skills").select("*").order("display_order", { ascending: true });

  if (opts?.activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data } = await query;
  return (data as Skill[]) ?? [];
}

export async function getSkill(id: string): Promise<Skill | null> {
  const sb = await createClient();
  if (!sb) return null;

  const { data } = await sb.from("skills").select("*").eq("id", id).single();
  return (data as Skill) ?? null;
}

export type SkillInput = Omit<Skill, "id" | "created_at">;

export async function createSkill(input: SkillInput): Promise<Skill> {
  const sb = createServiceClient();
  if (!sb) throw new Error("Database not configured");

  const skill = {
    ...input,
    id: genId("sk"),
    created_at: new Date().toISOString(),
  };

  const { data, error } = await sb.from("skills").insert(skill).select().single();
  if (error) throw error;
  return data as Skill;
}

export async function updateSkill(
  id: string,
  patch: Partial<Skill>
): Promise<Skill | null> {
  const sb = createServiceClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from("skills")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return null;
  return data as Skill;
}

export async function toggleSkillActive(id: string): Promise<Skill | null> {
  const sb = createServiceClient();
  if (!sb) return null;

  const { data: current } = await sb.from("skills").select("is_active").eq("id", id).single();
  if (!current) return null;

  const { data, error } = await sb
    .from("skills")
    .update({ is_active: !current.is_active })
    .eq("id", id)
    .select()
    .single();

  if (error) return null;
  return data as Skill;
}

export async function deleteSkill(id: string): Promise<boolean> {
  const sb = createServiceClient();
  if (!sb) return false;

  const { error } = await sb.from("skills").delete().eq("id", id);
  return !error;
}
