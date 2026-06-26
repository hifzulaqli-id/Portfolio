"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ProjectCategory } from "@/types";

const LABELS: Record<ProjectCategory, string> = {
  web: "Web",
  design: "Design",
  video: "Video",
  voice: "Voice",
};

export function CategoryChart({
  data,
}: {
  data: Record<ProjectCategory, number>;
}) {
  const chartData = (Object.keys(data) as ProjectCategory[]).map((k) => ({
    name: LABELS[k],
    total: data[k],
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="hsl(var(--border))"
        />
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
          contentStyle={{
            background: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.5rem",
            color: "hsl(var(--popover-foreground))",
            fontSize: "12px",
          }}
        />
        <Bar dataKey="total" radius={[6, 6, 0, 0]} fill="hsl(var(--primary))" />
      </BarChart>
    </ResponsiveContainer>
  );
}
