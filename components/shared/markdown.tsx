"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  children: string;
  className?: string;
}

/** Markdown renderer with GFM + syntax highlighting. Uses the prose-custom
 *  styles defined in globals.css. */
export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div className={cn("prose-custom", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
