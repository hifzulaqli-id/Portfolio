"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareButton({ title }: { title: string }) {
  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        /* clipboard blocked */
      }
    }
  };
  return (
    <Button variant="ghost" size="sm" onClick={share}>
      <Share2 className="h-4 w-4" />
      Bagikan
    </Button>
  );
}
