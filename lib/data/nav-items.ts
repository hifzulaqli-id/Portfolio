import type { NavItem, NavLocation } from "@/types";
import { createClient, createServiceClient } from "@/lib/supabase/server";

function genId(): string {
  return (
    "nav-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 7)
  );
}

const ORDER: Record<NavLocation, number> = {
  navbar: 0,
  "navbar-dropdown": 1,
  "footer-col-1": 2,
  "footer-col-2": 3,
};

export async function getNavItems(opts?: {
  activeOnly?: boolean;
}): Promise<NavItem[]> {
  const sb = await createClient();
  if (!sb) return [];

  let query = sb.from("nav_items").select("*");

  if (opts?.activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data } = await query;
  return ((data as NavItem[]) ?? []).sort((a, b) => {
    const loc = ORDER[a.location] - ORDER[b.location];
    if (loc !== 0) return loc;
    return a.display_order - b.display_order;
  });
}

export async function getNavItemsByLocation(
  location: NavLocation,
  opts?: { activeOnly?: boolean }
): Promise<NavItem[]> {
  const items = await getNavItems(opts);
  return items.filter((n) => n.location === location);
}

export type NavItemInput = Omit<NavItem, "id" | "created_at">;

export async function createNavItem(input: NavItemInput): Promise<NavItem> {
  const sb = createServiceClient();
  if (!sb) throw new Error("Database not configured");

  const item = {
    ...input,
    id: genId(),
    created_at: new Date().toISOString(),
  };
  
  const { data, error } = await sb.from("nav_items").insert(item).select().single();
  if (error) throw error;
  return data as NavItem;
}

export async function updateNavItem(
  id: string,
  patch: Partial<NavItem>
): Promise<NavItem | null> {
  const sb = createServiceClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from("nav_items")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return null;
  return data as NavItem;
}

export async function deleteNavItem(id: string): Promise<boolean> {
  const sb = createServiceClient();
  if (!sb) return false;

  const { error } = await sb.from("nav_items").delete().eq("id", id);
  return !error;
}
