"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import {
  navItemSchema,
  NAV_LOCATION_VALUES,
  type NavItemFormValues,
} from "@/lib/validations";
import { ICON_OPTIONS, DynamicIcon } from "@/lib/icons";
import {
  NAV_LOCATION_META,
  type NavItem,
  type NavLocation,
} from "@/types";

const DEFAULTS: NavItemFormValues = {
  location: "navbar",
  label: "",
  href: "/",
  icon: "",
  description: null,
  display_order: 0,
  is_active: true,
  open_in_new_tab: false,
};

export function NavManager({ navItems }: { navItems: NavItem[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<NavItem | null>(null);
  const [deleting, setDeleting] = React.useState<NavItem | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (n: NavItem) => {
    setEditing(n);
    setFormOpen(true);
  };

  const remove = async () => {
    if (!deleting) return;
    setBusy(deleting.id);
    try {
      const res = await fetch(`/api/admin/nav-items/${deleting.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal");
      toast.success("Item menu dihapus.");
      router.refresh();
    } catch {
      toast.error("Gagal menghapus item menu.");
    } finally {
      setBusy(null);
      setDeleting(null);
    }
  };

  // Group by location for display
  const groups = NAV_LOCATION_VALUES.map((loc) => ({
    location: loc,
    items: navItems.filter((n) => n.location === loc),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Menu Navigasi</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola link menu di navbar (desktop &amp; mobile), dropdown Profil,
            dan footer.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Tambah Link
        </Button>
      </div>

      {groups.map((group) => (
        <div key={group.location} className="space-y-2">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold">
              {NAV_LOCATION_META[group.location].label}
            </h2>
            <span className="text-xs text-muted-foreground">
              {NAV_LOCATION_META[group.location].hint}
            </span>
          </div>
          <div className="rounded-md border divide-y">
            {group.items.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                Belum ada item di lokasi ini.
              </div>
            ) : (
              group.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  {item.icon ? (
                    <DynamicIcon
                      name={item.icon}
                      className="h-4 w-4 text-muted-foreground shrink-0"
                    />
                  ) : (
                    <span className="h-4 w-4 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">
                        {item.label}
                      </span>
                      {!item.is_active && (
                        <Badge variant="secondary">Nonaktif</Badge>
                      )}
                      {item.open_in_new_tab && (
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <a
                      href={item.href}
                      className="text-xs text-muted-foreground truncate hover:text-primary"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.href}
                    </a>
                    {item.description && (
                      <p className="text-xs text-muted-foreground/70 truncate">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground font-mono shrink-0">
                    #{item.display_order}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(item)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleting(item)}
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}

      <NavForm open={formOpen} onOpenChange={setFormOpen} editing={editing} />

      <ConfirmDelete
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Hapus item menu?"
        description={`"${deleting?.label}" akan dihapus dari menu.`}
        onConfirm={remove}
        busy={!!busy}
      />
    </div>
  );
}

function NavForm({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing: NavItem | null;
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
  } = useForm<NavItemFormValues>({
    resolver: zodResolver(navItemSchema),
    defaultValues: DEFAULTS,
  });

  const location = watch("location");
  const icon = watch("icon");
  const isActive = watch("is_active");
  const newTab = watch("open_in_new_tab");

  React.useEffect(() => {
    if (open) {
      reset(
        editing
          ? {
              location: editing.location,
              label: editing.label,
              href: editing.href,
              icon: editing.icon ?? "",
              description: editing.description ?? "",
              display_order: editing.display_order,
              is_active: editing.is_active,
              open_in_new_tab: editing.open_in_new_tab,
            }
          : DEFAULTS
      );
    }
  }, [open, editing, reset]);

  const onSubmit = async (values: NavItemFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/admin/nav-items${editing ? `/${editing.id}` : ""}`,
        { method: editing ? "PUT" : "POST", body: JSON.stringify(values) }
      );
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Gagal");
      }
      toast.success(editing ? "Item menu diperbarui." : "Item menu dibuat.");
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
          <DialogTitle>
            {editing ? "Edit Item Menu" : "Item Menu Baru"}
          </DialogTitle>
          <DialogDescription>
            Atur label, link, dan lokasi tampil item menu.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Label</Label>
              <Input placeholder="cth: Portofolio" {...register("label")} />
              {errors.label && (
                <p className="text-xs text-destructive">
                  {errors.label.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Lokasi</Label>
              <Select
                value={location}
                onValueChange={(v) => setValue("location", v as NavLocation)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NAV_LOCATION_VALUES.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {NAV_LOCATION_META[loc].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>URL / Link</Label>
            <Input placeholder="/projects atau https://..." {...register("href")} />
            {errors.href && (
              <p className="text-xs text-destructive">{errors.href.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Icon (opsional)</Label>
              <Select
                value={icon || "__none__"}
                onValueChange={(v) =>
                  setValue("icon", v === "__none__" ? "" : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tanpa icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— Tanpa icon —</SelectItem>
                  {ICON_OPTIONS.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Urutan</Label>
              <Input
                type="number"
                min={0}
                {...register("display_order", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Deskripsi (opsional, dropdown Profil)</Label>
            <Input
              placeholder="cth: Biografi & latar belakang"
              {...register("description")}
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={isActive}
                onCheckedChange={(v) => setValue("is_active", v)}
              />
              Aktif
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={newTab}
                onCheckedChange={(v) => setValue("open_in_new_tab", v)}
              />
              Buka di tab baru
            </label>
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
