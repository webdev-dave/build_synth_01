/**
 * Pitch ↔ frequency in 12-TET, A4 = 440 Hz. The arithmetic the Hz readout,
 * the octave demo, and the frequency slider all agree on.
 *
 * Import-free so a plain Node script can load it for checks.
 */

export const A4_HZ = 440;
export const A4_MIDI = 69;

/** One equal-tempered half step: the twelfth root of two (≈ 1.05946). */
export const HALF_STEP_RATIO = Math.pow(2, 1 / 12);

const SHARP_NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];

export function frequencyOf(midi: number): number {
  return A4_HZ * Math.pow(2, (midi - A4_MIDI) / 12);
}

export interface Pitch {
  /** Nearest 12-TET note. */
  midi: number;
  /** Signed distance from that note, −50 … +50 cents. */
  cents: number;
}

export function pitchFromFrequency(hz: number): Pitch {
  const exact = A4_MIDI + 12 * Math.log2(hz / A4_HZ);
  const midi = Math.round(exact);
  return { midi, cents: Math.round((exact - midi) * 100) };
}

/** Scientific pitch name with sharps: 60 → "C4", 69 → "A4". */
export function pitchLabel(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  return `${SHARP_NAMES[((midi % 12) + 12) % 12]}${octave}`;
}

/** "440.00 Hz" — two decimals, the readout convention. */
export function formatHz(hz: number, digits = 2): string {
  return `${hz.toFixed(digits)} Hz`;
}
