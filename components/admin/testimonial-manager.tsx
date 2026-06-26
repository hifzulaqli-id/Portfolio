"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { testimonialSchema, type TestimonialFormValues } from "@/lib/validations";
import type { Testimonial } from "@/types";

const DEFAULTS: TestimonialFormValues = {
  client_name: "",
  client_role: "",
  avatar_url: null,
  content: "",
  rating: 5,
  is_visible: true,
};

export function TestimonialManager({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Testimonial | null>(null);
  const [deleting, setDeleting] = React.useState<Testimonial | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setFormOpen(true);
  };

  const toggle = async (t: Testimonial) => {
    setBusy(t.id);
    try {
      const res = await fetch(`/api/admin/testimonials/${t.id}/toggle`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Gagal");
      toast.success(
        t.is_visible ? "Testimoni disembunyikan." : "Testimoni dipublikasikan."
      );
      router.refresh();
    } catch {
      toast.error("Gagal mengubah status.");
    } finally {
      setBusy(null);
    }
  };

  const remove = async () => {
    if (!deleting) return;
    setBusy(deleting.id);
    try {
      const res = await fetch(`/api/admin/testimonials/${deleting.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal");
      toast.success("Testimoni dihapus.");
      router.refresh();
    } catch {
      toast.error("Gagal menghapus testimoni.");
    } finally {
      setBusy(null);
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Testimoni</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola testimoni klien yang tampil di beranda.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Tambah
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Klien</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="hidden lg:table-cell">Kutipan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-10"
                >
                  Belum ada testimoni. Klik &quot;Tambah&quot; untuk membuat.
                </TableCell>
              </TableRow>
            )}
            {testimonials.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.client_name}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {t.client_role || "—"}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {t.rating}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell max-w-xs truncate text-muted-foreground">
                  {t.content}
                </TableCell>
                <TableCell>
                  <Badge variant={t.is_visible ? "default" : "secondary"}>
                    {t.is_visible ? "Tampil" : "Tersembunyi"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggle(t)}
                      disabled={busy === t.id}
                      title={t.is_visible ? "Sembunyikan" : "Tampilkan"}
                    >
                      {busy === t.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : t.is_visible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(t)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleting(t)}
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TestimonialForm
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
      />

      <ConfirmDelete
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Hapus testimoni?"
        description={`Testimoni dari "${deleting?.client_name}" akan dihapus permanen.`}
        onConfirm={remove}
        busy={!!busy}
      />
    </div>
  );
}

function TestimonialForm({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing: Testimonial | null;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: DEFAULTS,
  });

  const isVisible = watch("is_visible");
  const rating = watch("rating");

  React.useEffect(() => {
    if (open) {
      reset(
        editing
          ? {
              client_name: editing.client_name,
              client_role: editing.client_role ?? "",
              avatar_url: editing.avatar_url ?? "",
              content: editing.content,
              rating: editing.rating,
              is_visible: editing.is_visible,
            }
          : DEFAULTS
      );
    }
  }, [open, editing, reset]);

  const onSubmit = async (values: TestimonialFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/admin/testimonials${editing ? `/${editing.id}` : ""}`,
        { method: editing ? "PUT" : "POST", body: JSON.stringify(values) }
      );
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Gagal");
      }
      toast.success(editing ? "Testimoni diperbarui." : "Testimoni dibuat.");
      onOpenChange(false);
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message || "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Testimoni" : "Testimoni Baru"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Perbarui detail testimoni klien."
              : "Tambahkan testimoni baru."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="client_name">Nama Klien</Label>
              <Input id="client_name" {...register("client_name")} />
              {errors.client_name && (
                <p className="text-xs text-destructive">
                  {errors.client_name.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client_role">Role / Jabatan</Label>
              <Input
                id="client_role"
                placeholder="cth. CEO, Toko Bunga"
                {...register("client_role")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="avatar_url">URL Avatar (opsional)</Label>
            <Input
              id="avatar_url"
              placeholder="https://..."
              {...register("avatar_url")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content">Kutipan Testimoni</Label>
            <Textarea
              id="content"
              rows={4}
              {...register("content")}
            />
            {errors.content && (
              <p className="text-xs text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rating">Rating (1–5)</Label>
              <Input
                id="rating"
                type="number"
                min={1}
                max={5}
                {...register("rating", { valueAsNumber: true })}
              />
              {errors.rating && (
                <p className="text-xs text-destructive">
                  {errors.rating.message}
                </p>
              )}
              <div className="flex gap-0.5 pt-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={
                      "h-4 w-4 " +
                      (n <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground")
                    }
                  />
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Tampilkan publik</Label>
              <div className="flex items-center gap-2 h-9">
                <Switch
                  checked={isVisible}
                  onCheckedChange={(v) => setValue("is_visible", v)}
                />
                <span className="text-sm text-muted-foreground">
                  {isVisible ? "Tampil" : "Tersembunyi"}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              {editing ? "Simpan" : "Buat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
