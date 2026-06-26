import { createClient as supabaseCreateClient } from "@supabase/supabase-js";

// Server-side Supabase client. Active only when env vars are present.
// Until you wire Supabase, the mock JSON store in lib/data/* is used.
// See README "Switch to Supabase".
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  return supabaseCreateClient(url, anon, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/** Service-role client for privileged API routes (admin actions). */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return supabaseCreateClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
