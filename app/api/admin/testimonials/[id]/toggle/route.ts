import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/api-helpers";
import { toggleTestimonialVisible } from "@/lib/data/testimonials";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth) return auth;
  const testimonial = await toggleTestimonialVisible(params.id);
  revalidatePath("/", "layout");
  return NextResponse.json({ testimonial });
}
