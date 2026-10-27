import type { Tier } from "@/types/scroll";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function beep(freq: number, start: number, length: number, volume: number, type: OscillatorType) {
  const audio = getCtx();
  if (!audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = audio.currentTime + start;
  gain.gain.setValueAtTime(volume, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + length);
  osc.connect(gain).connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + length);
}

export function unlockAudio() {
  getCtx();
}

export function playTick() {
  beep(900, 0, 0.05, 0.05, "square");
}

// Rarer Tiers get a longer, higher fanfare.
export function playWin(tier: Tier) {
  const notes: Record<Tier, number[]> = {
    SSR: [523, 659, 784, 1047, 1319],
    SR: [523, 659, 784, 1047],
    R: [523, 659, 784, 880],
    A: [523, 659, 784],
    B: [523, 659],
    C: [523],
    E: [330],
  };
  notes[tier].forEach((freq, i) => beep(freq, i * 0.11, 0.3, 0.12, "triangle"));
}
