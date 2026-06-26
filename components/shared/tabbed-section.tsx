"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  key: string;
  label: React.ReactNode;
  count?: number;
  content: React.ReactNode;
}

interface TabbedSectionProps {
  tabs: TabItem[];
  className?: string;
  /** Persist active tab in the URL hash on click. */
  syncHash?: boolean;
}

/** Generic client tabs wrapper used by /skills, /experience, /education, etc. */
export function TabbedSection({
  tabs,
  className,
  syncHash = true,
}: TabbedSectionProps) {
  const [active, setActive] = React.useState(tabs[0]?.key);

  // Initialise / sync from URL hash so deep links select a tab.
  React.useEffect(() => {
    if (!syncHash) return;
    const apply = () => {
      const h = window.location.hash.replace("#", "");
      if (h && tabs.some((t) => t.key === h)) setActive(h);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [tabs, syncHash]);

  const select = (key: string) => {
    setActive(key);
    if (syncHash && typeof window !== "undefined") {
      history.replaceState(null, "", `#${key}`);
    }
  };

  const current = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <div className={className}>
      {/* Tab triggers */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {tabs.map((tab) => {
          const isActive = tab.key === current.key;
          return (
            <button
              key={tab.key}
              onClick={() => select(tab.key)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {tab.label}
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "ml-2 rounded-full px-1.5 py-0.5 text-[10px]",
                    isActive ? "bg-primary-foreground/20" : "bg-muted"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active content */}
      <div key={current.key} className="animate-[fade-up_0.4s_ease-out]">
        {current.content}
      </div>
    </div>
  );
}
