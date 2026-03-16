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

/** Create (or return existing) Agora RTC client in live-broadcasting mode. */
export async function getClient(): Promise<IAgoraRTCClient> {
  if (typeof window === "undefined") {
    throw new Error("Agora RTC cannot be instantiated on the server.");
  }
  if (!client) {
    const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
    client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  }
  return client;
}

/** Join a channel, publish mic, and return the local UID. */
export async function joinChannel(
  appId: string,
  channel: string,
  token: string,
  uid: number
): Promise<number> {
  const c = await getClient();
  const result = await c.join(appId, channel, token, uid);

  const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
  // Create and publish the microphone audio track
  micTrack = await AgoraRTC.createMicrophoneAudioTrack({
    encoderConfig: "high_quality",
    AEC: true,   // Acoustic Echo Cancellation
    ANS: true,   // Ambient Noise Suppression
  });
  await c.publish([micTrack]);

  return result as number;
}

/** Mute or unmute the local microphone track. */
export function setMicMuted(muted: boolean): void {
  micTrack?.setMuted(muted);
}

/** Leave the channel and clean up tracks/client. */
export async function leaveChannel(): Promise<void> {
  const c = await getClient();

  if (micTrack) {
    micTrack.stop();
    micTrack.close();
    micTrack = null;
  }

  await c.leave();
  client = null;
}
