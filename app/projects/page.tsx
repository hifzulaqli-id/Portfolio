import type { Metadata } from "next";
import { PublicShell } from "@/components/layout/public-shell";
import { PortfolioPage } from "@/components/sections/portfolio-page";
import { getProjects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Portofolio | Hifzul Aqli",
  description:
    "Galeri proyek web development, design ads, editing video, dan voice over oleh Hifzul Aqli.",
};

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects({ publishedOnly: true });

  return (
    <PublicShell>
      <PortfolioPage projects={projects} />
    </PublicShell>
  );
}
