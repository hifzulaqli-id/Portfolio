import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, parseJsonBody } from "@/lib/api-helpers";
import { experienceSchema } from "@/lib/validations";
import {
  createExperience,
  getExperiences,
  type ExperienceInput,
} from "@/lib/data/experiences";

export async function GET() {
  const auth = await requireAdmin();
  if (auth) return auth;
  const experiences = await getExperiences();
  return NextResponse.json({ experiences });
}

export async function POST(req: Request) {
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

  const exp = await createExperience(result.data as ExperienceInput);
  revalidatePath("/", "layout");
  return NextResponse.json({ experience: exp }, { status: 201 });
}
