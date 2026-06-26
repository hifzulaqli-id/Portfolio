"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Pencil,
  Plus,
  Trash2,
  Loader2,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { serviceSchema, type ServiceFormValues } from "@/lib/validations";
import { ICON_OPTIONS } from "@/lib/icons";
import { CATEGORY_META, type Service, type ProjectCategory } from "@/types";

// Categories are locked — no create/delete. Edit content only.
export function ServiceManager({ services }: { services: Service[] }) {
  const router = useRouter();
  const [editing, setEditing] = React.useState<Service | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);

  const openEdit = (s: Service) => setEditing(s);

  const toggle = async (s: Service) => {
    setBusy(s.category);
    try {
      const res = await fetch(`/api/admin/services/${s.category}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // Send full object with toggled is_active
        body: JSON.stringify({ ...toFormValues(s), is_active: !s.is_active }),
      });
      if (!res.ok) throw new Error("Gagal");
      toast.success(
        s.is_active ? "Service disembunyikan." : "Service dipublikasikan."
      );
      setEditing(null);
      router.refresh();
    } catch {
      toast.error("Gagal mengubah status service.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Layanan</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Edit konten 4 layanan utama. Kategori terkunci — bisa edit konten,
          paket, FAQ, dan tools, tapi tidak bisa tambah/hapus layanan.
        </p>
      </div>

      <div className="grid gap-3">
        {services.map((s) => {
          const meta = CATEGORY_META[s.category];
          return (
            <div
              key={s.category}
              className="flex items-center gap-4 rounded-md border p-4"
            >
              <span className="text-2xl">{meta.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{s.title}</span>
                  {!s.is_active && (
                    <Badge variant="secondary">Nonaktif</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {s.description}
                </p>
                <div className="mt-1 flex gap-3 text-[11px] text-muted-foreground">
                  <span>{s.packages.length} paket</span>
                  <span>{s.faq.length} FAQ</span>
                  <span>{s.includes.length} termasuk</span>
                  <span>{s.tools.length} tools</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggle(s)}
                  disabled={busy === s.category}
                  title={s.is_active ? "Sembunyikan" : "Tampilkan"}
                >
                  {busy === s.category ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : s.is_active ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(s)}
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <ServiceForm
          service={editing}
          onOpenChange={(o) => !o && setEditing(null)}
        />
      )}
    </div>
  );
}

function toFormValues(s: Service): ServiceFormValues {
  return {
    icon: s.icon,
    title: s.title,
    description: s.description,
    features: s.features,
    longDescription: s.longDescription,
    includes: s.includes,
    tools: s.tools,
    packages: s.packages,
    faq: s.faq,
    display_order: s.display_order,
    is_active: s.is_active,
  };
}

function ServiceForm({
  service,
  onOpenChange,
}: {
  service: Service;
  onOpenChange: (o: boolean) => void;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const meta = CATEGORY_META[service.category as ProjectCategory];

  // Local mutable state for all fields (incl. nested arrays)
  const [form, setForm] = React.useState<ServiceFormValues>(() =>
    toFormValues(service)
  );

  React.useEffect(() => {
    setForm(toFormValues(service));
  }, [service]);

  const update = <K extends keyof ServiceFormValues>(
    key: K,
    value: ServiceFormValues[K]
  ) => setForm((f) => ({ ...f, [key]: value }));

  // String-list helpers (features, includes, tools)
  const addListItem = (key: "features" | "includes" | "tools") =>
    update(key, [...form[key], ""]);
  const setListItem = (
    key: "features" | "includes" | "tools",
    i: number,
    value: string
  ) =>
    update(
      key,
      form[key].map((v, idx) => (idx === i ? value : v))
    );
  const removeListItem = (
    key: "features" | "includes" | "tools",
    i: number
  ) => update(key, form[key].filter((_, idx) => idx !== i));

  // Package helpers
  const addPackage = () =>
    update("packages", [
      ...form.packages,
      { name: "", tagline: "", perks: [], featured: false },
    ]);
  const setPackage = (i: number, patch: Partial<ServiceFormValues["packages"][number]>) =>
    update(
      "packages",
      form.packages.map((p, idx) => (idx === i ? { ...p, ...patch } : p))
    );
  const removePackage = (i: number) =>
    update("packages", form.packages.filter((_, idx) => idx !== i));

  // FAQ helpers
  const addFaq = () =>
    update("faq", [...form.faq, { q: "", a: "" }]);
  const setFaq = (i: number, patch: Partial<ServiceFormValues["faq"][number]>) =>
    update("faq", form.faq.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  const removeFaq = (i: number) =>
    update("faq", form.faq.filter((_, idx) => idx !== i));

  const onSubmit = async () => {
    // Trim string lists & drop empty entries
    const cleaned: ServiceFormValues = {
      ...form,
      features: form.features.map((v) => v.trim()).filter(Boolean),
      includes: form.includes.map((v) => v.trim()).filter(Boolean),
      tools: form.tools.map((v) => v.trim()).filter(Boolean),
      packages: form.packages.map((p) => ({
        ...p,
        name: p.name.trim(),
        tagline: p.tagline?.trim() ?? "",
        perks: p.perks.map((v) => v.trim()).filter(Boolean),
      })),
      faq: form.faq
        .map((f) => ({ q: f.q.trim(), a: f.a.trim() }))
        .filter((f) => f.q && f.a),
    };

    const result = serviceSchema.safeParse(cleaned);
    if (!result.success) {
      toast.error("Validasi gagal. Periksa field bertanda.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/services/${service.category}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Gagal");
      }
      toast.success("Layanan diperbarui.");
      onOpenChange(false);
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message || "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {meta.emoji} Edit Layanan — {service.title}
          </DialogTitle>
          <DialogDescription>
            Kategori <code>{service.category}</code> terkunci. Edit konten
            tampilan publik.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Basics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Judul</Label>
              <Input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Icon (Lucide)</Label>
              <Select
                value={form.icon}
                onValueChange={(v) => update("icon", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Deskripsi Singkat</Label>
            <Textarea
              rows={2}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Deskripsi Panjang</Label>
            <Textarea
              rows={4}
              value={form.longDescription ?? ""}
              onChange={(e) => update("longDescription", e.target.value)}
            />
          </div>

          {/* String lists */}
          <StringList
            label="Fitur (chips)"
            items={form.features}
            onAdd={() => addListItem("features")}
            onChange={(i, v) => setListItem("features", i, v)}
            onRemove={(i) => removeListItem("features", i)}
            placeholder="cth: Landing page"
          />
          <StringList
            label="Yang Sudah Termasuk"
            items={form.includes}
            onAdd={() => addListItem("includes")}
            onChange={(i, v) => setListItem("includes", i, v)}
            onRemove={(i) => removeListItem("includes", i)}
            placeholder="cth: Desain UI/UX responsif"
          />
          <StringList
            label="Tools & Software"
            items={form.tools}
            onAdd={() => addListItem("tools")}
            onChange={(i, v) => setListItem("tools", i, v)}
            onRemove={(i) => removeListItem("tools", i)}
            placeholder="cth: Next.js"
          />

          {/* Packages */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Paket</Label>
              <Button type="button" size="sm" variant="outline" onClick={addPackage}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Tambah Paket
              </Button>
            </div>
            <div className="space-y-3">
              {form.packages.map((pkg, i) => (
                <div key={i} className="rounded-md border p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Nama paket"
                      value={pkg.name}
                      onChange={(e) => setPackage(i, { name: e.target.value })}
                      className="flex-1"
                    />
                    <label className="flex items-center gap-1.5 text-xs whitespace-nowrap">
                      <Switch
                        checked={!!pkg.featured}
                        onCheckedChange={(v) => setPackage(i, { featured: v })}
                      />
                      Populer
                    </label>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removePackage(i)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Tagline paket"
                    value={pkg.tagline ?? ""}
                    onChange={(e) => setPackage(i, { tagline: e.target.value })}
                  />
                  <StringList
                    label={`Perks ${pkg.name || `#${i + 1}`}`}
                    items={pkg.perks}
                    onAdd={() => setPackage(i, { perks: [...pkg.perks, ""] })}
                    onChange={(pi, pv) =>
                      setPackage(i, {
                        perks: pkg.perks.map((v, idx) =>
                          idx === pi ? pv : v
                        ),
                      })
                    }
                    onRemove={(pi) =>
                      setPackage(i, {
                        perks: pkg.perks.filter((_, idx) => idx !== pi),
                      })
                    }
                    placeholder="cth: 1 halaman"
                    compact
                  />
                </div>
              ))}
              {form.packages.length === 0 && (
                <p className="text-xs text-muted-foreground">Belum ada paket.</p>
              )}
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>FAQ</Label>
              <Button type="button" size="sm" variant="outline" onClick={addFaq}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Tambah FAQ
              </Button>
            </div>
            <div className="space-y-3">
              {form.faq.map((f, i) => (
                <div key={i} className="rounded-md border p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Pertanyaan"
                      value={f.q}
                      onChange={(e) => setFaq(i, { q: e.target.value })}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeFaq(i)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    rows={2}
                    placeholder="Jawaban"
                    value={f.a}
                    onChange={(e) => setFaq(i, { a: e.target.value })}
                  />
                </div>
              ))}
              {form.faq.length === 0 && (
                <p className="text-xs text-muted-foreground">Belum ada FAQ.</p>
              )}
            </div>
          </div>

          {/* Visibility */}
          <label className="flex items-center gap-2 text-sm">
            <Switch
              checked={form.is_active}
              onCheckedChange={(v) => update("is_active", v)}
            />
            Tampilkan layanan ini di situs publik
          </label>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button type="button" onClick={onSubmit} disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StringList({
  label,
  items,
  onAdd,
  onChange,
  onRemove,
  placeholder,
  compact,
}: {
  label: string;
  items: string[];
  onAdd: () => void;
  onChange: (i: number, value: string) => void;
  onRemove: (i: number) => void;
  placeholder?: string;
  compact?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" size="sm" variant="ghost" onClick={onAdd}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className={`space-y-1.5 ${compact ? "" : "sm:grid sm:grid-cols-2 sm:gap-1.5"}`}>
        {items.map((v, i) => (
          <div key={i} className="flex items-center gap-1">
            <Input
              value={v}
              onChange={(e) => onChange(i, e.target.value)}
              placeholder={placeholder}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => onRemove(i)}
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground">Kosong.</p>
        )}
      </div>
    </div>
  );
}
