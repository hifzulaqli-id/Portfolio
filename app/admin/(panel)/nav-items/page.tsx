import { getNavItems } from "@/lib/data/nav-items";
import { NavManager } from "@/components/admin/nav-manager";

export const dynamic = "force-dynamic";

export default async function AdminNavItemsPage() {
  const navItems = await getNavItems();
  return <NavManager navItems={navItems} />;
}
