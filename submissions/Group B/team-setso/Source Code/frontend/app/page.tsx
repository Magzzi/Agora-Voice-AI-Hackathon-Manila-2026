"use client";
import { useState } from "react";
import { DocumentToolbar, useDocumentToolbar } from "@/components/DocumentToolbar";
import { PdfViewer } from "@/components/PdfViewer";
import { VoiceSessionModal } from "@/components/VoiceSessionModal";
import { AvatarAnimated } from "@/components/AvatarAnimated";
import { HeaderAction } from "@/components/HeaderAction";
import { SidebarButton } from "@/components/SidebarButton";
import { MessageBubble } from "@/components/MessageBubble";
import {
  IconHome,
  IconDocument,
  IconHistory,
  IconSettings,
  IconPower,
  IconShare,
  IconDownload,
  IconRobot,
  IconBook,
  IconPhone,
} from "@/components/icons";

export default function Home() {
  const [sessionActive, setSessionActive] = useState(false);
  const {
    mode,
    fileUrl,
    fileOpen,
    fileName,
    openFilePicker,
    closeFile,
    loadFile,
    toggleMode,
    FileInput,
  } = useDocumentToolbar();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50">
      {sessionActive && <VoiceSessionModal onClose={() => setSessionActive(false)} />}
      {/* Hidden file input managed by the hook */}
      {FileInput}

      <aside className="flex w-[72px] flex-col items-center gap-5 border-r border-zinc-200 bg-white py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-semibold text-white shadow-sm">
          Y
        </div>
        <nav className="flex w-full flex-1 flex-col items-center gap-3 px-3">
          <SidebarButton active ariaLabel="Home">
            <IconHome />
          </SidebarButton>
          <SidebarButton ariaLabel="Document">
            <IconDocument />
          </SidebarButton>
          <SidebarButton ariaLabel="History">
            <IconHistory />
          </SidebarButton>
          <SidebarButton ariaLabel="Settings">
            <IconSettings />
          </SidebarButton>
        </nav>
        <div className="px-3">
          <SidebarButton ariaLabel="Sign out">
            <IconPower />
          </SidebarButton>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-xs font-semibold text-white">
              Y
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-900">
                  YAMI AI
                </span>
                <span className="text-xs text-zinc-500">Thesis Consultant</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <HeaderAction>
              <IconShare />
              <span>Share</span>
            </HeaderAction>
            <HeaderAction>
              <IconDownload />
              <span>Export</span>
            </HeaderAction>
            <div className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
              JD
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <section className="flex min-w-0 flex-1 flex-col bg-white">
            <DocumentToolbar
              fileName={fileName}
              fileOpen={fileOpen}
              onOpenFile={openFilePicker}
              onCloseFile={closeFile}
              mode={mode}
              onToggleMode={toggleMode}
            />

            {/* PDF Viewer — always mounted so drop zone is visible; shows iframe when file loaded */}
            {fileOpen || !fileUrl ? (
              <PdfViewer fileUrl={fileOpen ? fileUrl : null} onSelectFile={loadFile} />
            ) : (
              /* File loaded but panel closed — show a placeholder strip */
              <div className="flex min-h-0 flex-1 items-center justify-center bg-zinc-100/60">
                <button
                  onClick={openFilePicker}
                  className="text-sm text-zinc-500 underline-offset-2 hover:underline"
                >
                  Reopen {fileName}
                </button>
              </div>
            )}
          </section>

          <aside className="hidden w-[420px] flex-col border-l border-zinc-200 bg-white lg:flex overflow-y-auto">
            {/* YAMI header */}
            <div className="shrink-0 border-b border-zinc-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
                    <IconRobot />
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold text-zinc-900">
                      YAMI
                    </div>
                    <div className="text-xs text-zinc-500">Defense Panelist</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-zinc-600">
                <IconBook />
                <span className="text-zinc-500">Reading:</span>
                <span className="font-medium text-zinc-800">
                  {fileName ?? "No document"}
                </span>
              </div>
            </div>

            {/* Avatar + connect */}
            <div className="flex flex-col items-center justify-center px-7 py-10">
              <div className="flex w-full max-w-[320px] flex-col items-center rounded-2xl bg-white px-6 py-10 text-center">
                <AvatarAnimated />
                <div className="mt-6 text-base font-semibold text-zinc-900">
                  Start Voice Session
                </div>
                <div className="mt-2 text-sm leading-6 text-zinc-500">
                  Connect to YAMI for real-time thesis defense feedback and
                  suggestions
                </div>
                <button
                  onClick={() => setSessionActive(true)}
                  className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
                >
                  <IconPhone />
                  Connect Voice
                </button>
              </div>
            </div>

            {/* Conversation log */}
            <div className="flex flex-col border-t border-zinc-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold tracking-wider text-zinc-400">
                  CONVERSATION LOG
                </div>
                <button
                  onClick={() => {
                    const messages = [
                      { align: "right", text: "Can you suggest how to better frame the research gap?", time: "2:35 PM" },
                      { align: "left", text: "Try referencing specific limitations of existing tools—mention that current systems lack contextual understanding of disciplinary conventions. This creates a stronger foundation for your proposed solution.", time: "2:35 PM" },
                      { align: "right", text: "What about the theoretical framework section?", time: "2:36 PM" },
                      { align: "left", text: "Ground it in constructivist learning theory. Frame the AI-driven feedback loop as scaffolding for academic argumentation.", time: "2:36 PM" },
                    ];
                    const content = messages
                      .map((m) => `[${m.time}] ${m.align === "right" ? "You" : "YAMI"}: ${m.text}`)
                      .join("\n");
                    const blob = new Blob([content], { type: "text/plain" });
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = `yami-conversation-${new Date().toISOString().slice(0, 10)}.txt`;
                    a.click();
                    URL.revokeObjectURL(a.href);
                  }}
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                  title="Export conversation"
                >
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v11" /><path d="M8 10l4 4 4-4" /><path d="M4 20h16" />
                  </svg>
                  Export
                </button>
              </div>
              <div className="mt-4 space-y-4 pr-2">
                <MessageBubble
                  align="right"
                  text="Can you suggest how to better frame the research gap?"
                  time="2:35 PM"
                />
                <MessageBubble
                  align="left"
                  text="Try referencing specific limitations of existing tools—mention that current systems lack contextual understanding of disciplinary conventions. This creates a stronger foundation for your proposed solution."
                  time="2:35 PM"
                />
                <MessageBubble
                  align="right"
                  text="What about the theoretical framework section?"
                  time="2:36 PM"
                />
                <MessageBubble
                  align="left"
                  text="Ground it in constructivist learning theory. Frame the AI-driven feedback loop as scaffolding for academic argumentation."
                  time="2:36 PM"
                />
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
