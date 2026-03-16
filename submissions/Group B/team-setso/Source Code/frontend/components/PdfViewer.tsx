"use client";
import { useRef, useCallback } from "react";

interface PdfViewerProps {
  fileUrl: string | null;
  onSelectFile: (file: File) => void;
}

export function PdfViewer({ fileUrl, onSelectFile }: PdfViewerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      if (f && f.type === "application/pdf") onSelectFile(f);
    },
    [onSelectFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) onSelectFile(f);
    },
    [onSelectFile]
  );

  if (!fileUrl) {
    return (
      <div
        className="flex min-h-0 flex-1 items-center justify-center bg-zinc-100/60"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-zinc-300 bg-white px-16 py-14 text-center transition hover:border-indigo-400 hover:bg-indigo-50/30"
        >
          {/* PDF icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
              <path d="M14 3v4a2 2 0 0 0 2 2h4" />
              <path d="M9 13h.01M12 13h.01M15 13h.01" />
            </svg>
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-800">
              Open a PDF to get started
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Click or drag &amp; drop a PDF file here
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm">
            Browse files
          </span>

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleChange}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-hidden">
      <iframe
        src={fileUrl}
        title="PDF Viewer"
        className="h-full w-full border-0"
      />
    </div>
  );
}
