import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, parseJsonBody } from "@/lib/api-helpers";
import { testimonialSchema } from "@/lib/validations";
import { deleteTestimonial, updateTestimonial } from "@/lib/data/testimonials";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.response;

  const result = testimonialSchema.safeParse(parsed.data);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validasi gagal", issues: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const testimonial = await updateTestimonial(params.id, result.data);
  revalidatePath("/", "layout");
  return NextResponse.json({ testimonial });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth) return auth;
  const ok = await deleteTestimonial(params.id);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok });
}
