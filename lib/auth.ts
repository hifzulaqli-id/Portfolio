import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

// Auth migrated to Supabase.
// Using portfolio_admin_session to store the Supabase access token for simplicity.
const SESSION_COOKIE = "portfolio_admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function getCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || "admin@portfolio.local",
    password: process.env.ADMIN_PASSWORD || "admin123",
  };
}

export async function login(
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  const creds = getCredentials();
  
  if (
    email.trim().toLowerCase() !== creds.email.toLowerCase() ||
    password !== creds.password
  ) {
    return { ok: false, error: "Email atau password salah." };
  }

  cookies().set(SESSION_COOKIE, "mock-session-token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  
  return { ok: true };
}

export async function logout(): Promise<void> {
  const sb = await createClient();
  if (sb) {
    await sb.auth.signOut();
  }
  cookies().delete(SESSION_COOKIE);
}

export async function getSession(): Promise<{ email: string } | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  if (token === "mock-session-token") {
    return { email: getCredentials().email };
  }

  return null;
}

export async function requireSession(): Promise<{ email: string }> {
  const session = await getSession();
  if (!session) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return session;
}
