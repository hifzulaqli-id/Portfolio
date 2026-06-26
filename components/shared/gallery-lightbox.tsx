"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { GalleryItem } from "@/types";
import { cn } from "@/lib/utils";
import { isDataUrl } from "@/lib/image-upload";

export type GalleryVariant = "default" | "instagram_feed" | "poster";

interface GalleryLightboxProps {
  items: GalleryItem[];
  /** Gallery display variant */
  variant?: GalleryVariant;
  /** If provided, lightbox opens at this index */
  initialIndex?: number;
}

// ── Lightbox Modal ───────────────────────────────────────────────────────────
function LightboxModal({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];

  // Keyboard navigation
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  // Prevent body scroll
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Swipe handling
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 80;
    if (info.offset.x < -threshold) onNext();
    else if (info.offset.x > threshold) onPrev();
  };

  // Image error state
  const [imgError, setImgError] = React.useState(false);

  // Reset error on index change
  React.useEffect(() => {
    setImgError(false);
  }, [index]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/[0.97]"
        onClick={onClose}
      >
        {/* Close button */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute right-4 top-4 z-[210] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/25 hover:rotate-90 duration-300"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Counter */}
        <div className="absolute left-4 top-4 z-[210] flex items-center gap-3 rounded-full bg-white/10 px-4 py-1.5 font-mono text-xs text-white/80 backdrop-blur-sm">
          <span className="text-white font-semibold">{index + 1}</span>
          <span className="text-white/40">/</span>
          <span>{items.length}</span>
        </div>

        {/* Prev button */}
        {items.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-3 sm:left-5 top-1/2 z-[210] flex h-12 w-12 sm:h-16 sm:w-16 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/25 hover:scale-110 active:scale-95"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-7 w-7 sm:h-8 sm:w-8" />
          </button>
        )}

        {/* Next button */}
        {items.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-3 sm:right-5 top-1/2 z-[210] flex h-12 w-12 sm:h-16 sm:w-16 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/25 hover:scale-110 active:scale-95"
            aria-label="Next image"
          >
            <ChevronRight className="h-7 w-7 sm:h-8 sm:w-8" />
          </button>
        )}

        {/* Image + Caption with swipe */}
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          drag={items.length > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={handleDragEnd}
          className="relative flex max-h-[80vh] w-full max-w-[92vw] flex-col items-center z-[205]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full overflow-hidden rounded-2xl bg-white/5 flex items-center justify-center">
            {imgError ? (
              <div className="flex h-[50vh] sm:h-[70vh] w-full items-center justify-center">
                <div className="text-center text-white/30">
                  <svg className="mx-auto h-12 w-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                  <p className="text-sm">Gagal memuat gambar</p>
                </div>
              </div>
            ) : (
              <Image
                src={item.url}
                alt={item.caption || `Image ${index + 1}`}
                width={1600}
                height={1000}
                className="h-auto max-h-[75vh] w-auto max-w-full rounded-2xl object-contain"
                priority
                unoptimized={isDataUrl(item.url)}
                onError={() => setImgError(true)}
              />
            )}
          </div>
          {/* Caption */}
          <div className="mt-4 max-w-lg px-4 text-center">
            <p className={cn(
              "text-sm font-medium",
              item.caption ? "text-white/90" : "text-white/30"
            )}>
              {item.caption || `Gambar ${index + 1}`}
            </p>
          </div>
        </motion.div>

        {/* Dot indicators */}
        {items.length <= 12 && (
          <div className="absolute bottom-5 flex items-center gap-1.5 z-[210]">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); }}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === index
                    ? "h-2 w-6 bg-primary"
                    : "h-2 w-2 bg-white/20 hover:bg-white/40"
                )}
              />
            ))}
          </div>
        )}

        {/* Keyboard hint */}
        <div className="hidden sm:flex absolute bottom-5 left-1/2 -translate-x-1/2 items-center gap-2 text-white/20 text-xs z-[210]">
          <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px]">←</kbd>
          <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px]">→</kbd>
          <span>navigasi</span>
          <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] ml-2">Esc</kbd>
          <span>tutup</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Instagram Feed Grid ──────────────────────────────────────────────────────
function InstagramFeedGrid({
  items,
  onOpen,
}: {
  items: GalleryItem[];
  onOpen: (i: number) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden">
      {items.map((item, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onOpen(i)}
          className="group relative aspect-square overflow-hidden bg-muted/30 cursor-pointer focus:outline-none"
        >
          <Image
            src={item.url}
            alt={item.caption || `Feed ${i + 1}`}
            fill
            sizes="(max-width: 768px) 33vw, 33vw"
            className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
            draggable={false}
            unoptimized={isDataUrl(item.url)}
          />
          {/* Subtle hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
        </button>
      ))}
    </div>
  );
}

// ── Poster Gallery (full-width, original aspect ratio) ───────────────────────
function PosterGallery({
  items,
  onOpen,
}: {
  items: GalleryItem[];
  onOpen: (i: number) => void;
}) {
  return (
    <div className="space-y-6">
      {items.map((item, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onOpen(i)}
          className="group relative w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <div className="relative w-full">
            <Image
              src={item.url}
              alt={item.caption || `Poster ${i + 1}`}
              width={1200}
              height={1600}
              className="h-auto w-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
              draggable={false}
              unoptimized={isDataUrl(item.url)}
            />
          </div>
          {/* Caption bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 font-mono text-[10px] font-semibold text-white/90">
              {i + 1}/{items.length}
            </span>
            {item.caption && (
              <p className="mt-1 text-left text-sm font-medium text-white/90 truncate drop-shadow-lg">
                {item.caption}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

// ── Default Gallery Grid ─────────────────────────────────────────────────────
function DefaultGrid({
  items,
  onOpen,
}: {
  items: GalleryItem[];
  onOpen: (i: number) => void;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        items.length === 1
          ? "grid-cols-1 max-w-lg"
          : items.length === 2
          ? "grid-cols-2"
          : "grid-cols-2 lg:grid-cols-3"
      )}
    >
      {items.map((item, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onOpen(i)}
          className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-muted/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
        >
          <Image
            src={item.url}
            alt={item.caption || `Gallery ${i + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            draggable={false}
            unoptimized={isDataUrl(item.url)}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
          {/* Zoom icon */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-gray-900 opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 scale-75 group-hover:scale-100">
              <ZoomIn className="h-5 w-5" />
            </div>
          </div>
          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
            <span className={cn(
              "rounded-full bg-black/60 backdrop-blur-sm px-2 py-0.5 font-mono text-[10px] font-semibold text-white/80 transition-opacity",
              "opacity-0 group-hover:opacity-100"
            )}>
              {i + 1}/{items.length}
            </span>
            {item.caption && (
              <p className="mt-1 text-left text-xs font-medium text-white/90 truncate drop-shadow-lg">
                {item.caption}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

// ── Gallery Lightbox ─────────────────────────────────────────────────────────
export function GalleryLightbox({ items, variant = "default" }: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  if (items.length === 0) return null;

  const openLightbox = (i: number) => setActiveIndex(i);
  const closeLightbox = () => setActiveIndex(null);
  const goPrev = () =>
    setActiveIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : null));
  const goNext = () =>
    setActiveIndex((prev) => (prev !== null ? (prev + 1) % items.length : null));

  return (
    <>
      {/* Thumbnail grid — varies by variant */}
      {variant === "instagram_feed" ? (
        <InstagramFeedGrid items={items} onOpen={openLightbox} />
      ) : variant === "poster" ? (
        <PosterGallery items={items} onOpen={openLightbox} />
      ) : (
        <DefaultGrid items={items} onOpen={openLightbox} />
      )}

      {/* Lightbox modal */}
      {activeIndex !== null && (
        <LightboxModal
          items={items}
          index={activeIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </>
  );
}
