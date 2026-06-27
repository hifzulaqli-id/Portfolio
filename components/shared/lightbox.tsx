"use client";

import * as React from "react";
import Image from "next/image";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LightboxItem {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  link?: string;
}

interface LightboxProps {
  items: LightboxItem[];
  /** Controlled index; -1 means closed. */
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  React.useEffect(() => {
    if (index < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % items.length);
      if (e.key === "ArrowLeft")
        onNavigate((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, items.length, onClose, onNavigate]);

  if (index < 0 || index >= items.length) return null;
  const item = items[index];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur transition-colors hover:bg-background"
        onClick={onClose}
        aria-label="Tutup"
      >
        <X className="h-5 w-5" />
      </button>

      {items.length > 1 && (
        <>
          <button
            className={cn(
              "absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur transition-colors hover:bg-background"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index - 1 + items.length) % items.length);
            }}
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur transition-colors hover:bg-background"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index + 1) % items.length);
            }}
            aria-label="Berikutnya"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div
        className="relative flex max-h-[90vh] max-w-5xl flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-[60vh] w-[90vw] max-w-4xl">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="90vw"
            className="object-contain"
            priority
            unoptimized={item.src?.startsWith("data:")}
          />
        </div>
        {item.caption && (
          <div className="text-center text-sm text-muted-foreground">
            {item.caption}
          </div>
        )}
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <ExternalLink className="h-4 w-4" />
            Verifikasi Kredensial
          </a>
        )}
      </div>
    </div>
  );
}
