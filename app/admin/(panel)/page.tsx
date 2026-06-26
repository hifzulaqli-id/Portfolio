import Link from "next/link";
import {
  FolderKanban,
  Mail,
  MessageSquareQuote,
  ArrowRight,
  Inbox,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { StatCard } from "@/components/admin/stat-card";
import nextDynamic from "next/dynamic";
const CategoryChart = nextDynamic(
  () => import("@/components/admin/category-chart").then(mod => mod.CategoryChart),
  { ssr: false, loading: () => <div className="h-[260px] w-full animate-pulse rounded-lg bg-muted/40" /> }
);
import { Badge } from "@/components/ui/badge";
import { getAdminStats } from "@/lib/data/stats";
import { getMessages } from "@/lib/data/messages";
import { CATEGORY_META } from "@/types";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, messages] = await Promise.all([
    getAdminStats(),
    getMessages(),
  ]);
  const recent = messages.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan aktivitas portofolio Anda.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Proyek"
          value={stats.totalProjects}
          icon={FolderKanban}
          hint={`${stats.publishedProjects} published`}
        />
        <StatCard
          label="Pesan Belum Dibaca"
          value={stats.unreadMessages}
          icon={Mail}
          accent="secondary"
          hint={stats.unreadMessages > 0 ? "Butuh perhatian" : "Semua aman"}
        />
        <StatCard
          label="Testimoni"
          value={stats.totalTestimonials}
          icon={MessageSquareQuote}
        />
        <StatCard
          label="Published"
          value={stats.publishedProjects}
          icon={FolderKanban}
          accent="secondary"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Proyek per Kategori</CardTitle>
            <CardDescription>Distribusi semua proyek</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryChart data={stats.projectsByCategory} />
          </CardContent>
        </Card>

        {/* Recent messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Pesan Terbaru</CardTitle>
              <CardDescription>{recent.length} pesan masuk</CardDescription>
            </div>
            <Link
              href="/admin/messages"
              className="text-xs text-primary hover:underline"
            >
              Lihat semua
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {recent.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
                <Inbox className="h-8 w-8 opacity-40" />
                Belum ada pesan.
              </div>
            ) : (
              recent.map((m) => (
                <Link
                  key={m.id}
                  href="/admin/messages"
                  className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/40 p-3 transition-colors hover:border-primary/40"
                >
                  {!m.is_read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-secondary" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">
                        {m.name}
                      </span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {timeAgo(m.created_at)}
                      </span>
                    </div>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {m.message}
                    </p>
                    {m.service && (
                      <Badge variant="muted" className="mt-1.5">
                        {CATEGORY_META[m.service].short}
                      </Badge>
                    )}
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <QuickAction href="/admin/projects" label="Kelola Proyek" />
          <QuickAction href="/admin/messages" label="Lihat Pesan" />
          <QuickAction href="/admin/profile" label="Edit Profil" />
        </CardContent>
      </Card>
    </div>
  );
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-4 py-2 text-sm font-medium transition-all hover:border-primary/40 hover:text-primary"
    >
      {label}
      <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}
