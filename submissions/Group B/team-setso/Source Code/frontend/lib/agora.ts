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
let listenersAttached = false;

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
    `[${entry.timestamp.toLocaleTimeString()}] ${
      entry.role === "user" ? "🧑 You" : "🤖 YAMI"
    }: ${entry.text}`
  );
  onTranscriptUpdate?.([...transcript]);
}

// ─── Turn management ──────────────────────────────────────────────────────────

/**
 * Tracks who is currently speaking so neither side interrupts the other.
 * null  = nobody speaking, either may start
 * "user"  = user's STT turn in progress
 * "agent" = agent's TTS turn in progress
 */
let currentSpeaker: "user" | "agent" | null = null;

/**
 * turn_status values sent by Agora Conversational AI:
 *   0 = in progress
 *   1 = complete (normal end)
 *   2 = interrupted
 */
type TurnStatus = 0 | 1 | 2;

// ─── Agora stream-message payload types ──────────────────────────────────────

interface AgoraTranscriptMessage {
  message_id: string;
  /** 1 = final, 0 = interim */
  final: 0 | 1;
  /** 1 = user (STT), 2 = agent (LLM/TTS reply) */
  message_type: 1 | 2;
  text: string;
  uid: string;
  turn_id: number;
  turn_seq_id: number;
  turn_status: TurnStatus;
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
      _attachListeners(client);
      return client;
    })();
  }

  return clientPromise;
}

/** Wire up audio subscription and stream-message listeners. */
function _attachListeners(c: IAgoraRTCClient) {
  if (listenersAttached) return;
  listenersAttached = true;

  // ─── Subscribe to agent audio ─────────────────────────────────────────────
  c.on("user-published", async (remoteUser, mediaType) => {
    if (mediaType === "audio") {
      await c.subscribe(remoteUser, "audio");
      remoteUser.audioTrack?.play();
    }
  });

  // ─── Transcript + turn management ────────────────────────────────────────
  c.on("stream-message", (_uid: number, raw: Uint8Array) => {
    try {
      const json = new TextDecoder().decode(raw);
      const msg: AgoraTranscriptMessage = JSON.parse(json);

      const role: "user" | "agent" = msg.message_type === 1 ? "user" : "agent";
      const otherRole: "user" | "agent" = role === "user" ? "agent" : "user";

      // ── Drop interim transcripts ─────────────────────────────────────────
      if (msg.final !== 1) return;

      // ── Drop messages from the non-current speaker while someone is talking
      // Exception: turn_status 2 (interrupted) always clears the lock so the
      // other side can take over cleanly.
      if (msg.turn_status === 2) {
        // Interrupted — release the lock immediately regardless of who held it
        currentSpeaker = null;
      } else {
        if (currentSpeaker === otherRole) {
          // Other side is still mid-turn; discard this message
          return;
        }
        // Claim the turn
        currentSpeaker = role;

        // Release the lock when this turn is complete
        if (msg.turn_status === 1) {
          currentSpeaker = null;
        }
      }

      // ── Record the transcript entry ──────────────────────────────────────
      if (msg.text.trim()) {
        pushEntry({ role, text: msg.text.trim(), timestamp: new Date() });
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
  listenersAttached = false;
  currentSpeaker = null;

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
  transcript.length = 0;
}