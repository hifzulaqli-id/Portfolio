import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, parseJsonBody } from "@/lib/api-helpers";
import { certificationSchema } from "@/lib/validations";
import {
  createCertification,
  getCertifications,
  type CertificationInput,
} from "@/lib/data/certifications";

export async function GET() {
  const auth = await requireAdmin();
  if (auth) return auth;
  const certifications = await getCertifications();
  return NextResponse.json({ certifications });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.response;

  const result = certificationSchema.safeParse(parsed.data);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validasi gagal", issues: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const cert = await createCertification(result.data as CertificationInput);
  revalidatePath("/", "layout");
  return NextResponse.json({ certification: cert }, { status: 201 });
}
