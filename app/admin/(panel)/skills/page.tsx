import { getSkills } from "@/lib/data/skills";
import { SkillManager } from "@/components/admin/skill-manager";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await getSkills();
  return <SkillManager skills={skills} />;
}
