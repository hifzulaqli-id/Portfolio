import type { Testimonial } from "@/types";
import { createClient, createServiceClient } from "@/lib/supabase/server";

function genId(): string {
  return (
    "t-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 7)
  );
}

export async function getTestimonials(opts?: {
  visibleOnly?: boolean;
}): Promise<Testimonial[]> {
  const sb = await createClient();
  if (!sb) return [];

  let query = sb.from("testimonials").select("*").order("created_at", { ascending: false });

  if (opts?.visibleOnly) {
    query = query.eq("is_visible", true);
  }

  const { data } = await query;
  return (data as Testimonial[]) ?? [];
}

export async function getTestimonial(id: string): Promise<Testimonial | null> {
  const sb = await createClient();
  if (!sb) return null;

  const { data } = await sb.from("testimonials").select("*").eq("id", id).single();
  return (data as Testimonial) ?? null;
}

export async function getVisibleTestimonialCount(): Promise<number> {
  const sb = await createClient();
  if (!sb) return 0;

  const { count } = await sb
    .from("testimonials")
    .select("*", { count: "exact", head: true })
    .eq("is_visible", true);

  return count ?? 0;
}

export async function createTestimonial(
  input: Omit<Testimonial, "id" | "created_at">
): Promise<Testimonial> {
  const sb = createServiceClient();
  if (!sb) throw new Error("Database not configured");

  const t = {
    ...input,
    id: genId(),
    created_at: new Date().toISOString(),
  };

  const { data, error } = await sb.from("testimonials").insert(t).select().single();
  if (error) throw error;
  return data as Testimonial;
}

export type TestimonialInput = Omit<Testimonial, "id" | "created_at">;

export async function updateTestimonial(
  id: string,
  patch: Partial<Testimonial>
): Promise<Testimonial | null> {
  const sb = createServiceClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from("testimonials")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return null;
  return data as Testimonial;
}

export async function toggleTestimonialVisible(
  id: string
): Promise<Testimonial | null> {
  const sb = createServiceClient();
  if (!sb) return null;

  const { data: current } = await sb.from("testimonials").select("is_visible").eq("id", id).single();
  if (!current) return null;

  const { data, error } = await sb
    .from("testimonials")
    .update({ is_visible: !current.is_visible })
    .eq("id", id)
    .select()
    .single();

  if (error) return null;
  return data as Testimonial;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const sb = createServiceClient();
  if (!sb) return false;

  const { error } = await sb.from("testimonials").delete().eq("id", id);
  return !error;
}
