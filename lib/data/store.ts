import { promises as fs } from "node:fs";
import * as path from "node:path";
import { SEED_DATA } from "./seed";
import type { StoreData, Project, GalleryItem, TechItem } from "@/types";

// File-backed mock store. In development (local Node FS) edits persist across
// requests. On Vercel's read-only FS, flip to Supabase — see README.
//
// This module is server-only.

const STORE_PATH = path.join(process.cwd(), "lib", "data", "store.json");
let writeChain: Promise<unknown> = Promise.resolve();

/** Migrate old project format to new format (gallery_urls → gallery, tech_stack strings → objects) */
function migrateProject(p: Record<string, unknown>): Project {
  const proj = { ...p } as Record<string, unknown>;

  // Migrate gallery_urls: string[] → gallery: [{url, caption}]
  if ("gallery_urls" in proj && !("gallery" in proj)) {
    const oldUrls = Array.isArray(proj.gallery_urls) ? proj.gallery_urls as string[] : [];
    proj.gallery = oldUrls.map((url) => ({ url, caption: "" }));
    delete proj.gallery_urls;
  }
  // Ensure gallery exists
  if (!Array.isArray(proj.gallery)) {
    proj.gallery = [];
  }

  // Migrate tech_stack: string[] → [{name, icon}]
  if (Array.isArray(proj.tech_stack) && proj.tech_stack.length > 0 && typeof proj.tech_stack[0] === "string") {
    proj.tech_stack = (proj.tech_stack as string[]).map((name) => ({
      name,
      icon: "Code2",
    }));
  }
  if (!Array.isArray(proj.tech_stack)) {
    proj.tech_stack = [];
  }

  return proj as unknown as Project;
}

async function ensureStore(): Promise<StoreData> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as StoreData;
  } catch {
    // First run — seed it.
    await fs.writeFile(STORE_PATH, JSON.stringify(SEED_DATA, null, 2), "utf-8");
    return structuredClone(SEED_DATA);
  }
}

export async function readStore(): Promise<StoreData> {
  const data = await ensureStore();
  // Defensive defaults so a partially-edited file never crashes the UI.
  // Newer entities (nav_items, services, content_blocks) fall back to seed
  // data so a store.json created before they existed still works.
  return {
    profile: data.profile ?? SEED_DATA.profile,
    projects: (data.projects ?? []).map((p) => migrateProject(p as unknown as Record<string, unknown>)),
    messages: data.messages ?? [],
    testimonials: data.testimonials ?? [],
    skills: data.skills ?? [],
    certifications: data.certifications ?? [],
    experiences: data.experiences ?? [],
    education: data.education ?? [],
    blog_posts: data.blog_posts ?? [],
    settings: data.settings ?? SEED_DATA.settings,
    nav_items: data.nav_items ?? SEED_DATA.nav_items,
    services: data.services ?? SEED_DATA.services,
    content_blocks: data.content_blocks ?? SEED_DATA.content_blocks,
  };
}

/** Serialize writes so concurrent API calls don't clobber each other. */
export function writeStore(
  updater: (current: StoreData) => StoreData
): Promise<StoreData> {
  writeChain = writeChain.then(async () => {
    const current = await readStore();
    const next = updater(current);
    await fs.writeFile(STORE_PATH, JSON.stringify(next, null, 2), "utf-8");
    return next;
  });
  return writeChain as Promise<StoreData>;
}

/** Reset everything back to seed (handy during development). */
export async function resetStore(): Promise<StoreData> {
  return writeStore(() => structuredClone(SEED_DATA));
}
