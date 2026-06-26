import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, parseJsonBody } from "@/lib/api-helpers";
import { navItemSchema } from "@/lib/validations";
import { deleteNavItem, updateNavItem } from "@/lib/data/nav-items";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

  const navItem = await updateNavItem(params.id, result.data);
  revalidatePath("/", "layout");
  return NextResponse.json({ navItem });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth) return auth;
  const ok = await deleteNavItem(params.id);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok });
}
