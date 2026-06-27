"use client";

import React, { useMemo, useRef, useCallback } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { fileToDataUrl } from "@/lib/image-upload";
import { toast } from "sonner";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function QuillEditor({ value, onChange, placeholder }: QuillEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      const toastId = toast.loading("Memproses gambar...");
      try {
        const dataUrl = await fileToDataUrl(file);
        
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range?.index ?? 0, "image", dataUrl);
          quill.setSelection((range?.index ?? 0) + 1);
        }
        toast.dismiss(toastId);
      } catch (err: any) {
        toast.dismiss(toastId);
        toast.error(err.message || "Gagal mengupload gambar");
      }
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler]
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];

  return (
    <div className="bg-background rounded-md border border-input rich-text-wrapper [&_.ql-toolbar]:rounded-t-md [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:border-b-input [&_.ql-container]:border-none [&_.ql-container]:rounded-b-md [&_.ql-editor]:min-h-[300px] [&_.ql-editor]:text-base dark:[&_.ql-toolbar]:border-b-muted dark:[&_.ql-stroke]:stroke-muted-foreground dark:[&_.ql-fill]:fill-muted-foreground dark:[&_.ql-picker]:text-muted-foreground">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder ?? "Mulai menulis di sini..."}
      />
    </div>
  );
}
