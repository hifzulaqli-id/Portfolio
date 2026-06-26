"use client";

import { createClient as supabaseCreateClient } from "@supabase/supabase-js";

// Active only when env vars are present. Until you wire Supabase, the mock
// JSON store in lib/data/* is used instead. See README "Switch to Supabase".
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return supabaseCreateClient(url, anon, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
}
