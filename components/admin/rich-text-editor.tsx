"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const QuillEditor = dynamic(() => import("./quill-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[300px] w-full items-center justify-center rounded-md border border-input bg-muted/20">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor(props: RichTextEditorProps) {
  return <QuillEditor {...props} />;
}
