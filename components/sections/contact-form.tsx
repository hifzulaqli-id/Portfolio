"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { messageSchema, type MessageFormValues } from "@/lib/validations";
import { CATEGORY_META } from "@/types";
import { cn } from "@/lib/utils";

const SERVICE_OPTIONS = Object.entries(CATEGORY_META).map(([value, meta]) => ({
  value,
  label: `${meta.emoji} ${meta.label}`,
}));

export function ContactForm() {
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  // Preselect service when arriving via ?service=... (e.g. from /services).
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const svc = params.get("service");
    if (svc && SERVICE_OPTIONS.some((o) => o.value === svc)) {
      setValue("service", svc as never);
    }
  }, [setValue]);

  const onSubmit = async (data: MessageFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error ?? "Gagal mengirim pesan");
      }
      reset();
      // Redirect to the thank-you confirmation page.
      window.location.href = "/thank-you";
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi ya."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-2xl border border-border bg-card/40 p-6 md:p-8"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama" error={errors.name?.message}>
          <Input
            placeholder="Nama lengkap Anda"
            autoComplete="name"
            className={cn(errors.name && "border-destructive")}
            {...register("name")}
          />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input
            type="email"
            placeholder="email@anda.com"
            autoComplete="email"
            className={cn(errors.email && "border-destructive")}
            {...register("email")}
          />
        </Field>
      </div>

      <Field label="Layanan yang Diminati">
        <Select onValueChange={(v) => setValue("service", v as never)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih layanan (opsional)" />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Pesan" error={errors.message?.message}>
        <Textarea
          rows={6}
          placeholder="Ceritakan tentang proyek atau kebutuhan Anda..."
          className={cn(errors.message && "border-destructive")}
          {...register("message")}
        />
      </Field>

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        disabled={submitting}
        className="w-full sm:w-auto"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Mengirim...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Kirim Pesan
          </>
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
