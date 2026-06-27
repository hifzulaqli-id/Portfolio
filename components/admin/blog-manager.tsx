"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { TagInput } from "@/components/admin/tag-input";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Markdown } from "@/components/shared/markdown";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ImageInput } from "@/components/admin/image-input";
import { blogSchema, type BlogFormValues } from "@/lib/validations";
import { estimateReadingTime } from "@/lib/blog-utils";
import { slugify } from "@/lib/utils";
import type { BlogPost } from "@/types";

const DEFAULTS: BlogFormValues = {
  title: "",
  slug: undefined,
  category: null,
  thumbnail_url: null,
  excerpt: "",
  content: "",
  tags: [],
  reading_time: undefined,
  status: "draft",
  is_featured: false,
  published_at: null,
};

export function BlogManager({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<BlogPost | null>(null);
  const [deleting, setDeleting] = React.useState<BlogPost | null>(null);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [delBusy, setDelBusy] = React.useState(false);

  const toggle = async (p: BlogPost) => {
    setBusyId(p.id);
    try {
      const res = await fetch(`/api/admin/blog/${p.id}/toggle`, { method: "PATCH" });
      if (!res.ok) throw new Error("Gagal");
      toast.success(p.status === "published" ? "Disimpan sebagai draft." : "Dipublikasikan.");
      router.refresh();
    } catch {
      toast.error("Gagal.");
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDelBusy(true);
    try {
      const res = await fetch(`/api/admin/blog/${deleting.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal");
      toast.success("Artikel dihapus.");
      setDeleting(null);
      router.refresh();
    } catch {
      toast.error("Gagal menghapus.");
    } finally {
      setDelBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Kelola Blog</h1>
          <p className="text-sm text-muted-foreground">{posts.length} artikel.</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }} variant="gradient">
          <Plus className="h-4 w-4" /> Tulis Artikel
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead className="hidden sm:table-cell">Kategori</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Baca</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                  Belum ada artikel.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1.5 font-medium">
                        {p.is_featured && <Star className="h-3.5 w-3.5 fill-primary text-primary" />}
                        {p.title}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">/{p.slug}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {p.category ?? "—"}
                  </TableCell>
                  <TableCell>
                    {p.status === "published" ? (
                      <Badge variant="success">Published</Badge>
                    ) : (
                      <Badge variant="muted">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {p.reading_time} mnt
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" title="Toggle publish" onClick={() => toggle(p)} disabled={busyId === p.id}>
                        {busyId === p.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : p.status === "published" ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" title="Edit" onClick={() => { setEditing(p); setFormOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Hapus" className="hover:text-destructive" onClick={() => setDeleting(p)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <BlogFormDialog open={formOpen} onOpenChange={setFormOpen} post={editing} />

      <ConfirmDelete
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Hapus Artikel?"
        description={`"${deleting?.title}" akan dihapus permanen.`}
        busy={delBusy}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function BlogFormDialog({
  open,
  onOpenChange,
  post,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: BlogPost | null;
}) {
  const router = useRouter();
  const isEdit = Boolean(post);
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: DEFAULTS,
  });

  React.useEffect(() => {
    if (open) {
      reset(
        post
          ? {
              title: post.title,
              slug: post.slug,
              category: post.category ?? null,
              thumbnail_url: post.thumbnail_url ?? null,
              excerpt: post.excerpt ?? "",
              content: post.content ?? "",
              tags: post.tags,
              reading_time: post.reading_time,
              status: post.status,
              is_featured: post.is_featured,
              published_at: post.published_at ?? null,
            }
          : DEFAULTS
      );
    }
  }, [open, post, reset]);

  const content = watch("content") ?? "";
  const readingTime = React.useMemo(() => estimateReadingTime(content), [content]);

  const onSubmit = async (data: BlogFormValues) => {
    setSubmitting(true);
    try {
      const url = isEdit ? `/api/admin/blog/${post!.id}` : "/api/admin/blog";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Gagal menyimpan");
      toast.success(isEdit ? "Artikel diperbarui." : "Artikel dibuat.");
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
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Artikel" : "Tulis Artikel"}</DialogTitle>
          <DialogDescription>
            Gunakan sintaks Markdown. Kode blok pakai triple backtick.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-[1fr_18rem]">
            <div className="space-y-2">
              <Label>Judul *</Label>
              <Input
                {...register("title")}
                onBlur={(e) => {
                  if (!watch("slug")) setValue("slug", slugify(e.target.value));
                }}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <div className="flex gap-2">
                <Input placeholder={slugify(watch("title") || "") || "auto"} {...register("slug")} />
                {!watch("slug") && (
                  <Button type="button" variant="outline" size="sm" onClick={() => setValue("slug", slugify(watch("title") || ""))}>
                    Generate
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Input placeholder="Web Development" {...register("category")} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background/60 px-3 text-sm"
                value={watch("status")}
                onChange={(e) => setValue("status", e.target.value as "draft" | "published")}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <ImageInput
              label="Thumbnail Gambar"
              value={watch("thumbnail_url") ?? ""}
              onChange={(val) => setValue("thumbnail_url", val, { shouldDirty: true })}
              aspectRatio="video"
            />
          </div>

          <div className="space-y-2">
            <Label>Excerpt</Label>
            <Textarea rows={2} placeholder="Ringkasan singkat untuk kartu..." {...register("excerpt")} />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <TagInput value={watch("tags") ?? []} onChange={(v) => setValue("tags", v)} placeholder="cth: Next.js, lalu Enter" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Konten / Isi Artikel *</Label>
              <span className="text-xs text-muted-foreground">{readingTime} menit baca</span>
            </div>
            <RichTextEditor
              value={watch("content") ?? ""}
              onChange={(val) => setValue("content", val, { shouldDirty: true, shouldValidate: true })}
            />
            {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={watch("is_featured") ?? false} onChange={(e) => setValue("is_featured", e.target.checked)} className="accent-primary" />
            Featured (tandai sebagai artikel unggulan)
          </label>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" variant="gradient" disabled={submitting}>
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</> : isEdit ? "Simpan" : "Terbitkan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
