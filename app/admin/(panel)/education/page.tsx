import { getEducation } from "@/lib/data/education";
import { EducationManager } from "@/components/admin/education-manager";

export const dynamic = "force-dynamic";

export default async function AdminEducationPage() {
  const items = await getEducation();
  return <EducationManager items={items} />;
}
