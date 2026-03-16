/**
 * Thin wrapper around agora-rtc-sdk-ng for use in the YAMI frontend.
 * Keeps engine creation and mic publishing isolated from UI components.
 */
import type {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";

let client: IAgoraRTCClient | null = null;
let micTrack: IMicrophoneAudioTrack | null = null;
let clientPromise: Promise<IAgoraRTCClient> | null = null;
let joinPromise: Promise<number> | null = null;

// ─── Conversation transcript ──────────────────────────────────────────────────

export interface TranscriptEntry {
  role: "user" | "agent";
  text: string;
  timestamp: Date;
}

const transcript: TranscriptEntry[] = [];
let onTranscriptUpdate: ((entries: TranscriptEntry[]) => void) | null = null;

/** Register a callback to be notified whenever a new transcript line arrives. */
export function setTranscriptListener(
  cb: ((entries: TranscriptEntry[]) => void) | null
) {
  onTranscriptUpdate = cb;
}

/** Returns a snapshot of the current conversation transcript. */
export function getTranscript(): TranscriptEntry[] {
  return [...transcript];
}

function pushEntry(entry: TranscriptEntry) {
  transcript.push(entry);
  console.log(
    `[${entry.timestamp.toLocaleTimeString()}] ${entry.role === "user" ? "🧑 You" : "🤖 YAMI"}: ${entry.text}`
  );
  onTranscriptUpdate?.([...transcript]);
}

// ─── Agora stream-message payload types ──────────────────────────────────────

/**
 * Agora Conversational AI sends JSON data-stream messages with this shape.
 * https://docs.agora.io/en/conversational-ai/develop/receive-message
 */
interface AgoraTranscriptMessage {
  message_id: string;
  /** 1 = final, 0 = interim */
  final: 0 | 1;
  /** 1 = user (STT), 2 = agent (LLM reply) */
  message_type: 1 | 2;
  text: string;
  /** Agent UID — "0" in our setup */
  uid: string;
  turn_id: number;
  turn_seq_id: number;
  turn_status: number;
  lang: string;
  words: unknown[];
}

// ─── Client ───────────────────────────────────────────────────────────────────

/** Create (or return existing) Agora RTC client in live-broadcasting mode. */
export async function getClient(): Promise<IAgoraRTCClient> {
  if (typeof window === "undefined") {
    throw new Error("Agora RTC cannot be instantiated on the server.");
  }

  if (client) return client;

  if (!clientPromise) {
    clientPromise = (async () => {
      const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
      client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      _attachTranscriptListeners(client);
      return client;
    })();
  }

  return clientPromise;
}

/** Wire up stream-message listeners to capture the conversation. */
function _attachTranscriptListeners(c: IAgoraRTCClient) {
  c.on("stream-message", (_uid: number, raw: Uint8Array) => {
    try {
      const json = new TextDecoder().decode(raw);
      const msg: AgoraTranscriptMessage = JSON.parse(json);

      // Only process final transcripts (skip interim/partial)
      if (msg.final !== 1) return;

      // message_type 1 = user STT, 2 = agent reply
      if (msg.message_type === 1) {
        pushEntry({ role: "user", text: msg.text.trim(), timestamp: new Date() });
      } else if (msg.message_type === 2) {
        pushEntry({ role: "agent", text: msg.text.trim(), timestamp: new Date() });
      }
    } catch {
      // Not a transcript message — ignore
    }
  });
}

// ─── Channel lifecycle ────────────────────────────────────────────────────────

/** Join a channel, publish mic, and return the local UID. */
export async function joinChannel(
  appId: string,
  channel: string,
  token: string,
  uid: number
): Promise<number> {
  if (joinPromise) return joinPromise;

  joinPromise = (async () => {
    const c = await getClient();

    if (c.connectionState !== "DISCONNECTED") {
      return uid;
    }

    const result = await c.join(appId, channel, token, uid);

    const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
    micTrack = await AgoraRTC.createMicrophoneAudioTrack({
      encoderConfig: "high_quality",
      AEC: true,
      ANS: true,
    });
    await c.publish([micTrack]);

    return result as number;
  })();

  try {
    return await joinPromise;
  } finally {
    joinPromise = null;
  }
}

/** Mute or unmute the local microphone track. */
export function setMicMuted(muted: boolean): void {
  micTrack?.setMuted(muted);
}

/** Leave the channel and clean up tracks/client. */
export async function leaveChannel(): Promise<void> {
  joinPromise = null;

  const c = await getClient();

  if (micTrack) {
    micTrack.stop();
    micTrack.close();
    micTrack = null;
  }

  if (c.connectionState !== "DISCONNECTED") {
    await c.leave();
  }

  client = null;
  clientPromise = null;
  transcript.length = 0; // Clear transcript on leave
}