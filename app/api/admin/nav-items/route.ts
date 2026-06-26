import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, parseJsonBody } from "@/lib/api-helpers";
import { navItemSchema } from "@/lib/validations";
import { createNavItem, getNavItems, type NavItemInput } from "@/lib/data/nav-items";

export async function GET() {
  const auth = await requireAdmin();
  if (auth) return auth;
  const navItems = await getNavItems();
  return NextResponse.json({ navItems });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.response;

  const result = navItemSchema.safeParse(parsed.data);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validasi gagal", issues: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const navItem = await createNavItem(result.data as NavItemInput);
  revalidatePath("/", "layout");
  return NextResponse.json({ navItem }, { status: 201 });
}
