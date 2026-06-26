"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Inbox,
  User,
  LogOut,
  Sparkles,
  BarChart3,
  Award,
  Briefcase,
  GraduationCap,
  PenLine,
  Settings,
  ExternalLink,
  Menu,
  X,
  MessageSquareQuote,
  Navigation,
  LayoutTemplate,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const NAV_SECTIONS: {
  title: string;
  items: { href: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[];
}[] = [
  {
    title: "Utama",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/projects", label: "Proyek", icon: FolderKanban },
      { href: "/admin/messages", label: "Pesan", icon: Inbox },
      { href: "/admin/profile", label: "Profil", icon: User },
    ],
  },
  {
    title: "Konten",
    items: [
      { href: "/admin/skills", label: "Skills", icon: BarChart3 },
      { href: "/admin/certifications", label: "Sertifikat", icon: Award },
      { href: "/admin/experiences", label: "Pengalaman", icon: Briefcase },
      { href: "/admin/education", label: "Pendidikan", icon: GraduationCap },
      { href: "/admin/blog", label: "Blog", icon: PenLine },
      { href: "/admin/testimonials", label: "Testimoni", icon: MessageSquareQuote },
      { href: "/admin/services", label: "Layanan", icon: Sparkles },
    ],
  },
  {
    title: "Tampilan",
    items: [
      { href: "/admin/nav-items", label: "Menu Navigasi", icon: Navigation },
      { href: "/admin/content-blocks", label: "Konten Section", icon: LayoutTemplate },
    ],
  },
  {
    title: "Sistem",
    items: [{ href: "/admin/settings", label: "Pengaturan", icon: Settings }],
  },
];

export function AdminSidebar({ fullName }: { fullName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Berhasil keluar.");
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-sm font-bold">Admin Panel</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-card transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-2 border-b border-border p-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <div className="font-display text-sm font-bold">Admin Panel</div>
            <div className="text-xs text-muted-foreground">{fullName}</div>
          </div>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto p-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <div className="mb-1.5 px-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                {section.title}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href, item.exact);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="space-y-1 border-t border-border p-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            Lihat Situs
          </Link>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {loading ? "Keluar..." : "Keluar"}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
