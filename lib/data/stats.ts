import { getProjects } from "./projects";
import { getUnreadCount } from "./messages";
import { getVisibleTestimonialCount } from "./testimonials";
import { getProfile } from "./profile";
import type { ProjectCategory } from "@/types";

export interface AdminStats {
  totalProjects: number;
  publishedProjects: number;
  unreadMessages: number;
  totalTestimonials: number;
  profile: {
    full_name: string;
    photo_url: string;
  };
  projectsByCategory: Record<ProjectCategory, number>;
}

export async function getAdminStats(): Promise<AdminStats> {
  const [projects, unreadMessages, totalTestimonials, profile] =
    await Promise.all([
      getProjects(),
      getUnreadCount(),
      getVisibleTestimonialCount(),
      getProfile(),
    ]);

  const projectsByCategory: Record<ProjectCategory, number> = {
    web: 0,
    design: 0,
    video: 0,
    voice: 0,
  };
  for (const p of projects) {
    projectsByCategory[p.category]++;
  }

  return {
    totalProjects: projects.length,
    publishedProjects: projects.filter((p) => p.status === "published").length,
    unreadMessages,
    totalTestimonials,
    profile: {
      full_name: profile.full_name,
      photo_url: profile.photo_url,
    },
    projectsByCategory,
  };
}
