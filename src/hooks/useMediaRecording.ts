import { useCallback, useEffect, useRef, useState } from "react";

// Webcam + microphone capture for the assessment. The stream is acquired at
// the permission gate (so the candidate sees exactly what's recorded before
// starting), recorded with MediaRecorder during the exam, and assembled into
// a single Blob for direct-to-Blob-storage upload after submit.

export type PermissionState = "idle" | "requesting" | "granted" | "denied";

const RECORDER_MIME_CANDIDATES = ["video/webm;codecs=vp8,opus", "video/webm", "video/mp4"];

/** Modest quality on purpose: enough to see the candidate and hear the room,
 * small enough (~2-3MB/min) that a 30-minute upload finishes quickly. */
const VIDEO_CONSTRAINTS: MediaTrackConstraints = {
  width: { ideal: 640 },
  height: { ideal: 480 },
  frameRate: { ideal: 15, max: 24 },
};

export function useMediaRecording() {
  const [permission, setPermission] = useState<PermissionState>("idle");
  const [isRecording, setIsRecording] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const mimeTypeRef = useRef<string>("video/webm");

  const requestPermissions = useCallback(async (): Promise<MediaStream | null> => {
    setPermission("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: VIDEO_CONSTRAINTS,
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;
      setPermission("granted");
      return stream;
    } catch (err) {
      console.error("[recording] getUserMedia failed:", err);
      setPermission("denied");
      return null;
    }
  }, []);

  const startRecording = useCallback((): boolean => {
    const stream = streamRef.current;
    if (!stream || recorderRef.current?.state === "recording") return false;
    const mimeType =
      RECORDER_MIME_CANDIDATES.find(
        (t) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t),
      ) ?? "";
    try {
      const recorder = new MediaRecorder(stream, {
        ...(mimeType ? { mimeType } : {}),
        videoBitsPerSecond: 500_000,
        audioBitsPerSecond: 64_000,
      });
      mimeTypeRef.current = recorder.mimeType || mimeType || "video/webm";
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.start(10_000); // 10s timeslices so a crash loses at most 10s
      recorderRef.current = recorder;
      setIsRecording(true);
      return true;
    } catch (err) {
      console.error("[recording] MediaRecorder start failed:", err);
      return false;
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = recorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        setIsRecording(false);
        resolve(
          chunksRef.current.length
            ? new Blob(chunksRef.current, { type: mimeTypeRef.current })
            : null,
        );
        return;
      }
      recorder.onstop = () => {
        setIsRecording(false);
        resolve(
          chunksRef.current.length
            ? new Blob(chunksRef.current, { type: mimeTypeRef.current })
            : null,
        );
      };
      try {
        recorder.stop();
      } catch {
        setIsRecording(false);
        resolve(null);
      }
    });
  }, []);

  const releaseStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recorderRef.current = null;
    setPermission("idle");
    setIsRecording(false);
  }, []);

  // Never leave the camera light on after unmount.
  useEffect(() => releaseStream, [releaseStream]);

  return {
    permission,
    isRecording,
    /** Live stream for the self-view <video>. */
    getStream: () => streamRef.current,
    getMimeType: () => mimeTypeRef.current,
    requestPermissions,
    startRecording,
    stopRecording,
    releaseStream,
  };
}
