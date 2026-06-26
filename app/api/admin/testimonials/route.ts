import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, parseJsonBody } from "@/lib/api-helpers";
import { testimonialSchema } from "@/lib/validations";
import {
  createTestimonial,
  getTestimonials,
  type TestimonialInput,
} from "@/lib/data/testimonials";

export async function GET() {
  const auth = await requireAdmin();
  if (auth) return auth;
  const testimonials = await getTestimonials();
  return NextResponse.json({ testimonials });
}

export async function POST(req: Request) {
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

  const testimonial = await createTestimonial(result.data as TestimonialInput);
  revalidatePath("/", "layout");
  return NextResponse.json({ testimonial }, { status: 201 });
}
