import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "border-b border-border/60 bg-card/20 pt-28 pb-10",
        className
      )}
    >
      <div className="container">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mb-6 -ml-2 text-muted-foreground"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Home
          </Link>
        </Button>
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
            <span className="h-px w-6 bg-primary/60" />
            {eyebrow}
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
