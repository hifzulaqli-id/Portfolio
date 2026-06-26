"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Mail,
  MailOpen,
  Archive,
  ArchiveRestore,
  Trash2,
  Loader2,
  Inbox,
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
  DialogFooter,
} from "@/components/ui/dialog";
import { CATEGORY_META, type Message } from "@/types";
import { formatDate, timeAgo } from "@/lib/utils";

export function MessagesManager({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [selected, setSelected] = React.useState<Message | null>(null);
  const [deleting, setDeleting] = React.useState<Message | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);

  const patch = async (
    m: Message,
    action: "read" | "unread" | "archive" | "unarchive"
  ) => {
    setBusy(m.id);
    try {
      const res = await fetch(`/api/admin/messages/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error("Gagal");
      const json = await res.json();
      setSelected((s) => (s?.id === m.id ? json.message : s));
      toast.success("Diperbarui.");
      router.refresh();
    } catch {
      toast.error("Gagal memperbarui.");
    } finally {
      setBusy(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(deleting.id);
    try {
      const res = await fetch(`/api/admin/messages/${deleting.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal");
      toast.success("Pesan dihapus.");
      setDeleting(null);
      setSelected(null);
      router.refresh();
    } catch {
      toast.error("Gagal menghapus.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Pesan Masuk</h1>
        <p className="text-sm text-muted-foreground">
          {messages.length} pesan · {messages.filter((m) => !m.is_read).length}{" "}
          belum dibaca.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%]">Nama</TableHead>
              <TableHead className="hidden md:table-cell">Layanan</TableHead>
              <TableHead className="w-[35%]">Pesan</TableHead>
              <TableHead className="hidden sm:table-cell">Tanggal</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  <Inbox className="mx-auto mb-2 h-8 w-8 opacity-40" />
                  Belum ada pesan masuk.
                </TableCell>
              </TableRow>
            ) : (
              messages.map((m) => (
                <TableRow
                  key={m.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelected(m);
                    if (!m.is_read) patch(m, "read");
                  }}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {!m.is_read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-secondary" />
                      )}
                      <div className="min-w-0">
                        <div
                          className={
                            m.is_read
                              ? "truncate font-medium"
                              : "truncate font-semibold"
                          }
                        >
                          {m.name}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {m.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {m.service ? (
                      <Badge variant="muted">
                        {CATEGORY_META[m.service].short}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {m.message}
                    </p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                    {timeAgo(m.created_at)}
                  </TableCell>
                  <TableCell>
                    {m.is_archived ? (
                      <Badge variant="muted">Arsip</Badge>
                    ) : m.is_read ? (
                      <Badge variant="success">Dibaca</Badge>
                    ) : (
                      <Badge variant="warning">Baru</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selected.name}
                  {selected.is_archived && (
                    <Badge variant="muted">Diarsipkan</Badge>
                  )}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">
                      Email
                    </div>
                    <a
                      href={`mailto:${selected.email}`}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      {selected.email}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">
                      Layanan
                    </div>
                    <div>
                      {selected.service
                        ? CATEGORY_META[selected.service].label
                        : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">
                      Diterima
                    </div>
                    <div>{formatDate(selected.created_at, { dateStyle: "full" })}</div>
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-background/40 p-4">
                  <div className="mb-2 text-xs uppercase text-muted-foreground">
                    Pesan
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {selected.message}
                  </p>
                </div>
              </div>
              <DialogFooter className="flex-wrap gap-2 sm:flex-nowrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    patch(selected, selected.is_read ? "unread" : "read")
                  }
                  disabled={busy === selected.id}
                >
                  {selected.is_read ? (
                    <>
                      <Mail className="h-4 w-4" /> Tandai Belum Dibaca
                    </>
                  ) : (
                    <>
                      <MailOpen className="h-4 w-4" /> Tandai Dibaca
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    patch(selected, selected.is_archived ? "unarchive" : "archive")
                  }
                  disabled={busy === selected.id}
                >
                  {selected.is_archived ? (
                    <>
                      <ArchiveRestore className="h-4 w-4" /> Buka Arsip
                    </>
                  ) : (
                    <>
                      <Archive className="h-4 w-4" /> Arsipkan
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleting(selected)}
                  disabled={busy === selected.id}
                >
                  <Trash2 className="h-4 w-4" /> Hapus
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Pesan?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Pesan dari {deleting?.name} akan dihapus permanen.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={!!busy}
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
