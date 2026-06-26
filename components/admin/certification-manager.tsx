"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { certificationSchema, type CertificationFormValues } from "@/lib/validations";
import {
  CERT_CATEGORY_META,
  CERT_STATUS_META,
  type Certification,
  type CertCategory,
  type CertStatus,
} from "@/types";

const DEFAULTS: CertificationFormValues = {
  name: "",
  issuer: "",
  issuer_logo_url: null,
  category: "web",
  issue_date: null,
  expiry_date: null,
  credential_id: null,
  credential_url: null,
  certificate_image_url: null,
  badge_status: "verified",
  is_public: true,
  is_featured: false,
  display_order: 0,
};

export function CertificationManager({
  items,
}: {
  items: Certification[];
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Certification | null>(null);
  const [deleting, setDeleting] = React.useState<Certification | null>(null);
  const [busy, setBusy] = React.useState(false);

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/certifications/${deleting.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal");
      toast.success("Sertifikat dihapus.");
      setDeleting(null);
      router.refresh();
    } catch {
      toast.error("Gagal menghapus.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Kelola Sertifikat</h1>
          <p className="text-sm text-muted-foreground">{items.length} sertifikat.</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          variant="gradient"
        >
          <Plus className="h-4 w-4" /> Tambah Sertifikat
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead className="hidden sm:table-cell">Penerbit</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Featured</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                  Belum ada sertifikat.
                </TableCell>
              </TableRow>
            ) : (
              items.map((c) => {
                const status = CERT_STATUS_META[c.badge_status];
                const cat = CERT_CATEGORY_META[c.category];
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {c.issuer}
                    </TableCell>
                    <TableCell>
                      <Badge variant="muted" className="gap-1">
                        {cat.emoji} {cat.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {c.is_featured && <Award className="h-4 w-4 text-primary" />}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit"
                          onClick={() => {
                            setEditing(c);
                            setFormOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Hapus"
                          className="hover:text-destructive"
                          onClick={() => setDeleting(c)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <CertFormDialog open={formOpen} onOpenChange={setFormOpen} item={editing} />

      <ConfirmDelete
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Hapus Sertifikat?"
        description={`"${deleting?.name}" akan dihapus permanen.`}
        busy={busy}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function CertFormDialog({
  open,
  onOpenChange,
  item,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Certification | null;
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
  } = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: DEFAULTS,
  });

  React.useEffect(() => {
    if (open) {
      reset(
        item
          ? {
              name: item.name,
              issuer: item.issuer,
              issuer_logo_url: item.issuer_logo_url ?? null,
              category: item.category,
              issue_date: item.issue_date ?? null,
              expiry_date: item.expiry_date ?? null,
              credential_id: item.credential_id ?? null,
              credential_url: item.credential_url ?? null,
              certificate_image_url: item.certificate_image_url ?? null,
              badge_status: item.badge_status,
              is_public: item.is_public,
              is_featured: item.is_featured,
              display_order: item.display_order,
            }
          : DEFAULTS
      );
    }
  }, [open, item, reset]);

  const onSubmit = async (data: CertificationFormValues) => {
    setSubmitting(true);
    try {
      const url = isEdit
        ? `/api/admin/certifications/${item!.id}`
        : "/api/admin/certifications";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Gagal menyimpan");
      toast.success(isEdit ? "Sertifikat diperbarui." : "Sertifikat dibuat.");
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
          <DialogTitle>{isEdit ? "Edit Sertifikat" : "Tambah Sertifikat"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Perbarui detail sertifikat." : "Tambah sertifikat baru."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label>Nama Sertifikat *</Label>
            <Input {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Penerbit *</Label>
              <Input {...register("issuer")} />
              {errors.issuer && <p className="text-xs text-destructive">{errors.issuer.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Logo Penerbit (URL)</Label>
              <Input placeholder="/images/logo.svg atau https://..." {...register("issuer_logo_url")} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Kategori *</Label>
              <Select value={watch("category")} onValueChange={(v) => setValue("category", v as CertCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(CERT_CATEGORY_META) as CertCategory[]).map((k) => (
                    <SelectItem key={k} value={k}>
                      {CERT_CATEGORY_META[k].emoji} {CERT_CATEGORY_META[k].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status Badge *</Label>
              <Select value={watch("badge_status")} onValueChange={(v) => setValue("badge_status", v as CertStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(CERT_STATUS_META) as CertStatus[]).map((k) => (
                    <SelectItem key={k} value={k}>{CERT_STATUS_META[k].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tanggal Terbit</Label>
              <Input type="date" {...register("issue_date")} />
            </div>
            <div className="space-y-2">
              <Label>Tanggal Expired</Label>
              <Input type="date" {...register("expiry_date")} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>ID Kredensial</Label>
              <Input {...register("credential_id")} />
            </div>
            <div className="space-y-2">
              <Label>URL Verifikasi</Label>
              <Input placeholder="https://..." {...register("credential_url")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Gambar Sertifikat (URL)</Label>
            <Input placeholder="/images/cert-1.svg atau https://..." {...register("certificate_image_url")} />
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={watch("is_public") ?? true} onChange={(e) => setValue("is_public", e.target.checked)} className="accent-primary" />
              Tampil publik
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={watch("is_featured") ?? false} onChange={(e) => setValue("is_featured", e.target.checked)} className="accent-primary" />
              Featured (preview beranda)
            </label>
          </div>

          <div className="space-y-2">
            <Label>Urutan Tampil</Label>
            <Input type="number" min={0} {...register("display_order")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" variant="gradient" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
                </>
              ) : isEdit ? (
                "Simpan"
              ) : (
                "Buat"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
