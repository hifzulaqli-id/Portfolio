"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { TagInput } from "@/components/admin/tag-input";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { educationSchema, type EducationFormValues } from "@/lib/validations";
import {
  EDUCATION_TYPE_META,
  type Education,
  type EducationType,
} from "@/types";

const DEFAULTS: EducationFormValues = {
  type: "formal",
  institution: "",
  field_of_study: "",
  logo_url: null,
  degree_level: null,
  start_year: null,
  end_year: null,
  is_current: false,
  gpa: null,
  description: "",
  relevant_subjects: [],
  achievements: "",
  institution_url: null,
  display_order: 0,
};

export function EducationManager({ items }: { items: Education[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Education | null>(null);
  const [deleting, setDeleting] = React.useState<Education | null>(null);
  const [delBusy, setDelBusy] = React.useState(false);

  const confirmDelete = async () => {
    if (!deleting) return;
    setDelBusy(true);
    try {
      const res = await fetch(`/api/admin/education/${deleting.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal");
      toast.success("Riwayat dihapus.");
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
          <h1 className="font-display text-2xl font-bold">Kelola Pendidikan</h1>
          <p className="text-sm text-muted-foreground">{items.length} item.</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }} variant="gradient">
          <Plus className="h-4 w-4" /> Tambah
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Institusi</TableHead>
              <TableHead className="hidden sm:table-cell">Jurusan</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead className="hidden md:table-cell">Tahun</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                  Belum ada riwayat.
                </TableCell>
              </TableRow>
            ) : (
              items.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.institution}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {e.field_of_study}
                  </TableCell>
                  <TableCell>
                    <Badge variant="muted" className="gap-1">
                      {EDUCATION_TYPE_META[e.type].emoji} {EDUCATION_TYPE_META[e.type].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {e.start_year}
                    {e.end_year ? `–${e.end_year}` : "–Sekarang"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" title="Edit" onClick={() => { setEditing(e); setFormOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Hapus" className="hover:text-destructive" onClick={() => setDeleting(e)}>
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

      <EduFormDialog open={formOpen} onOpenChange={setFormOpen} item={editing} />

      <ConfirmDelete
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Hapus Riwayat?"
        description={`"${deleting?.institution}" akan dihapus permanen.`}
        busy={delBusy}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function EduFormDialog({
  open,
  onOpenChange,
  item,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Education | null;
}) {
  const router = useRouter();
  const isEdit = Boolean(item);
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: DEFAULTS,
  });

  React.useEffect(() => {
    if (open) {
      reset(
        item
          ? {
              type: item.type,
              institution: item.institution,
              field_of_study: item.field_of_study,
              logo_url: item.logo_url ?? null,
              degree_level: item.degree_level ?? null,
              start_year: item.start_year ?? null,
              end_year: item.end_year ?? null,
              is_current: item.is_current,
              gpa: item.gpa ?? null,
              description: item.description ?? "",
              relevant_subjects: item.relevant_subjects,
              achievements: item.achievements ?? "",
              institution_url: item.institution_url ?? null,
              display_order: item.display_order,
            }
          : DEFAULTS
      );
    }
  }, [open, item, reset]);

  const onSubmit = async (data: EducationFormValues) => {
    setSubmitting(true);
    try {
      const url = isEdit ? `/api/admin/education/${item!.id}` : "/api/admin/education";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Gagal menyimpan");
      toast.success(isEdit ? "Diperbarui." : "Dibuat.");
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
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Pendidikan" : "Tambah Pendidikan"}</DialogTitle>
          <DialogDescription>{isEdit ? "Perbarui detail." : "Tambah item baru."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Tipe *</Label>
              <Select value={watch("type")} onValueChange={(v) => setValue("type", v as EducationType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(EDUCATION_TYPE_META) as EducationType[]).map((k) => (
                    <SelectItem key={k} value={k}>
                      {EDUCATION_TYPE_META[k].emoji} {EDUCATION_TYPE_META[k].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Jenjang</Label>
              <Input placeholder="S1 / Sertifikat / ..." {...register("degree_level")} />
            </div>
            <div className="space-y-2">
              <Label>IPK (opsional)</Label>
              <Input type="number" step="0.01" min={0} max={4} placeholder="cth: 3.78" {...register("gpa")} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Institusi *</Label>
              <Input {...register("institution")} />
              {errors.institution && <p className="text-xs text-destructive">{errors.institution.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Jurusan/Nama Kursus *</Label>
              <Input {...register("field_of_study")} />
              {errors.field_of_study && <p className="text-xs text-destructive">{errors.field_of_study.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Logo (URL)</Label>
              <Input {...register("logo_url")} />
            </div>
            <div className="space-y-2">
              <Label>Tahun Mulai</Label>
              <Input type="number" min={1900} max={2100} placeholder="2022" {...register("start_year")} />
            </div>
            <div className="space-y-2">
              <Label>Tahun Selesai</Label>
              <Input type="number" min={1900} max={2100} disabled={watch("is_current")} placeholder="2026" {...register("end_year")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>URL Institusi</Label>
            <Input placeholder="https://..." {...register("institution_url")} />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={watch("is_current") ?? false} onChange={(e) => setValue("is_current", e.target.checked)} className="accent-primary" />
            Masih berlangsung
          </label>

          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea rows={2} {...register("description")} />
          </div>

          <div className="space-y-2">
            <Label>Mata Kuliah Relevan</Label>
            <TagInput value={watch("relevant_subjects") ?? []} onChange={(v) => setValue("relevant_subjects", v)} placeholder="cth: Algoritma, lalu Enter" />
          </div>

          <div className="space-y-2">
            <Label>Pencapaian</Label>
            <Textarea rows={2} {...register("achievements")} />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Label>Urutan</Label>
            <Input type="number" min={0} className="w-28" {...register("display_order")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" variant="gradient" disabled={submitting}>
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</> : isEdit ? "Simpan" : "Buat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
