import { useEffect } from "react";

// Reuse a single AudioContext — creating one per click is expensive
let _ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  try {
    if (!_ctx || _ctx.state === "closed") {
      _ctx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )();
    }
    if (_ctx.state === "suspended") _ctx.resume();
    return _ctx;
  } catch {
    return null;
  }
}

function playClick() {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.045);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);

    const bufLen = Math.floor(ctx.sampleRate * 0.04);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 4);
    }
    const noise = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    noise.buffer = buf;
    noiseGain.gain.setValueAtTime(0.055, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
  } catch {
    /* silent */
  }
}

export function useClickSound() {
  useEffect(() => {
    document.addEventListener("click", playClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", playClick, { capture: true });
  }, []);
}
