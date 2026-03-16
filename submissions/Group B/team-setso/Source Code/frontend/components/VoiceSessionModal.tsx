"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useVoiceSession } from "@/hooks/useVoiceSession";
import type { SessionStatus } from "@/hooks/useVoiceSession";

type Style = "guided" | "standard" | "rigorous";

const STYLES: { id: Style; label: string; desc: string; color: string }[] = [
  {
    id: "guided",
    label: "Guided",
    desc: "Supportive & step-by-step",
    color: "border-emerald-300 bg-emerald-50 text-emerald-800 ring-emerald-200",
  },
  {
    id: "standard",
    label: "Standard",
    desc: "Balanced examination",
    color: "border-indigo-300 bg-indigo-50 text-indigo-800 ring-indigo-200",
  },
  {
    id: "rigorous",
    label: "Rigorous",
    desc: "Adversarial panel-style",
    color: "border-red-300 bg-red-50 text-red-800 ring-red-200",
  },
];

const STATUS_LABELS: Record<SessionStatus, string> = {
  idle: "Ready",
  connecting: "Connecting…",
  connected: "YAMI is speaking…",
  ending: "Ending session…",
  ended: "Session ended",
  error: "Connection error",
};

/** Generate a stable channel name and UID for the session */
const SESSION_CHANNEL = `yami-${Date.now()}`;
const SESSION_UID = Math.floor(Math.random() * 90000) + 1000;

interface VoiceSessionModalProps {
  onClose: () => void;
}

export function VoiceSessionModal({ onClose }: VoiceSessionModalProps) {
  const { status, errorMsg, muted, start, stop, toggleMute } = useVoiceSession();
  const [frame, setFrame] = useState(0);
  const [style, setStyle] = useState<Style>("standard");
  const [styleOpen, setStyleOpen] = useState(false);

  // Avatar animation
  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f === 0 ? 1 : 0)), 600);
    return () => clearInterval(id);
  }, []);

  // Auto-start session when modal opens
  useEffect(() => {
    start(SESSION_CHANNEL, SESSION_UID, style);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnd = async () => {
    await stop();
    onClose();
  };

  const avatarSrc = frame === 0 ? "/mr-yami-closed.png" : "/mr-yami-open.png";
  const currentStyle = STYLES.find((s) => s.id === style)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Call card */}
      <div className="relative flex h-[90vh] w-full max-w-[520px] flex-col overflow-hidden rounded-3xl bg-[#0f0f13] shadow-2xl ring-1 ring-white/10">

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">
              Voice Session
            </span>
            <span className="mt-0.5 text-sm font-semibold text-white">
              YAMI — Defense Panelist
            </span>
          </div>

          {/* Style selector */}
          <div className="relative">
            <button
              onClick={() => setStyleOpen((v) => !v)}
              disabled={status === "connected"}
              className={[
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ring-1 transition",
                currentStyle.color,
                status === "connected" ? "opacity-50 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {currentStyle.label}
              <svg viewBox="0 0 24 24" className="h-3 w-3 opacity-60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {styleOpen && status !== "connected" && (
              <div className="absolute right-0 top-9 z-10 w-52 overflow-hidden rounded-2xl bg-[#1c1c24] shadow-xl ring-1 ring-white/10">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setStyle(s.id); setStyleOpen(false); }}
                    className={[
                      "flex w-full flex-col items-start px-4 py-3 transition hover:bg-white/5",
                      s.id === style ? "bg-white/5" : "",
                    ].join(" ")}
                  >
                    <span className="text-sm font-semibold text-white">{s.label}</span>
                    <span className="text-xs text-white/40">{s.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Avatar area */}
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8">
          <div className="relative flex items-center justify-center">
            {status === "connected" && (
              <div className="absolute h-56 w-56 animate-ping rounded-full bg-indigo-500/10" />
            )}
            <div className="absolute h-64 w-64 rounded-full bg-indigo-500/5" />
            <div className="relative h-48 w-48 overflow-hidden rounded-full ring-4 ring-indigo-500/50 shadow-[0_0_60px_rgba(99,102,241,0.3)]">
              <Image src={avatarSrc} alt="YAMI AI" fill className="object-cover object-top" priority />
            </div>
          </div>

          {/* Status / speaking indicator */}
          <div className="flex items-center gap-1.5">
            {status === "connected" && (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-indigo-400"
                  style={{
                    height: `${8 + Math.sin(i * 1.2) * 8 + 8}px`,
                    animation: `yamipulse ${0.6 + i * 0.15}s ease-in-out infinite alternate`,
                  }}
                />
              ))
            )}
            <span className={[
              "ml-2 text-xs",
              status === "error" ? "text-red-400" : "text-white/50",
            ].join(" ")}>
              {errorMsg ?? STATUS_LABELS[status]}
            </span>
          </div>
        </div>

        {/* Student PiP */}
        <div className="absolute bottom-32 right-5 h-24 w-16 overflow-hidden rounded-2xl bg-zinc-800 ring-2 ring-white/10 shadow-lg flex flex-col items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          <span className="mt-1 text-[9px] text-white/50">You</span>
        </div>

        {/* Call controls */}
        <div className="flex items-center justify-center gap-5 pb-8 pt-4">
          {/* Mute */}
          <button
            onClick={toggleMute}
            disabled={status !== "connected"}
            className={[
              "flex h-14 w-14 flex-col items-center justify-center gap-1 rounded-full transition disabled:opacity-40",
              muted ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white hover:bg-white/20",
            ].join(" ")}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {muted ? (
                <>
                  <path d="M12 1a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </>
              ) : (
                <>
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </>
              )}
            </svg>
            <span className="text-[9px] font-medium">{muted ? "Unmute" : "Mute"}</span>
          </button>

          {/* End call */}
          <button
            onClick={handleEnd}
            className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-full bg-red-500 text-white shadow-lg transition hover:bg-red-600 active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 rotate-[135deg]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 20 20 0 0 1-8.7-3.1 19.6 19.6 0 0 1-6-6A20 20 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.9.6 2.7a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.5c.8.3 1.8.5 2.7.6A2 2 0 0 1 22 16.9Z" />
            </svg>
            <span className="text-[9px] font-medium">End</span>
          </button>

          {/* Chat */}
          <button className="flex h-14 w-14 flex-col items-center justify-center gap-1 rounded-full bg-white/10 text-white transition hover:bg-white/20">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-[9px] font-medium">Chat</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes yamipulse {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
