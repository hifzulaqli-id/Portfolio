"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
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
import { experienceSchema, type ExperienceFormValues } from "@/lib/validations";
import {
  EXPERIENCE_TYPE_META,
  EMPLOYMENT_TYPE_META,
  type Experience,
  type ExperienceType,
  type EmploymentType,
} from "@/types";

const DEFAULTS: ExperienceFormValues = {
  type: "job",
  position: "",
  company: "",
  logo_url: null,
  location: null,
  employment_type: null,
  start_date: "",
  end_date: null,
  is_current: false,
  description: "",
  tech_stack: [],
  achievements: "",
  company_url: null,
  display_order: 0,
  is_active: true,
};

export function ExperienceManager({ items }: { items: Experience[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Experience | null>(null);
  const [deleting, setDeleting] = React.useState<Experience | null>(null);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [delBusy, setDelBusy] = React.useState(false);

  const toggle = async (e: Experience) => {
    setBusyId(e.id);
    try {
      const res = await fetch(`/api/admin/experiences/${e.id}/toggle`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Gagal");
      toast.success(e.is_active ? "Disembunyikan." : "Ditampilkan.");
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
      const res = await fetch(`/api/admin/experiences/${deleting.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal");
      toast.success("Pengalaman dihapus.");
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
          <h1 className="font-display text-2xl font-bold">Kelola Pengalaman</h1>
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
              <TableHead>Posisi</TableHead>
              <TableHead className="hidden sm:table-cell">Perusahaan</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                  Belum ada pengalaman.
                </TableCell>
              </TableRow>
            ) : (
              items.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.position}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {e.company}
                  </TableCell>
                  <TableCell>
                    <Badge variant="muted" className="gap-1">
                      {EXPERIENCE_TYPE_META[e.type].emoji} {EXPERIENCE_TYPE_META[e.type].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {e.is_active ? (
                      <Badge variant="success">Aktif</Badge>
                    ) : (
                      <Badge variant="muted">Disembunyikan</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" title="Toggle" onClick={() => toggle(e)} disabled={busyId === e.id}>
                        {busyId === e.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : e.is_active ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
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

      <ExpFormDialog open={formOpen} onOpenChange={setFormOpen} item={editing} />

      <ConfirmDelete
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Hapus Pengalaman?"
        description={`"${deleting?.position}" akan dihapus permanen.`}
        busy={delBusy}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function ExpFormDialog({
  open,
  onOpenChange,
  item,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Experience | null;
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
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: DEFAULTS,
  });

  React.useEffect(() => {
    if (open) {
      reset(
        item
          ? {
              type: item.type,
              position: item.position,
              company: item.company,
              logo_url: item.logo_url ?? null,
              location: item.location ?? null,
              employment_type: item.employment_type ?? null,
              start_date: item.start_date,
              end_date: item.end_date ?? null,
              is_current: item.is_current,
              description: item.description ?? "",
              tech_stack: item.tech_stack,
              achievements: item.achievements ?? "",
              company_url: item.company_url ?? null,
              display_order: item.display_order,
              is_active: item.is_active,
            }
          : DEFAULTS
      );
    }
  }, [open, item, reset]);

  const onSubmit = async (data: ExperienceFormValues) => {
    setSubmitting(true);
    try {
      const url = isEdit ? `/api/admin/experiences/${item!.id}` : "/api/admin/experiences";
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

  const isCurrent = watch("is_current");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Pengalaman" : "Tambah Pengalaman"}</DialogTitle>
          <DialogDescription>{isEdit ? "Perbarui detail." : "Tambah item baru."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tipe *</Label>
              <Select value={watch("type")} onValueChange={(v) => setValue("type", v as ExperienceType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(EXPERIENCE_TYPE_META) as ExperienceType[]).map((k) => (
                    <SelectItem key={k} value={k}>
                      {EXPERIENCE_TYPE_META[k].emoji} {EXPERIENCE_TYPE_META[k].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipe Kerja</Label>
              <Select
                value={watch("employment_type") ?? ""}
                onValueChange={(v) => setValue("employment_type", v as EmploymentType)}
              >
                <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(EMPLOYMENT_TYPE_META) as EmploymentType[]).map((k) => (
                    <SelectItem key={k} value={k}>{EMPLOYMENT_TYPE_META[k].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Posisi *</Label>
              <Input {...register("position")} />
              {errors.position && <p className="text-xs text-destructive">{errors.position.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Perusahaan/Organisasi *</Label>
              <Input {...register("company")} />
              {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Logo (URL)</Label>
              <Input {...register("logo_url")} />
            </div>
            <div className="space-y-2">
              <Label>Lokasi</Label>
              <Input {...register("location")} />
            </div>
            <div className="space-y-2">
              <Label>URL Perusahaan</Label>
              <Input placeholder="https://..." {...register("company_url")} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tanggal Mulai *</Label>
              <Input type="date" {...register("start_date")} />
              {errors.start_date && <p className="text-xs text-destructive">{errors.start_date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Tanggal Selesai</Label>
              <Input type="date" disabled={isCurrent} {...register("end_date")} />
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={isCurrent ?? false} onChange={(e) => setValue("is_current", e.target.checked)} className="accent-primary" />
                Masih berlangsung
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea rows={3} {...register("description")} />
          </div>

          <div className="space-y-2">
            <Label>Tech Stack</Label>
            <TagInput value={watch("tech_stack") ?? []} onChange={(v) => setValue("tech_stack", v)} />
          </div>

          <div className="space-y-2">
            <Label>Pencapaian</Label>
            <Textarea rows={2} placeholder="cth: Meningkatkan engagement 3x lipat..." {...register("achievements")} />
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={watch("is_active") ?? true} onChange={(e) => setValue("is_active", e.target.checked)} className="accent-primary" />
              Tampil publik
            </label>
            <div className="flex items-center gap-2 text-sm">
              <Label className="m-0">Urutan</Label>
              <Input type="number" min={0} className="w-24" {...register("display_order")} />
            </div>
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
