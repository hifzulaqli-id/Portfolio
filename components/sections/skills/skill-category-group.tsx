"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SkillRow } from "./skill-row";
import type { Skill } from "@/types";

export function SkillCategoryGroup({
  category,
  label,
  emoji,
  skills,
}: {
  category: string;
  label: string;
  emoji: string;
  skills: Skill[];
}) {
  if (skills.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      key={category}
    >
      <div className="mb-5 flex items-center gap-2">
        <span className="text-xl">{emoji}</span>
        <h3 className="font-display text-lg font-semibold">{label}</h3>
        <span className="ml-1 text-xs text-muted-foreground">
          {skills.length} skill
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {skills.map((skill, i) => (
          <SkillRow key={skill.id} skill={skill} delay={i * 0.05} />
        ))}
      </div>
    </motion.div>
  );
}
