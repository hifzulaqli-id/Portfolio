"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageInput } from "@/components/admin/image-input";
import { IconPicker } from "@/components/shared/icon-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  projectSchema,
  type ProjectFormValues,
} from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { getTechIcon } from "@/lib/icons";
import type { Project } from "@/types";

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
}

const DEFAULTS: ProjectFormValues = {
  title: "",
  slug: "",
  category: "web",
  design_type: null,
  description: "",
  content: "",
  tech_stack: [],
  thumbnail_url: "",
  media_url: null,
  gallery: [],
  links: [],
  live_url: null,
  github_url: null,
  status: "draft",
  display_order: 0,
};

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
}: ProjectFormDialogProps) {
  const router = useRouter();
  const isEdit = Boolean(project);
  const [submitting, setSubmitting] = React.useState(false);
  const [techNameInput, setTechNameInput] = React.useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: DEFAULTS,
  });

  const gallery = watch("gallery");
  const techStack = watch("tech_stack");
  const titleValue = watch("title");
  const links = watch("links");
  const category = watch("category");
  const designType = watch("design_type");
  const mediaUrl = watch("media_url");

  const isVideo = category === "video";
  const isVoice = category === "voice";
  const isMediaCategory = isVideo || isVoice;

  // helpers for gallery [{url, caption}]
  const addGallery = () =>
    setValue("gallery", [...gallery, { url: "", caption: "" }], { shouldDirty: true });
  const updateGallery = (i: number, field: "url" | "caption", val: string) => {
    const next = [...gallery];
    next[i] = { ...next[i], [field]: val };
    setValue("gallery", next, { shouldDirty: true });
  };
  const removeGallery = (i: number) =>
    setValue("gallery", gallery.filter((_, idx) => idx !== i), { shouldDirty: true });

  // helpers for tech_stack [{name, icon}]
  const addTech = () => {
    const name = techNameInput.trim();
    if (name && !techStack.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      const autoIcon = getTechIcon(name);
      setValue("tech_stack", [...techStack, { name, icon: autoIcon }]);
    }
    setTechNameInput("");
  };
  const updateTech = (i: number, field: "name" | "icon", val: string) => {
    const next = [...techStack];
    next[i] = { ...next[i], [field]: val };
    setValue("tech_stack", next, { shouldDirty: true });
  };
  const removeTech = (i: number) =>
    setValue("tech_stack", techStack.filter((_, idx) => idx !== i));

  // helpers for links array
  const addLink = () =>
    setValue("links", [...links, { platform: "live" as const, url: "" }], { shouldDirty: true });
  const updateLink = (i: number, field: "platform" | "url", val: string) => {
    const next = [...links];
    next[i] = { ...next[i], [field]: val };
    setValue("links", next, { shouldDirty: true });
  };
  const removeLink = (i: number) =>
    setValue("links", links.filter((_, idx) => idx !== i), { shouldDirty: true });

  // Sync form when dialog opens with a project.
  React.useEffect(() => {
    if (open) {
      if (project) {
        reset({
          title: project.title,
          slug: project.slug,
          category: project.category,
          design_type: project.design_type ?? null,
          description: project.description,
          content: project.content ?? "",
          tech_stack: project.tech_stack,
          thumbnail_url: project.thumbnail_url,
          media_url: project.media_url ?? null,
          gallery: project.gallery,
          links: project.links ?? [],
          live_url: project.live_url,
          github_url: project.github_url,
          status: project.status,
          display_order: project.display_order,
        });
      } else {
        reset(DEFAULTS);
      }
      setTechNameInput("");
    }
  }, [open, project, reset]);

  const onSubmit = async (data: ProjectFormValues) => {
    setSubmitting(true);
    try {
      const url = isEdit
        ? `/api/admin/projects/${project!.id}`
        : "/api/admin/projects";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        // Show detailed validation errors if available
        const details = json?.details;
        if (details && typeof details === "object") {
          const msgs = Object.entries(details)
            .map(([field, errs]) => `${field}: ${(errs as string[]).join(", ")}`)
            .join("\n");
          throw new Error(msgs || json?.error || "Gagal menyimpan");
        }
        throw new Error(json?.error ?? "Gagal menyimpan");
      }
      toast.success(isEdit ? "Proyek diperbarui." : "Proyek dibuat.");
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Proyek" : "Tambah Proyek"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Perbarui detail proyek di bawah ini."
              : "Isi detail proyek baru Anda."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit, (err) => {
            const msgs = Object.values(err)
              .flatMap((e) => (e.message ? [e.message] : []))
              .join(", ");
            toast.error(msgs || "Form belum lengkap. Periksa kembali field yang wajib diisi.");
          })}
          className="space-y-4"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Judul *</Label>
              <Input
                placeholder="Nama proyek"
                {...register("title")}
                onBlur={(e) => {
                  if (!watch("slug")) setValue("slug", slugify(e.target.value));
                }}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <div className="flex gap-2">
                <Input
                  placeholder={slugify(titleValue) || "auto-generate"}
                  {...register("slug")}
                />
                {!watch("slug") && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setValue("slug", slugify(titleValue))}
                  >
                    Generate
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Kategori *</Label>
              <Select
                value={watch("category")}
                onValueChange={(v) => {
                  setValue("category", v as never);
                  // Reset design_type when switching away from design
                  if (v !== "design") setValue("design_type", null, { shouldDirty: true });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">🌐 Web Dev</SelectItem>
                  <SelectItem value="design">🎨 Design</SelectItem>
                  <SelectItem value="video">🎬 Video</SelectItem>
                  <SelectItem value="voice">🎙️ Voice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Design sub-category — only visible when category = design */}
            {category === "design" && (
              <div className="space-y-2">
                <Label>Sub-kategori Design</Label>
                <Select
                  value={designType ?? ""}
                  onValueChange={(v) => setValue("design_type", v === "" ? null : (v as never), { shouldDirty: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram_feed">📱 Instagram Feed</SelectItem>
                    <SelectItem value="poster">🖼️ Poster</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(v) => setValue("status", v as never)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Urutan</Label>
              <Input type="number" min={0} {...register("display_order")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Deskripsi Singkat *</Label>
            <Textarea
              rows={2}
              placeholder="Deskripsi 1-2 kalimat untuk card"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Detail Lengkap</Label>
            <Textarea
              rows={4}
              placeholder="Penjelasan panjang proyek (opsional)..."
              {...register("content")}
            />
          </div>

          {/* Tech Stack with Icon Picker */}
          <div className="space-y-2">
            <Label>Tech Stack</Label>
            <div className="flex gap-2">
              <Input
                placeholder="cth: Next.js, lalu Enter"
                value={techNameInput}
                onChange={(e) => setTechNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTech();
                  }
                }}
              />
              <Button type="button" variant="outline" size="sm" onClick={addTech}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {techStack.length > 0 && (
              <div className="space-y-2 pt-1">
                {techStack.map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <IconPicker
                      value={t.icon}
                      onValueChange={(val) => updateTech(i, "icon", val)}
                    />
                    <Input
                      value={t.name}
                      onChange={(e) => updateTech(i, "name", e.target.value)}
                      placeholder="Nama teknologi"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTech(i)}
                    >
                      <X className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Media URL for Video & Voice categories */}
          {isMediaCategory && (
            <div className="space-y-2">
              <Label>URL YouTube / Media *</Label>
              <Input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={mediaUrl ?? ""}
                onChange={(e) => setValue("media_url", e.target.value || null, { shouldDirty: true })}
              />
              <p className="text-xs text-muted-foreground">
                Tempel link YouTube (watch?v=, youtu.be). Media akan ditampilkan langsung di halaman project.
              </p>
              {errors.media_url && (
                <p className="text-xs text-destructive">
                  {errors.media_url.message}
                </p>
              )}
            </div>
          )}

          {/* Thumbnail — only for web & design categories */}
          {!isMediaCategory && (
            <>
              <ImageInput
                label="Thumbnail *"
                value={watch("thumbnail_url")}
                onChange={(val) => setValue("thumbnail_url", val, { shouldDirty: true })}
                aspectRatio={designType === "poster" ? "portrait" : "video"}
              />
              {errors.thumbnail_url && (
                <p className="text-xs text-destructive">
                  {errors.thumbnail_url.message}
                </p>
              )}
            </>
          )}

          {/* Optional thumbnail for video/voice (shown as card cover if provided) */}
          {isMediaCategory && (
            <>
              <ImageInput
                label="Cover (opsional)"
                value={watch("thumbnail_url")}
                onChange={(val) => setValue("thumbnail_url", val, { shouldDirty: true })}
                aspectRatio="video"
              />
              <p className="-mt-2 text-xs text-muted-foreground">
                Jika dikosongkan, card akan menampilkan ikon {isVideo ? "video" : "audio"}.
              </p>
            </>
          )}

          {/* Gallery with Caption */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>
                Galeri Gambar
                {designType === "instagram_feed" && (
                  <span className="ml-1.5 text-destructive font-normal">* min. 3</span>
                )}
              </Label>
              <Button
                type="button"
                variant={designType === "instagram_feed" ? "default" : "ghost"}
                size="sm"
                onClick={addGallery}
              >
                <Plus className="h-3.5 w-3.5" /> Tambah
              </Button>
            </div>
            {designType === "instagram_feed" && gallery.length > 0 && gallery.length < 3 && (
              <p className="text-xs text-amber-500">
                ⚠️ Instagram Feed membutuhkan minimal 3 gambar (saat ini: {gallery.length})
              </p>
            )}
            <div className="space-y-3">
              {gallery.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  {designType === "instagram_feed"
                    ? "Belum ada gambar. Tambahkan minimal 3 gambar untuk Instagram Feed."
                    : "Belum ada gambar galeri."}
                </p>
              )}
              {gallery.map((item, i) => (
                <div key={i} className="relative rounded-lg border border-border bg-muted/30 p-3 space-y-2">
                  <ImageInput
                    label={`Gambar #${i + 1}`}
                    value={item.url}
                    onChange={(val) => updateGallery(i, "url", val)}
                    aspectRatio={designType === "poster" ? "portrait" : "video"}
                  />
                  <div className="space-y-0.5">
                    <Label className="text-[11px]">Judul Gambar</Label>
                    <Input
                      value={item.caption}
                      onChange={(e) => updateGallery(i, "caption", e.target.value)}
                      placeholder="Judul / caption gambar..."
                      className="text-sm"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeGallery(i)}
                    className="absolute right-2 top-2"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Project Links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Project Links</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addLink}
              >
                <Plus className="h-3.5 w-3.5" /> Tambah Link
              </Button>
            </div>
            <div className="space-y-2">
              {links.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Tambahkan link live demo, GitHub, YouTube, Kaggle, dll.
                </p>
              )}
              {links.map((link, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Select
                    value={link.platform}
                    onValueChange={(val) => updateLink(i, "platform", val)}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="live">🌐 Live Demo</SelectItem>
                      <SelectItem value="github">💻 GitHub</SelectItem>
                      <SelectItem value="youtube">🎥 YouTube</SelectItem>
                      <SelectItem value="kaggle">📊 Kaggle</SelectItem>
                      <SelectItem value="figma">🎨 Figma</SelectItem>
                      <SelectItem value="behance">🎭 Behance</SelectItem>
                      <SelectItem value="dribbble">🏀 Dribbble</SelectItem>
                      <SelectItem value="website">🌍 Website</SelectItem>
                      <SelectItem value="other">🔗 Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="https://..."
                    value={link.url}
                    onChange={(e) => updateLink(i, "url", e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLink(i)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button type="submit" variant="gradient" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : isEdit ? (
                "Simpan Perubahan"
              ) : (
                "Buat Proyek"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
