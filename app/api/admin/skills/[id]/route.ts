import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, parseJsonBody } from "@/lib/api-helpers";
import { skillSchema } from "@/lib/validations";
import { deleteSkill, updateSkill } from "@/lib/data/skills";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.response;

  const result = skillSchema.safeParse(parsed.data);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validasi gagal", issues: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const skill = await updateSkill(params.id, result.data);
  revalidatePath("/", "layout");
  return NextResponse.json({ skill });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth) return auth;
  const ok = await deleteSkill(params.id);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok });
}
