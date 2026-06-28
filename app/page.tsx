import { PublicShell } from "@/components/layout/public-shell";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { Portfolio } from "@/components/sections/portfolio";
import { Process } from "@/components/sections/process";
import { Testimonials } from "@/components/sections/testimonials";
import { ContactCTA } from "@/components/sections/contact-cta";
import { getProfile } from "@/lib/data/profile";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getTestimonials } from "@/lib/data/testimonials";
import { getEducation } from "@/lib/data/education";
import { getServices } from "@/lib/data/services";
import { getContentBlocksBySection } from "@/lib/data/content-blocks";
import { getSkills } from "@/lib/data/skills";

// Revalidate every 60s — ISR. Admin edits trigger immediate revalidation.
export const revalidate = 60;
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [
    profile,
    projects,
    testimonials,
    education,
    services,
    heroBlocks,
    processBlocks,
    ctaBlocks,
    skills,
  ] = await Promise.all([
    getProfile(),
    getFeaturedProjects(6),
    getTestimonials({ visibleOnly: true }),
    getEducation(),
    getServices({ activeOnly: true }),
    getContentBlocksBySection("hero"),
    getContentBlocksBySection("process"),
    getContentBlocksBySection("contact-cta"),
    getSkills({ activeOnly: true }),
  ]);

  return (
    <PublicShell>
      <Hero profile={profile} blocks={heroBlocks} />
      <About profile={profile} education={education} skills={skills} />
      <Services services={services} />
      <Portfolio projects={projects} showAllLink />
      <Process blocks={processBlocks} />
      <Testimonials testimonials={testimonials} />
      <ContactCTA profile={profile} blocks={ctaBlocks} />
    </PublicShell>
  );
}
