"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, X, Link as LinkIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fileToDataUrl, ImageUploadError, isDataUrl, getDataUrlSizeKB } from "@/lib/image-upload";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageInputProps {
  label?: string;
  value?: string | null;
  onChange: (value: string) => void;
  className?: string;
  aspectRatio?: "square" | "video" | "portrait";
}

export function ImageInput({
  label = "Gambar",
  value,
  onChange,
  className,
  aspectRatio = "video",
}: ImageInputProps) {
  const [loading, setLoading] = React.useState(false);
  const [mode, setMode] = React.useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const aspectClass = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
  }[aspectRatio];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const sizeKB = getDataUrlSizeKB(dataUrl);
      onChange(dataUrl);
      toast.success(`Gambar di-upload (${sizeKB}KB)`);
    } catch (err) {
      if (err instanceof ImageUploadError) {
        toast.error(err.message);
      } else {
        toast.error("Gagal mengupload gambar");
      }
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error("Masukkan URL gambar");
      return;
    }
    onChange(urlInput.trim());
    setUrlInput("");
    toast.success("URL gambar ditambahkan");
  };

  const handleRemove = () => {
    onChange("");
    setUrlInput("");
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-0.5">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={cn(
              "rounded px-2 py-1 text-xs transition-colors",
              mode === "upload"
                ? "bg-background font-medium shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={cn(
              "rounded px-2 py-1 text-xs transition-colors",
              mode === "url"
                ? "bg-background font-medium shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            URL
          </button>
        </div>
      </div>

      {/* Preview or upload area */}
      {value ? (
        <div className="relative">
          <div className={cn("relative overflow-hidden rounded-lg border border-border bg-muted", aspectClass)}>
            <Image
              src={value}
              alt="Preview"
              fill
              sizes="400px"
              className="object-cover"
              unoptimized={isDataUrl(value)}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            className="absolute right-2 top-2 h-7 w-7 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          {isDataUrl(value) && (
            <p className="mt-1 text-xs text-muted-foreground">
              Base64 · {getDataUrlSizeKB(value)}KB
            </p>
          )}
        </div>
      ) : (
        <>
          {mode === "upload" ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
                id={`file-${label}`}
              />
              <label
                htmlFor={`file-${label}`}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/50 hover:bg-muted/50",
                  aspectClass,
                  loading && "pointer-events-none opacity-60"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Memproses...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div className="text-center">
                      <span className="text-sm font-medium text-foreground">
                        Klik untuk upload
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Max 5MB · Akan diresize ke ≤400px
                      </p>
                    </div>
                  </>
                )}
              </label>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUrlSubmit())}
              />
              <Button type="button" onClick={handleUrlSubmit} size="sm" className="shrink-0">
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
