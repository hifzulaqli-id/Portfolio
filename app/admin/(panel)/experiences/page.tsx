import { getExperiences } from "@/lib/data/experiences";
import { ExperienceManager } from "@/components/admin/experience-manager";

export const dynamic = "force-dynamic";

export default async function AdminExperiencesPage() {
  const items = await getExperiences();
  return <ExperienceManager items={items} />;
}
