import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  hint?: string;
  accent?: "primary" | "secondary";
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  accent = "primary",
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            accent === "primary"
              ? "bg-primary/10 text-primary"
              : "bg-secondary/10 text-secondary"
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </CardHeader>
      <CardContent>
        <div className="font-display text-3xl font-bold">{value}</div>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}
