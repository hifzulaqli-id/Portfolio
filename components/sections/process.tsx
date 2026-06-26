"use client";

import { motion } from "framer-motion";
import {
  MessagesSquare,
  ClipboardList,
  Rocket,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import type { ContentBlock } from "@/types";

// Visual styling per step index (icon, colors). Content (title/tag/desc) is
// editable via the content_blocks store and merged in at render time.
const STEP_STYLE = [
  {
    icon: MessagesSquare,
    color: "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-500",
    iconBg: "bg-blue-500/15 text-blue-500",
    step: "01",
  },
  {
    icon: ClipboardList,
    color: "from-purple-500/20 to-violet-500/10 border-purple-500/30 text-purple-500",
    iconBg: "bg-purple-500/15 text-purple-500",
    step: "02",
  },
  {
    icon: Rocket,
    color: "from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-500",
    iconBg: "bg-pink-500/15 text-pink-500",
    step: "03",
  },
  {
    icon: CheckCircle2,
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500",
    iconBg: "bg-emerald-500/15 text-emerald-500",
    step: "04",
  },
];

const DEFAULT_STEPS = [
  { title: "Diskusi", tag: "Mulai di sini", description: "Kita ngobrol santai soal ide, tujuan, dan kebutuhan Anda. Saya dengarkan dulu, baru kasih saran." },
  { title: "Perencanaan", tag: "Transparan", description: "Saya susun konsep, timeline, dan scope kerja yang jelas. Tidak ada biaya tersembunyi." },
  { title: "Eksekusi", tag: "Update Berkala", description: "Proses pengerjaan transparan dengan update berkala. Anda bisa pantau progresnya." },
  { title: "Revisi & Selesai", tag: "Garansi Puas", description: "Revisi sampai hasil sesuai harapan, lalu serah terima rapi beserta file lengkapnya." },
];

interface ProcessProps {
  blocks?: ContentBlock[];
}

export function Process({ blocks }: ProcessProps) {
  const stepsBlock = blocks?.find((b) => b.key === "process.steps");
  const editable =
    stepsBlock && Array.isArray(stepsBlock.value)
      ? (stepsBlock.value as {
          title: string;
          tag: string;
          description: string;
        }[])
      : DEFAULT_STEPS;
  const STEPS = editable.map((s, i) => ({
    ...s,
    ...STEP_STYLE[i % STEP_STYLE.length],
  }));
  return (
    <section id="proses" className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-dots opacity-20 mask-fade-b" />
      {/* center glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/6 blur-[100px]" />
      </div>

      <div className="container">
        <SectionHeading
          eyebrow="Proses Kerja"
          title={
            <>
              Cara Saya <span className="text-primary-strong">Bekerja</span>
            </>
          }
          description="Proses yang simpel dan transparan, dari obrolan pertama sampai proyek selesai."
        />

        {/* Desktop: horizontal connected cards */}
        <div className="hidden md:block">
          <div className="relative grid grid-cols-4 gap-5">
            {/* Connecting dashed line */}
            <div className="absolute left-[12.5%] right-[12.5%] top-[3.25rem] z-0 border-t-2 border-dashed border-border/60" />

            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                {/* Step icon circle */}
                <div className={`relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border bg-card shadow-lg transition-transform duration-300 hover:scale-110 ${step.iconBg} border-border`}>
                  <step.icon className="h-7 w-7" />
                  {/* Step number badge */}
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-black text-primary-foreground shadow-md ring-2 ring-background">
                    {i + 1}
                  </span>
                </div>

                {/* Card */}
                <div className={`group w-full overflow-hidden rounded-2xl border bg-gradient-to-b ${step.color} bg-card/70 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>
                  {/* Tag */}
                  <span className="mb-3 inline-block rounded-full bg-background/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {step.tag}
                  </span>

                  {/* Decorative step number */}
                  <div className="pointer-events-none absolute right-3 top-2 font-display text-5xl font-black text-foreground/5 select-none">
                    {step.step}
                  </div>

                  <h3 className="mb-2 font-display text-base font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                {/* Arrow between cards */}
                {i < STEPS.length - 1 && (
                  <div className="absolute -right-3.5 top-[3.25rem] z-20 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card shadow-sm">
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="space-y-0 md:hidden">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="relative flex gap-4"
            >
              {/* Vertical line */}
              {i < STEPS.length - 1 && (
                <div className="absolute left-[1.875rem] top-16 z-0 h-[calc(100%-2.5rem)] w-px border-l-2 border-dashed border-border/60" />
              )}

              {/* Icon */}
              <div className={`relative z-10 flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center rounded-2xl border bg-card ${step.iconBg} border-border shadow-md`}>
                <step.icon className="h-5 w-5" />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-black text-primary-foreground">
                  {i + 1}
                </span>
              </div>

              {/* Content */}
              <div className={`mb-4 flex-1 overflow-hidden rounded-2xl border bg-gradient-to-r ${step.color} bg-card/70 p-4 backdrop-blur-sm`}>
                <span className="mb-1.5 inline-block rounded-full bg-background/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {step.tag}
                </span>
                <h3 className="font-display text-sm font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
