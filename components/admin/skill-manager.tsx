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
} from "lucide-react";
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
import { skillSchema, type SkillFormValues } from "@/lib/validations";
import {
  SKILL_CATEGORY_META,
  SKILL_LEVEL_META,
  type Skill,
  type SkillCategory,
  type SkillLevel,
} from "@/types";

const DEFAULTS: SkillFormValues = {
  name: "",
  category: "web-frontend",
  level: "intermediate",
  percentage: 50,
  icon_url: null,
  display_order: 0,
  is_active: true,
};

export function SkillManager({ skills }: { skills: Skill[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Skill | null>(null);
  const [deleting, setDeleting] = React.useState<Skill | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (s: Skill) => {
    setEditing(s);
    setFormOpen(true);
  };

  const toggle = async (s: Skill) => {
    setBusy(s.id);
    try {
      const res = await fetch(`/api/admin/skills/${s.id}/toggle`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Gagal");
      toast.success(s.is_active ? "Skill dinonaktifkan." : "Skill diaktifkan.");
      router.refresh();
    } catch {
      toast.error("Gagal mengubah status.");
    } finally {
      setBusy(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(deleting.id);
    try {
      const res = await fetch(`/api/admin/skills/${deleting.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal");
      toast.success("Skill dihapus.");
      setDeleting(null);
      router.refresh();
    } catch {
      toast.error("Gagal menghapus.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Kelola Skills</h1>
          <p className="text-sm text-muted-foreground">
            {skills.length} skill terdaftar.
          </p>
        </div>
        <Button onClick={openCreate} variant="gradient">
          <Plus className="h-4 w-4" /> Tambah Skill
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Skill</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Level</TableHead>
              <TableHead className="hidden sm:table-cell">Persentase</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                  Belum ada skill. Klik &ldquo;Tambah Skill&rdquo;.
                </TableCell>
              </TableRow>
            ) : (
              skills.map((s) => {
                const cat = SKILL_CATEGORY_META[s.category];
                const lvl = SKILL_LEVEL_META[s.level];
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>
                      <Badge variant="muted" className="gap-1">
                        {cat.emoji} {cat.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium ${lvl.color}`}>
                        {lvl.label}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {s.percentage}%
                    </TableCell>
                    <TableCell>
                      {s.is_active ? (
                        <Badge variant="success">Aktif</Badge>
                      ) : (
                        <Badge variant="muted">Nonaktif</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <IconBtn title={s.is_active ? "Nonaktifkan" : "Aktifkan"} onClick={() => toggle(s)} disabled={busy === s.id}>
                          {busy === s.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : s.is_active ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </IconBtn>
                        <IconBtn title="Edit" onClick={() => openEdit(s)}>
                          <Pencil className="h-4 w-4" />
                        </IconBtn>
                        <IconBtn title="Hapus" onClick={() => setDeleting(s)} className="hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </IconBtn>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <SkillFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        skill={editing}
      />

      <ConfirmDelete
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Hapus Skill?"
        description={`Skill "${deleting?.name}" akan dihapus permanen.`}
        busy={!!busy}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function SkillFormDialog({
  open,
  onOpenChange,
  skill,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill: Skill | null;
}) {
  const router = useRouter();
  const isEdit = Boolean(skill);
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: DEFAULTS,
  });

  React.useEffect(() => {
    if (open) {
      reset(
        skill
          ? {
              name: skill.name,
              category: skill.category,
              level: skill.level,
              percentage: skill.percentage,
              icon_url: skill.icon_url ?? null,
              display_order: skill.display_order,
              is_active: skill.is_active,
            }
          : DEFAULTS
      );
    }
  }, [open, skill, reset]);

  const onSubmit = async (data: SkillFormValues) => {
    setSubmitting(true);
    try {
      const url = isEdit ? `/api/admin/skills/${skill!.id}` : "/api/admin/skills";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Gagal menyimpan");
      toast.success(isEdit ? "Skill diperbarui." : "Skill dibuat.");
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Skill" : "Tambah Skill"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Perbarui detail skill." : "Tambah skill baru."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label>Nama Skill *</Label>
            <Input placeholder="cth: React" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Kategori *</Label>
              <Select
                value={watch("category")}
                onValueChange={(v) => setValue("category", v as SkillCategory)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(SKILL_CATEGORY_META) as SkillCategory[]).map((k) => (
                    <SelectItem key={k} value={k}>
                      {SKILL_CATEGORY_META[k].emoji} {SKILL_CATEGORY_META[k].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Level *</Label>
              <Select
                value={watch("level")}
                onValueChange={(v) => setValue("level", v as SkillLevel)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(SKILL_LEVEL_META) as SkillLevel[]).map((k) => (
                    <SelectItem key={k} value={k}>
                      {SKILL_LEVEL_META[k].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Persentase</Label>
              <span className="font-mono text-sm text-primary">{watch("percentage")}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={watch("percentage")}
              onChange={(e) => setValue("percentage", Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Icon URL (opsional)</Label>
              <Input placeholder="/images/icon.svg atau https://..." {...register("icon_url")} />
            </div>
            <div className="space-y-2">
              <Label>Urutan</Label>
              <Input type="number" min={0} {...register("display_order")} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={watch("is_active") ?? true}
              onChange={(e) => setValue("is_active", e.target.checked)}
              className="accent-primary"
            />
            Aktif (tampil di situs publik)
          </label>

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

function IconBtn({
  children,
  title,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode;
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}
