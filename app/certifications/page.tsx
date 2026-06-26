import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Award } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { CertificationsGallery } from "@/components/sections/certifications/certifications-gallery";
import { getCertifications } from "@/lib/data/certifications";

export const metadata: Metadata = {
  title: "Sertifikat | Hifzul Aqli",
  description: "Sertifikat dan pencapaian terverifikasi lintas bidang web, desain, video, akademik, dan kompetisi.",
};

export const revalidate = 60;

export default async function CertificationsPage() {
  const certifications = await getCertifications({ publicOnly: true });

  return (
    <PublicShell>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-dots opacity-20 mask-fade-b" />
          <div className="absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 rounded-full bg-primary/8 blur-[90px]" />
        </div>
        <div className="container text-center">
          <div className="mx-auto max-w-2xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <Award className="h-3.5 w-3.5" /> — Sertifikat
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Sertifikasi &{" "}
              <span className="text-primary-strong">Pencapaian</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Bukti kompetensi terverifikasi dari berbagai lembaga, kompetisi, dan akademik.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="pb-20">
        <div className="container">
          <CertificationsGallery items={certifications} />
        </div>
      </section>
    </PublicShell>
  );
}
