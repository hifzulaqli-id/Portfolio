// Pure helpers — safe to import from client components (no Node fs/path deps).

/** Rough reading-time estimate: ~200 words/min, min 1. */
export function estimateReadingTime(markdown?: string | null): number {
  if (!markdown) return 1;
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
