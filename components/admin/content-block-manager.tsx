"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { ContentBlock } from "@/types";
import { IconPicker } from "@/components/shared/icon-picker";

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero (Beranda)",
  process: "Proses Kerja",
  "contact-cta": "Contact CTA",
  about: "Tentang Saya",
};

export function ContentBlockManager({ blocks }: { blocks: ContentBlock[] }) {
  const router = useRouter();

  // Group by section, preserving section order
  const sections = Array.from(new Set(blocks.map((b) => b.section)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Konten Section</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Edit teks & daftar yang tampil di berbagai section beranda dan halaman.
        </p>
      </div>

      {sections.map((section) => (
        <div key={section} className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {SECTION_LABELS[section] ?? section}
          </h2>
          <div className="grid gap-3">
            {blocks
              .filter((b) => b.section === section)
              .map((block) => (
                <BlockEditor key={block.key} block={block} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function BlockEditor({ block }: { block: ContentBlock }) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);

  // Distinguish a string[] value from a Record<string,unknown>[] value.
  const isStringArray = (v: unknown): v is string[] =>
    Array.isArray(v) && v.every((x) => typeof x === "string");
  const isObjectArray = (v: unknown): v is Record<string, unknown>[] =>
    Array.isArray(v) && v.every((x) => x !== null && typeof x === "object");

  // Local state mirrors block.value
  const [textValue, setTextValue] = React.useState(
    typeof block.value === "string" ? block.value : ""
  );
  const [arrayValue, setArrayValue] = React.useState<string[]>(
    isStringArray(block.value) ? block.value : []
  );
  const [jsonValue, setJsonValue] = React.useState<Record<string, unknown>[]>(
    isObjectArray(block.value) ? block.value : []
  );

  React.useEffect(() => {
    setTextValue(typeof block.value === "string" ? block.value : "");
    setArrayValue(isStringArray(block.value) ? block.value : []);
    setJsonValue(isObjectArray(block.value) ? block.value : []);
    setDirty(false);
  }, [block]);

  const markDirty = () => setDirty(true);

  const save = async () => {
    setSaving(true);
    let payload: unknown;
    if (block.type === "text") payload = textValue;
    else if (block.type === "array") payload = arrayValue;
    else payload = jsonValue; // json (array of objects)

    try {
      const res = await fetch(`/api/admin/content-blocks/${block.key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Gagal");
      }
      toast.success("Konten disimpan.");
      setDirty(false);
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message || "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">{block.label}</CardTitle>
            <CardDescription className="font-mono text-[11px]">
              {block.key}
            </CardDescription>
          </div>
          <Badge variant="muted">{block.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {block.type === "text" && (
          <Textarea
            rows={3}
            value={textValue}
            onChange={(e) => {
              setTextValue(e.target.value);
              markDirty();
            }}
          />
        )}

        {block.type === "array" && (
          <div className="space-y-1.5">
            {arrayValue.map((v, i) => (
              <div key={i} className="flex items-center gap-1">
                <Input
                  value={v}
                  onChange={(e) => {
                    setArrayValue((arr) =>
                      arr.map((x, idx) => (idx === i ? e.target.value : x))
                    );
                    markDirty();
                  }}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setArrayValue((arr) => arr.filter((_, idx) => idx !== i));
                    markDirty();
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setArrayValue((arr) => [...arr, ""]);
                markDirty();
              }}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Tambah baris
            </Button>
          </div>
        )}

        {block.type === "json" && (
          <div className="space-y-2">
            {jsonValue.map((obj, i) => (
              <div key={i} className="rounded-md border p-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Item #{i + 1}
                  </span>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => {
                      setJsonValue((arr) => arr.filter((_, idx) => idx !== i));
                      markDirty();
                    }}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
                {Object.keys(obj).map((field) => (
                  <div key={field} className="space-y-0.5">
                    <Label className="text-[11px]">{field}</Label>
                    {field === "icon" ? (
                      <IconPicker
                        value={String(obj[field] ?? "")}
                        onValueChange={(val) => {
                          setJsonValue((arr) =>
                            arr.map((o, idx) =>
                              idx === i ? { ...o, [field]: val } : o
                            )
                          );
                          markDirty();
                        }}
                      />
                    ) : (
                      <Input
                        value={String(obj[field] ?? "")}
                        onChange={(e) => {
                          setJsonValue((arr) =>
                            arr.map((o, idx) =>
                              idx === i ? { ...o, [field]: e.target.value } : o
                            )
                          );
                          markDirty();
                        }}
                      />
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setJsonValue((arr) =>
                      arr.filter((_, idx) => idx !== i)
                    );
                    markDirty();
                  }}
                  className="hidden"
                />
              </div>
            ))}
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  // Add a copy of the last item's shape, or a default object
                  const template =
                    jsonValue[0] ?? { value: "", label: "" };
                  setJsonValue((arr) => [
                    ...arr,
                    Object.fromEntries(
                      Object.keys(template).map((k) => [k, ""])
                    ),
                  ]);
                  markDirty();
                }}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Tambah item
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving || !dirty} size="sm">
            {saving && <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />}
            Simpan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
