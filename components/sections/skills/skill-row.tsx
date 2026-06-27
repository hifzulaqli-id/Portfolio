"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "@/components/shared/lucide-icon";
import {
  SKILL_LEVEL_META,
  type Skill,
} from "@/types";

export function SkillRow({ skill, delay = 0 }: { skill: Skill; delay?: number }) {
  const level = SKILL_LEVEL_META[skill.level];
  const icon = skill.icon || skill.icon_url;
  const isLucideIcon = icon && !icon.startsWith("http") && !icon.startsWith("/") && !icon.startsWith("data:");

  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <div className="mb-2 flex items-center gap-3">
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {isLucideIcon ? (
              <LucideIcon name={icon} className="h-5 w-5" />
            ) : (
              <Image 
                src={icon} 
                alt="" 
                width={20} 
                height={20} 
                className="object-contain" 
                unoptimized={icon.startsWith("data:")}
              />
            )}
          </div>
        )}
        <div className="flex flex-1 items-center justify-between gap-3">
          <span className="font-medium">{skill.name}</span>
          <Badge
            variant="muted"
            className={`font-mono text-[10px] uppercase tracking-wide ${level.color}`}
          >
            {level.label}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.percentage}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay, ease: "easeOut" }}
          />
        </div>
        <span className="w-9 text-right font-mono text-xs text-muted-foreground">
          {skill.percentage}%
        </span>
      </div>
    </div>
  );
}
