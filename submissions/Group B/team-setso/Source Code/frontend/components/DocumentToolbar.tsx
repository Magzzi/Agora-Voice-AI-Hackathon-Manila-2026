"use client";
import { useState, useRef, useCallback } from "react";
import { ToolbarIconButton } from "@/components/ToolbarIconButton";
import {
  IconFile,
  IconMinus,
  IconPlus,
  IconCheck,
  IconChevronDown,
  IconFolderOpen,
  IconShieldCheck,
  IconGraduationCap,
} from "@/components/icons";

export type Mode = "defense" | "mentor";

export interface DocumentToolbarProps {
  fileName: string | null;
  fileOpen: boolean;
  onOpenFile: () => void;
  onCloseFile: () => void;
  mode: Mode;
  onToggleMode: () => void;
}

export function DocumentToolbar({
  fileName,
  fileOpen,
  onOpenFile,
  onCloseFile,
  mode,
  onToggleMode,
}: DocumentToolbarProps) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-5 py-3">
      {/* Left: file title + open/close */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
            <IconFile />
          </div>
          <div className="max-w-[200px] truncate text-sm font-medium text-zinc-800">
            {fileName ?? "No file open"}
          </div>
        </div>

        {/* Separator */}
        <div className="h-4 w-px bg-zinc-200" />

        {/* Open / Close file button */}
        {fileOpen ? (
          <button
            onClick={onCloseFile}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50"
          >
            <IconFolderOpen open={false} />
            Close
          </button>
        ) : (
          <button
            onClick={onOpenFile}
            className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100"
          >
            <IconFolderOpen open={true} />
            Open
          </button>
        )}

        {/* Mode Toggle */}
        <button
          onClick={onToggleMode}
          className={[
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition",
            mode === "defense"
              ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
              : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
          ].join(" ")}
        >
          {mode === "defense" ? (
            <>
              <IconShieldCheck />
              Defense Mode
            </>
          ) : (
            <>
              <IconGraduationCap />
              Mentor Mode
            </>
          )}
          <IconChevronDown />
        </button>
      </div>

      {/* Right: zoom + page + sync (only when file is open) */}
      {fileOpen && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-600">
            <ToolbarIconButton ariaLabel="Zoom out">
              <IconMinus />
            </ToolbarIconButton>
            <span className="px-1 tabular-nums">100%</span>
            <ToolbarIconButton ariaLabel="Zoom in">
              <IconPlus />
            </ToolbarIconButton>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="tabular-nums">1 / 3</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <IconCheck />
            <span>Synced</span>
          </div>
        </div>
      )}
    </div>
  );
}

/** Hook that owns all document + mode state, including file management */
export function useDocumentToolbar() {
  const [mode, setMode] = useState<Mode>("defense");
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileOpen, setFileOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(
    (f: File) => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
      setFile(f);
      setFileUrl(URL.createObjectURL(f));
      setFileOpen(true);
    },
    [fileUrl]
  );

  const openFilePicker = useCallback(() => {
    if (fileOpen && file) {
      // Already has file — just open picker to replace it
      inputRef.current?.click();
    } else if (file && !fileOpen) {
      // Has file but closed — reopen viewer
      setFileOpen(true);
    } else {
      // No file yet — open picker
      inputRef.current?.click();
    }
  }, [file, fileOpen]);

  const closeFile = useCallback(() => setFileOpen(false), []);

  const toggleMode = useCallback(
    () => setMode((m) => (m === "defense" ? "mentor" : "defense")),
    []
  );

  /** Render a hidden file input element alongside the toolbar */
  const FileInput = (
    <input
      ref={inputRef}
      type="file"
      accept="application/pdf"
      className="hidden"
      onChange={(e) => {
        const f = e.target.files?.[0];
        if (f) loadFile(f);
        // reset so same file can be re-selected
        e.target.value = "";
      }}
    />
  );

  return {
    mode,
    file,
    fileUrl,
    fileOpen,
    fileName: file?.name ?? null,
    openFilePicker,
    closeFile,
    loadFile,
    toggleMode,
    FileInput,
  };
}
