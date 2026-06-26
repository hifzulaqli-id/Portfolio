import type { SiteSettings } from "@/types";
import { SEED_DATA } from "./seed";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function getSettings(): Promise<SiteSettings> {
  const sb = await createClient();
  if (!sb) return SEED_DATA.settings;

  const { data } = await sb.from("settings").select("*").eq("id", 1).single();
  return (data as SiteSettings) ?? SEED_DATA.settings;
}

export async function updateSettings(
  patch: Partial<SiteSettings>
): Promise<SiteSettings> {
  const sb = createServiceClient();
  if (!sb) throw new Error("Database not configured");

  const { data, error } = await sb
    .from("settings")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", 1)
    .select()
    .single();

  if (error) throw error;
  return data as SiteSettings;
}
