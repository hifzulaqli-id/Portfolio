"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface MoreDropdownProps {
  active?: boolean;
  links: NavLink[];
}

export function MoreDropdown({ active = false, links }: MoreDropdownProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          "relative inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 outline-none",
          active
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/8"
        )}
      >
        {active && (
          <span className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20" />
        )}
        <span className="relative flex items-center gap-1.5">
          More
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        sideOffset={8}
        className="w-52 rounded-2xl border border-border/80 bg-card/95 p-2 shadow-xl backdrop-blur-xl"
      >
        {links.map((link) => (
          <DropdownMenuItem key={link.href} asChild className="rounded-xl">
            <Link
              href={link.href}
              className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/60">
                <link.icon className="h-3.5 w-3.5" />
              </span>
              {link.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MobileMoreLinks({ onNavigate }: { onNavigate?: () => void }) {
  // This component is no longer used in the new navbar but kept for backward compatibility
  return null;
}
