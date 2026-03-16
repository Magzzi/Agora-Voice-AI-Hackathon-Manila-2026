/**
 * useVoiceSession — React hook for the full YAMI voice session lifecycle.
 *
 * Flow:
 *  1. Fetch Agora token from /api/token
 *  2. POST /api/agent/start  → YAMI AI agent joins the channel
 *  3. Join Agora RTC channel via agora-rtc-sdk-ng, publish mic
 *  4. On end: leave channel, POST /api/agent/stop
 */
"use client";
import { useState, useCallback, useRef } from "react";
import { joinChannel, leaveChannel, setMicMuted } from "@/lib/agora";

export type SessionStatus = "idle" | "connecting" | "connected" | "ending" | "ended" | "error";

export interface UseVoiceSessionReturn {
  status: SessionStatus;
  errorMsg: string | null;
  muted: boolean;
  start: (channel: string, uid: number, style: "guided" | "standard" | "rigorous") => Promise<void>;
  stop: () => Promise<void>;
  toggleMute: () => void;
}

const AGORA_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID ?? "";

export function useVoiceSession(): UseVoiceSessionReturn {
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [muted, setMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const agentIdRef = useRef<string | null>(null);

  const start = useCallback(
    async (channel: string, uid: number, style: "guided" | "standard" | "rigorous") => {
      setStatus("connecting");
      setErrorMsg(null);

      try {
        // 1. Get Agora RTC token from the backend
        const tokenRes = await fetch(
          `/api/token?channel=${encodeURIComponent(channel)}&uid=${uid}`
        );
        if (!tokenRes.ok) throw new Error("Failed to fetch RTC token");
        const { token } = await tokenRes.json();

        // 2. Trigger YAMI AI agent
        const agentRes = await fetch("/api/agent/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channel, uid, style }),
        });
        if (!agentRes.ok) throw new Error("Failed to start AI agent");
        const { agent_id } = await agentRes.json();
        agentIdRef.current = agent_id;

        // 3. Join Agora RTC channel with mic
        await joinChannel(AGORA_APP_ID, channel, token, uid);
        setStatus("connected");
      } catch (err) {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      }
    },
    []
  );

  const stop = useCallback(async () => {
    setStatus("ending");
    try {
      // Leave Agora channel
      await leaveChannel();

      // Stop the AI agent
      if (agentIdRef.current) {
        await fetch("/api/agent/stop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agent_id: agentIdRef.current }),
        });
        agentIdRef.current = null;
      }
    } catch {
      // Best-effort cleanup — don't block UI
    }
    setStatus("ended");
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      setMicMuted(!m);
      return !m;
    });
  }, []);

  return { status, errorMsg, muted, start, stop, toggleMute };
}
