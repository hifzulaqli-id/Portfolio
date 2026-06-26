import Link from "next/link";
import { Wrench, ArrowLeft, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getProfile } from "@/lib/data/profile";
import { getSettings } from "@/lib/data/settings";
import { getNavItems } from "@/lib/data/nav-items";
import { Button } from "@/components/ui/button";

export async function PublicShell({ children }: { children: React.ReactNode }) {
  const [profile, settings, navItems] = await Promise.all([
    getProfile(),
    getSettings(),
    getNavItems({ activeOnly: true }),
  ]);

  // Maintenance gate — admin panel & login bypass this (they don't use PublicShell).
  if (settings.maintenance_mode) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-dots opacity-30" />
        </div>
        <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Wrench className="h-8 w-8" />
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium backdrop-blur-sm">
          <Sparkles className="h-3 w-3" />
          {profile.full_name}
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
          Sedang Pemeliharaan
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          {settings.maintenance_message ||
            "Situs sedang dalam pemeliharaan. Kami akan kembali segera!"}
        </p>
        <Button asChild variant="outline" size="sm" className="mt-8">
          <Link href="/admin/login">
            <ArrowLeft className="h-4 w-4" />
            Admin Login
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Navbar navItems={navItems} />
      <main className="min-h-screen">{children}</main>
      <Footer profile={profile} navItems={navItems} />
    </>
  );
}
