import { getProjects } from "@/lib/data/projects";
import { ProjectsManager } from "@/components/admin/projects-manager";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function AdminProjectsPage() {
  const projects = await getProjects({ includeDrafts: true });
  return <ProjectsManager projects={projects} />;
}
