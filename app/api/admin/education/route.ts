import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, parseJsonBody } from "@/lib/api-helpers";
import { educationSchema } from "@/lib/validations";
import {
  createEducation,
  getEducation,
  type EducationInput,
} from "@/lib/data/education";

export async function GET() {
  const auth = await requireAdmin();
  if (auth) return auth;
  const education = await getEducation();
  return NextResponse.json({ education });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.response;

  const result = educationSchema.safeParse(parsed.data);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validasi gagal", issues: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const edu = await createEducation(result.data as EducationInput);
  revalidatePath("/", "layout");
  return NextResponse.json({ education: edu }, { status: 201 });
}
