import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, parseJsonBody } from "@/lib/api-helpers";
import { skillSchema } from "@/lib/validations";
import { createSkill, getSkills, type SkillInput } from "@/lib/data/skills";

export async function GET() {
  const auth = await requireAdmin();
  if (auth) return auth;
  const skills = await getSkills();
  return NextResponse.json({ skills });
}

export async function POST(req: Request) {
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

  const skill = await createSkill(result.data as SkillInput);
  revalidatePath("/", "layout");
  return NextResponse.json({ skill }, { status: 201 });
}
