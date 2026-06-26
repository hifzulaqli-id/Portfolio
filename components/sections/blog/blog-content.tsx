"use client";

import * as React from "react";
import { Markdown } from "@/components/shared/markdown";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

/** Renders markdown + extracts a table of contents from H2/H3 headings.
 *  The TOC ids are derived from the heading text (slugified). */
export function BlogContent({ content }: { content: string }) {
  const [toc, setToc] = React.useState<TocItem[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const headings = Array.from(
      containerRef.current.querySelectorAll("h2, h3")
    ) as HTMLHeadingElement[];
    const items: TocItem[] = headings.map((h, i) => {
      const text = h.textContent ?? `section-${i}`;
      const id = slugifyHeading(text);
      h.id = id;
      h.setAttribute("data-heading", "");
      return {
        id,
        text,
        level: h.tagName === "H2" ? 2 : 3,
      };
    });
    setToc(items);
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_16rem]">
      <article ref={containerRef}>
        <Markdown>{content}</Markdown>
      </article>
      {toc.length > 0 && (
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Daftar Isi
            </div>
            <Toc items={toc} />
          </div>
        </aside>
      )}
    </div>
  );
}

function Toc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter(Boolean) as HTMLElement[];
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="space-y-1 border-l border-border pl-3">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={
            "block border-l-2 py-1 text-sm transition-colors " +
            (item.level === 3 ? "pl-4 " : "pl-2 -ml-[2px] ") +
            (activeId === item.id
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground")
          }
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
