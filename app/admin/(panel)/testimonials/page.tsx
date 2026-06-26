import { getTestimonials } from "@/lib/data/testimonials";
import { TestimonialManager } from "@/components/admin/testimonial-manager";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();
  return <TestimonialManager testimonials={testimonials} />;
}
