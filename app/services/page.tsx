import type { Metadata } from "next";
import { PublicShell } from "@/components/layout/public-shell";
import { ServicesPageClient } from "@/components/sections/services-page";
import { getServices } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Layanan | Hifzul Aqli",
  description:
    "Detail lengkap layanan web development, design ads, editing video, dan voice over beserta paket harga. Konsultasi gratis, revisi terjamin.",
};

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await getServices({ activeOnly: true });
  return (
    <PublicShell>
      <ServicesPageClient services={services} />
    </PublicShell>
  );
}
