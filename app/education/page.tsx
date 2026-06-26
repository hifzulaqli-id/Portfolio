import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, GraduationCap, Trophy } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { PageHeader } from "@/components/shared/page-header";
import { TabbedSection } from "@/components/shared/tabbed-section";
import { Badge } from "@/components/ui/badge";
import { getEducation } from "@/lib/data/education";
import { EDUCATION_TYPE_META, type EducationType } from "@/types";
import { initials } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pendidikan",
  description:
    "Riwayat pendidikan formal, kursus online, bootcamp, serta workshop & seminar.",
};

export const revalidate = 60;

const ORDER: EducationType[] = ["formal", "course", "bootcamp", "workshop"];

export default async function EducationPage() {
  const education = await getEducation();

  const tabs = ORDER.map((type) => {
    const meta = EDUCATION_TYPE_META[type];
    const list = education.filter((e) => e.type === type);
    return {
      key: type,
      label: `${meta.emoji} ${meta.label}`,
      count: list.length,
      content: (
        <div className="grid gap-5 sm:grid-cols-2">
          {list.map((edu) => {
            const years =
              edu.start_year && edu.end_year
                ? `${edu.start_year} — ${edu.end_year}`
                : edu.start_year
                ? `${edu.start_year} — Sekarang`
                : "";
            return (
              <article
                key={edu.id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-5 transition-colors hover:border-primary/30"
              >
                <div className="flex items-start gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border bg-card">
                    {edu.logo_url ? (
                      <Image
                        src={edu.logo_url}
                        alt={edu.institution}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="bg-primary/20 bg-clip-text font-display text-sm font-bold text-primary">
                          {initials(edu.institution)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base font-semibold leading-snug">
                      {edu.institution_url ? (
                        <Link
                          href={edu.institution_url}
                          target="_blank"
                          className="inline-flex items-center gap-1 hover:text-primary"
                        >
                          {edu.institution}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ) : (
                        edu.institution
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {edu.field_of_study}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {edu.degree_level && (
                    <Badge variant="muted">{edu.degree_level}</Badge>
                  )}
                  {typeof edu.gpa === "number" && (
                    <Badge variant="secondary" className="gap-1">
                      IPK {edu.gpa.toFixed(2)}
                    </Badge>
                  )}
                  {years && (
                    <span className="font-mono text-muted-foreground">
                      {years}
                    </span>
                  )}
                  {edu.is_current && (
                    <Badge variant="success">Sedang Berlangsung</Badge>
                  )}
                </div>

                {edu.description && (
                  <p className="text-sm text-muted-foreground">
                    {edu.description}
                  </p>
                )}

                {edu.relevant_subjects.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {edu.relevant_subjects.map((s) => (
                      <Badge key={s} variant="muted" className="text-[10px]">
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}

                {edu.achievements && (
                  <div className="mt-1 flex items-start gap-2 rounded-lg bg-background/40 p-3 text-sm">
                    <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{edu.achievements}</span>
                  </div>
                )}
              </article>
            );
          })}
          {list.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
              Belum ada riwayat di kategori ini.
            </p>
          )}
        </div>
      ),
    };
  }).filter((t) => t.count > 0);

  return (
    <PublicShell>
      <PageHeader
        eyebrow="Pendidikan"
        title={
          <>
            Riwayat <span className="text-primary-strong">Belajar</span>
          </>
        }
        description="Perjalanan akademik dan pembelajaran — formal, kursus online, bootcamp, hingga workshop & seminar."
      />
      <section className="section-pad !pt-12">
        <div className="container">
          {tabs.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
              <GraduationCap className="h-10 w-10 opacity-40" />
              Belum ada riwayat pendidikan yang ditampilkan.
            </div>
          ) : (
            <TabbedSection tabs={tabs} />
          )}
        </div>
      </section>
    </PublicShell>
  );
}
