import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/api-helpers";
import { toggleSkillActive } from "@/lib/data/skills";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth) return auth;
  const skill = await toggleSkillActive(params.id);
  revalidatePath("/", "layout");
  return NextResponse.json({ skill });
}
