"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { ProjectFormDialog } from "@/components/admin/project-form";
import {
  CATEGORY_BADGE_VARIANT,
  CATEGORY_META,
  type Project,
} from "@/types";

export function ProjectsManager({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Project | null>(null);
  const [deleting, setDeleting] = React.useState<Project | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = async (p: Project) => {
    setBusy(p.id);
    try {
      const res = await fetch(`/api/admin/projects/${p.id}`);
      if (!res.ok) throw new Error("Gagal mengambil detail proyek");
      const data = await res.json();
      setEditing(data.project);
    } catch {
      toast.error("Gagal mengambil detail proyek. Menggunakan data yang ada.");
      setEditing(p);
    } finally {
      setBusy(null);
      setFormOpen(true);
    }
  };

  const toggle = async (p: Project) => {
    setBusy(p.id);
    try {
      const res = await fetch(`/api/admin/projects/${p.id}/toggle`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Gagal mengubah status");
      toast.success(
        p.status === "published"
          ? "Proyek disembunyikan."
          : "Proyek dipublikasikan."
      );
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
      const res = await fetch(`/api/admin/projects/${deleting.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Proyek dihapus.");
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
          <h1 className="font-display text-2xl font-bold">Kelola Proyek</h1>
          <p className="text-sm text-muted-foreground">
            {projects.length} proyek total.
          </p>
        </div>
        <Button onClick={openCreate} variant="gradient">
          <Plus className="h-4 w-4" />
          Tambah Proyek
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Urutan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                  Belum ada proyek. Klik &ldquo;Tambah Proyek&rdquo; untuk membuat.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{p.title}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        /{p.slug}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={CATEGORY_BADGE_VARIANT[p.category]}>
                      {CATEGORY_META[p.category].short}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {p.status === "published" ? (
                      <Badge variant="success">Published</Badge>
                    ) : (
                      <Badge variant="muted">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {p.display_order}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <IconBtn
                        title={p.status === "published" ? "Sembunyikan" : "Publish"}
                        onClick={() => toggle(p)}
                        disabled={busy === p.id}
                      >
                        {busy === p.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : p.status === "published" ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </IconBtn>
                      <IconBtn title="Edit" onClick={() => openEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </IconBtn>
                      <IconBtn
                        title="Hapus"
                        onClick={() => setDeleting(p)}
                        className="hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </IconBtn>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ProjectFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        project={editing}
      />

      {/* Delete confirmation */}
      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Proyek?</DialogTitle>
            <DialogDescription>
              Proyek &ldquo;{deleting?.title}&rdquo; akan dihapus permanen. Tindakan
              ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="h-4 w-4" />
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
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
