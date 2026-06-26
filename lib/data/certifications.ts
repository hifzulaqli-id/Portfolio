import type { Certification } from "@/types";
import { createClient, createServiceClient } from "@/lib/supabase/server";

function genId(): string {
  return "c-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
}

export async function getCertifications(opts?: {
  publicOnly?: boolean;
  category?: Certification["category"];
}): Promise<Certification[]> {
  const sb = await createClient();
  if (!sb) return [];

  let query = sb.from("certifications").select("*").order("display_order", { ascending: true });

  if (opts?.publicOnly) {
    query = query.eq("is_public", true);
  }
  if (opts?.category) {
    query = query.eq("category", opts.category);
  }

  const { data } = await query;
  return (data as Certification[]) ?? [];
}

export async function getCertification(id: string): Promise<Certification | null> {
  const sb = await createClient();
  if (!sb) return null;

  const { data } = await sb.from("certifications").select("*").eq("id", id).single();
  return (data as Certification) ?? null;
}

export type CertificationInput = Omit<Certification, "id" | "created_at">;

export async function createCertification(
  input: CertificationInput
): Promise<Certification> {
  const sb = createServiceClient();
  if (!sb) throw new Error("Database not configured");

  const cert = {
    ...input,
    id: genId(),
    created_at: new Date().toISOString(),
  };

  const { data, error } = await sb.from("certifications").insert(cert).select().single();
  if (error) throw error;
  return data as Certification;
}

export async function updateCertification(
  id: string,
  patch: Partial<Certification>
): Promise<Certification | null> {
  const sb = createServiceClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from("certifications")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return null;
  return data as Certification;
}

export async function deleteCertification(id: string): Promise<boolean> {
  const sb = createServiceClient();
  if (!sb) return false;

  const { error } = await sb.from("certifications").delete().eq("id", id);
  return !error;
}
