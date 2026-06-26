"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageInput } from "@/components/admin/image-input";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/lib/validations";
import type { Profile } from "@/types";

export function ProfileEditor({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...profile,
      skills: profile.skills ?? [],
      tagline: profile.tagline ?? "",
      bio: profile.bio ?? "",
      photo_url: profile.photo_url ?? "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Gagal menyimpan");
      toast.success("Profil disimpan.");
      reset(data);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Edit Profil</h1>
        <p className="text-sm text-muted-foreground">
          Data ini tampil di landing page, footer, dan halaman kontak.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-6 lg:grid-cols-[1fr_18rem]"
        noValidate
      >
        <div className="space-y-5 rounded-2xl border border-border bg-card/40 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input {...register("full_name")} />
              {errors.full_name && (
                <p className="text-xs text-destructive">
                  {errors.full_name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Email Publik</Label>
              <Input type="email" {...register("email")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input
              placeholder="Mahasiswa Informatika · Web Developer · ..."
              {...register("tagline")}
            />
          </div>

          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea rows={5} {...register("bio")} />
          </div>

          <ImageInput
            label="Foto Profil"
            value={watch("photo_url")}
            onChange={(val) => setValue("photo_url", val, { shouldDirty: true })}
            aspectRatio="square"
          />

          <div className="space-y-2">
            <Label>URL CV (PDF)</Label>
            <Input placeholder="/cv.pdf atau https://..." {...register("cv_url")} />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="gradient"
              disabled={submitting || !isDirty}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Simpan Profil
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Sidebar: socials + stats */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card/40 p-6">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Sosial Media
            </h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input placeholder="https://..." {...register("instagram_url")} />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp (nomor)</Label>
                <Input placeholder="62812..." {...register("whatsapp_number")} />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input placeholder="https://..." {...register("linkedin_url")} />
              </div>
              <div className="space-y-2">
                <Label>GitHub</Label>
                <Input placeholder="https://..." {...register("github_url")} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/40 p-6">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Statistik
            </h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Jumlah Proyek</Label>
                <Input type="number" min={0} {...register("projects_count")} />
              </div>
              <div className="space-y-2">
                <Label>Jumlah Klien</Label>
                <Input type="number" min={0} {...register("clients_count")} />
              </div>
              <div className="space-y-2">
                <Label>Tahun Pengalaman</Label>
                <Input
                  type="number"
                  min={0}
                  {...register("years_experience")}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
