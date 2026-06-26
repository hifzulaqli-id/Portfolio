import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, parseJsonBody } from "@/lib/api-helpers";
import { experienceSchema } from "@/lib/validations";
import {
  deleteExperience,
  toggleExperienceActive,
  updateExperience,
} from "@/lib/data/experiences";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.response;

  const result = experienceSchema.safeParse(parsed.data);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validasi gagal", issues: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const exp = await updateExperience(params.id, result.data);
  revalidatePath("/", "layout");
  return NextResponse.json({ experience: exp });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth) return auth;
  const ok = await deleteExperience(params.id);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok });
}
