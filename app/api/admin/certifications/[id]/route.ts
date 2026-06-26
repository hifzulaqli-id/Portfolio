import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, parseJsonBody } from "@/lib/api-helpers";
import { certificationSchema } from "@/lib/validations";
import { deleteCertification, updateCertification } from "@/lib/data/certifications";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

  const cert = await updateCertification(params.id, result.data);
  revalidatePath("/", "layout");
  return NextResponse.json({ certification: cert });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth) return auth;
  const ok = await deleteCertification(params.id);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok });
}
