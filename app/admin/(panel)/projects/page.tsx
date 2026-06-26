import { getProjects } from "@/lib/data/projects";
import { ProjectsManager } from "@/components/admin/projects-manager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  return <ProjectsManager projects={projects} />;
}
