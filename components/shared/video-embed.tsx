"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Extracts the YouTube video ID from various URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 */
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([A-Za-z0-9_-]{11})/,
    /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  // Fallback: if the string itself is an 11-char ID
  if (/^[A-Za-z0-9_-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

interface VideoEmbedProps {
  url: string;
  className?: string;
  title?: string;
}

export function VideoEmbed({ url, className, title = "YouTube video player" }: VideoEmbedProps) {
  const videoId = extractYouTubeId(url);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setError(false);
  }, [url]);

  if (!videoId || error) {
    return (
      <div
        className={cn(
          "relative aspect-video flex flex-col items-center justify-center rounded-2xl border border-border bg-card text-center p-6",
          className
        )}
      >
        <svg className="mx-auto h-12 w-12 mb-3 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <p className="text-sm font-medium text-muted-foreground">
          {error ? "Gagal memuat video" : "URL video tidak valid"}
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Buka di YouTube ↗
        </a>
      </div>
    );
  }

  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-2xl border border-border bg-black", className)}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        onError={() => setError(true)}
      />
    </div>
  );
}
