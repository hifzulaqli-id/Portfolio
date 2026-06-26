"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, Loader2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/admin/tag-input";
import { siteSettingsSchema, ACCENT_PRESETS, type SiteSettingsFormValues } from "@/lib/validations";
import type { SiteSettings } from "@/types";
import { cn } from "@/lib/utils";

export function SettingsManager({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      site_title: settings.site_title,
      site_description: settings.site_description,
      og_image_url: settings.og_image_url ?? null,
      seo_keywords: settings.seo_keywords,
      google_analytics_id: settings.google_analytics_id ?? null,
      maintenance_mode: settings.maintenance_mode,
      maintenance_message: settings.maintenance_message ?? "",
      accent_color: settings.accent_color,
    },
  });

  const onSubmit = async (data: SiteSettingsFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Gagal menyimpan");
      toast.success("Pengaturan disimpan.");
      reset(data);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedAccent = watch("accent_color");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Pengaturan Situs</h1>
        <p className="text-sm text-muted-foreground">
          Konfigurasi global yang berlaku di seluruh situs.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1fr_18rem]" noValidate>
        <div className="space-y-5 rounded-2xl border border-border bg-card/40 p-6">
          <div className="space-y-2">
            <Label>Judul Website</Label>
            <Input {...register("site_title")} />
            {errors.site_title && <p className="text-xs text-destructive">{errors.site_title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Deskripsi Website</Label>
            <Textarea rows={2} {...register("site_description")} />
          </div>

          <div className="space-y-2">
            <Label>OG Image URL</Label>
            <Input placeholder="/images/og-image.svg" {...register("og_image_url")} />
          </div>

          <div className="space-y-2">
            <Label>Keywords SEO</Label>
            <TagInput value={watch("seo_keywords") ?? []} onChange={(v) => setValue("seo_keywords", v)} placeholder="cth: portfolio, web developer" />
          </div>

          <div className="space-y-2">
            <Label>Google Analytics ID (opsional)</Label>
            <Input placeholder="G-XXXXXXXXXX" {...register("google_analytics_id")} />
          </div>
        </div>

        <div className="space-y-5">
          {/* Accent color */}
          <div className="rounded-2xl border border-border bg-card/40 p-6">
            <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Warna Accent
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {ACCENT_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue("accent_color", color, { shouldDirty: true })}
                  title={color}
                  className={cn(
                    "h-9 w-9 rounded-full border-2 transition-transform hover:scale-110",
                    selectedAccent === color ? "border-foreground" : "border-transparent"
                  )}
                  style={{ background: color }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Input
                className="h-8 font-mono text-xs"
                value={selectedAccent ?? ""}
                onChange={(e) => setValue("accent_color", e.target.value, { shouldDirty: true })}
              />
              <div className="h-8 w-8 shrink-0 rounded-md border border-border" style={{ background: selectedAccent }} />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Ubah CSS variable <code className="font-mono">--primary</code>. Perubahan penuh berlaku setelah deploy.
            </p>
          </div>

          {/* Maintenance mode */}
          <div className="rounded-2xl border border-border bg-card/40 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-amber-500" />
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Mode Pemeliharaan
              </h3>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={watch("maintenance_mode") ?? false}
                onChange={(e) => setValue("maintenance_mode", e.target.checked, { shouldDirty: true })}
                className="accent-primary"
              />
              Aktifkan mode pemeliharaan
            </label>
            <div className="mt-3 space-y-2">
              <Label className="text-xs">Pesan Pemeliharaan</Label>
              <Textarea
                rows={2}
                placeholder="Situs sedang maintenance..."
                {...register("maintenance_message")}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex justify-end">
          <Button type="submit" variant="gradient" disabled={submitting || !isDirty}>
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</>
            ) : (
              <><Save className="h-4 w-4" /> Simpan Pengaturan</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
