import type { Service, ProjectCategory } from "@/types";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function getServices(opts?: {
  activeOnly?: boolean;
}): Promise<Service[]> {
  const sb = await createClient();
  if (!sb) return [];

  let query = sb.from("services").select("*").order("display_order", { ascending: true });

  if (opts?.activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data } = await query;
  return (data as Service[]) ?? [];
}

export async function getService(category: ProjectCategory): Promise<Service | null> {
  const sb = await createClient();
  if (!sb) return null;

  const { data } = await sb.from("services").select("*").eq("category", category).single();
  return (data as Service) ?? null;
}

export type ServiceInput = Omit<
  Service,
  "id" | "category" | "created_at"
>;

export async function updateService(
  category: ProjectCategory,
  patch: Partial<ServiceInput>
): Promise<Service | null> {
  const sb = createServiceClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from("services")
    .update(patch)
    .eq("category", category)
    .select()
    .single();

  if (error) return null;
  return data as Service;
}
