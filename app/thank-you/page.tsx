"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Home, FolderKanban, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThankYouPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-20">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-secondary/20 blur-[120px]" />
        <div className="absolute right-1/3 bottom-1/4 h-64 w-64 rounded-full bg-primary/20 blur-[120px]" />
      </div>

      {/* Confetti pieces */}
      <Confetti />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-lg text-center"
      >
        {/* Animated check */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10"
        >
          <motion.span
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.45, type: "spring", stiffness: 250 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
          >
            <Check className="h-9 w-9" strokeWidth={3} />
          </motion.span>
        </motion.div>

        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          Pesan terkirim
        </span>

        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Terima kasih! 🎉
        </h1>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          Pesan Anda sudah saya terima. Saya akan membaca dan membalas secepatnya.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border bg-card/50 px-4 py-3 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" />
          Estimasi respons: dalam <strong className="text-foreground">1×24 jam</strong>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="gradient" size="lg">
            <Link href="/">
              <Home className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/projects">
              <FolderKanban className="h-4 w-4" />
              Lihat Portofolio
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Butuh respons lebih cepat?{" "}
          <a
            href="/contact"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Hubungi via WhatsApp
          </a>
        </p>
      </motion.div>
    </div>
  );
}

/** Lightweight CSS confetti burst (no extra deps). */
function Confetti() {
  const pieces = React.useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2.2 + Math.random() * 1.6,
        color: ["#6C63FF", "#00D4AA", "#EC4899", "#F59E0B", "#3B82F6"][i % 5],
        size: 6 + Math.random() * 6,
        rotate: Math.random() * 360,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0 rounded-[2px]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
          }}
          initial={{ y: -40, opacity: 0, rotate: p.rotate }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
            repeat: 0,
          }}
        />
      ))}
    </div>
  );
}
