import type { Profile } from "@/types";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function getProfile(): Promise<Profile> {
  const sb = await createClient();
  // Fallback to default if somehow database fails or not configured yet
  const fallback: Profile = {
    id: 1,
    full_name: "Budi Santoso",
    tagline: "Mahasiswa Informatika & Creative Developer",
    bio: "Saya adalah mahasiswa semester akhir yang berfokus pada pengembangan web.",
    photo_url: "https://github.com/shadcn.png",
    projects_count: 0,
    clients_count: 0,
    years_experience: 0,
    skills: [],
  };

  if (!sb) return fallback;

  const { data } = await sb.from("profiles").select("*").eq("id", 1).single();
  return (data as Profile) ?? fallback;
}

export async function updateProfile(
  patch: Partial<Profile>
): Promise<Profile> {
  const sb = createServiceClient();
  if (!sb) throw new Error("Database not configured");

  const { data, error } = await sb
    .from("profiles")
    .update(patch)
    .eq("id", 1)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}
