import { useEffect, useRef } from "react";
import type { GadsMicSample } from "@/lib/gads/types";

// Periodic webcam stills + microphone activity sampling, layered on top of
// the continuous recording useMediaRecording already provides (reused
// unmodified for that part). This hook owns two independent tickers:
//  - every SNAPSHOT_INTERVAL_MS, grabs a JPEG still off the video track via
//    an offscreen <video>/<canvas> pair and hands it to onSnapshot, so the
//    caller can upload it and attach the URL.
//  - every MIC_SAMPLE_INTERVAL_MS, reads a coarse RMS level off an
//    AnalyserNode and appends it to an in-memory buffer the caller drains
//    on its own autosave cadence via drainMicSamples() - a signal, never a
//    recording.

const SNAPSHOT_INTERVAL_MS = 75_000;
const MIC_SAMPLE_INTERVAL_MS = 5_000;
const MIC_ACTIVE_THRESHOLD = 0.02;

export function useGadsMediaCapture(
  stream: MediaStream | null,
  active: boolean,
  onSnapshot: (blob: Blob) => void,
) {
  const micSamplesRef = useRef<GadsMicSample[]>([]);
  const onSnapshotRef = useRef(onSnapshot);
  onSnapshotRef.current = onSnapshot;

  useEffect(() => {
    if (!active || !stream) return;

    let cancelled = false;
    const videoEl = document.createElement("video");
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.srcObject = stream;
    void videoEl.play().catch(() => {});
    const canvas = document.createElement("canvas");

    const snapshotTimer = window.setInterval(() => {
      if (cancelled || videoEl.readyState < 2) return;
      canvas.width = 320;
      canvas.height =
        Math.round((videoEl.videoHeight / Math.max(1, videoEl.videoWidth)) * 320) || 240;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (blob && !cancelled) onSnapshotRef.current(blob);
        },
        "image/jpeg",
        0.7,
      );
    }, SNAPSHOT_INTERVAL_MS);

    let audioCtx: AudioContext | null = null;
    let micTimer: number | null = null;
    if (stream.getAudioTracks().length > 0) {
      try {
        audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);

        micTimer = window.setInterval(() => {
          if (cancelled) return;
          analyser.getByteTimeDomainData(data);
          let sumSquares = 0;
          for (let i = 0; i < data.length; i++) {
            const normalized = (data[i] - 128) / 128;
            sumSquares += normalized * normalized;
          }
          const level = Math.min(1, Math.sqrt(sumSquares / data.length));
          micSamplesRef.current.push({
            at: new Date().toISOString(),
            level: Math.round(level * 1000) / 1000,
            active: level >= MIC_ACTIVE_THRESHOLD,
          });
          if (micSamplesRef.current.length > 600) {
            micSamplesRef.current = micSamplesRef.current.slice(-600);
          }
        }, MIC_SAMPLE_INTERVAL_MS);
      } catch (err) {
        console.error("[gads-media-capture] mic analyser setup failed:", err);
      }
    }

    return () => {
      cancelled = true;
      window.clearInterval(snapshotTimer);
      if (micTimer !== null) window.clearInterval(micTimer);
      audioCtx?.close().catch(() => {});
      videoEl.pause();
      videoEl.srcObject = null;
    };
  }, [active, stream]);

  const drainMicSamples = (): GadsMicSample[] => {
    const samples = micSamplesRef.current;
    micSamplesRef.current = [];
    return samples;
  };

  return { drainMicSamples };
}
