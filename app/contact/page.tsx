import type { Metadata } from "next";
import {
  Mail,
  Clock,
  Instagram,
  MessageCircle,
  Linkedin,
  Github,
  ArrowRight,
  Shield,
  Zap,
  Phone,
} from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { ContactForm } from "@/components/sections/contact-form";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { getProfile } from "@/lib/data/profile";

export const metadata: Metadata = {
  title: "Kontak | Hifzul Aqli",
  description: "Hubungi saya untuk diskusi proyek, kolaborasi, atau sekadar ngobrol. Respons cepat dalam 1×24 jam.",
};

export const revalidate = 60;

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default async function ContactPage() {
  const profile = await getProfile();
  const waLink = profile.whatsapp_number
    ? `https://wa.me/${profile.whatsapp_number}`
    : null;

  return (
    <PublicShell>
      {/* ── Hero Header ── */}
      <section className="relative overflow-hidden pt-28 pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-dots opacity-20 mask-fade-b" />
          <div className="absolute left-1/2 top-0 h-96 w-[700px] -translate-x-1/2 rounded-full bg-primary/8 blur-[100px]" />
        </div>

        <div className="container text-center">
          <ScrollReveal>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <Mail className="h-3.5 w-3.5" />
              — Kontak
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Mari{" "}
              <span className="text-primary-strong">Berkolaborasi!</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Punya proyek atau ide? Ceritakan lewat form di bawah, atau hubungi langsung via kanal favorit Anda.
            </p>
          </ScrollReveal>

        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="pb-20">
        <div className="container grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* ── Form ── */}
          <div className="rounded-3xl border border-border bg-card/50 p-6 backdrop-blur-sm md:p-8">
            <div className="mb-6">
              <h2 className="font-display text-xl font-bold text-foreground">Kirim Pesan</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Isi form di bawah dan saya akan balas secepatnya.
              </p>
            </div>
            <ContactForm />
          </div>

          {/* ── Sidebar ── */}
          <div className="flex flex-col gap-5">
            {/* Contact info cards */}
            <div className="rounded-3xl border border-border bg-card/50 p-6 backdrop-blur-sm">
              <h2 className="mb-5 font-display text-base font-bold text-foreground">Informasi Kontak</h2>
              <div className="flex flex-col gap-3">
                {/* Email */}
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="group flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4 transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15">
                      <Mail className="h-5 w-5 text-blue-500" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Email</div>
                      <div className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{profile.email}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </a>
                )}

                {/* WhatsApp */}
                {waLink && (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4 transition-all hover:border-emerald-500/40 hover:shadow-md"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15">
                      <MessageCircle className="h-5 w-5 text-emerald-500" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">WhatsApp</div>
                      <div className="truncate text-sm font-semibold text-foreground group-hover:text-emerald-500 transition-colors">{profile.whatsapp_number}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" />
                  </a>
                )}

                {/* Jam aktif */}
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15">
                    <Clock className="h-5 w-5 text-amber-500" />
                  </span>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Jam Aktif</div>
                    <div className="text-sm font-semibold text-foreground">Senin – Sabtu</div>
                    <div className="text-[11px] text-muted-foreground">09.00 – 21.00 WIB</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="rounded-3xl border border-border bg-card/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 font-display text-base font-bold text-foreground">Ikuti Saya</h3>
              <div className="flex flex-col gap-2">
                {[
                  { href: profile.instagram_url, icon: Instagram, label: "Instagram", color: "hover:border-pink-500/40 hover:text-pink-500",           iconColor: "text-pink-500 bg-pink-500/15" },
                  { href: profile.linkedin_url,  icon: Linkedin,  label: "LinkedIn",  color: "hover:border-blue-500/40 hover:text-blue-500",           iconColor: "text-blue-500 bg-blue-500/15" },
                  { href: profile.github_url,    icon: Github,    label: "GitHub",    color: "hover:border-foreground/40 hover:text-foreground",       iconColor: "text-foreground bg-muted/60" },
                ].map(({ href, icon: Icon, label, color, iconColor }) =>
                  href ? (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "group flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-3.5 text-muted-foreground transition-all hover:shadow-md",
                        color
                      )}
                    >
                      <span className={cn("flex h-8 w-8 items-center justify-center rounded-xl", iconColor)}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold">{label}</span>
                      <ArrowRight className="ml-auto h-4 w-4 opacity-30 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                    </a>
                  ) : null
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
