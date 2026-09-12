/**
 * Per-pitch-class detune — how a Middle Eastern keyboard plays quarter tones.
 *
 * Arrangers sold in the region (Korg Pa "Quarter Tone" sub-scale, Yamaha
 * "Oriental" scale setting) carry a strip of twelve switches, C to B. Press
 * the E switch and every E on the keyboard drops a quarter tone — by
 * convention −50 cents — until it is pressed again. The keys do not move;
 * the tuning under them does. Maqam Rast on C is then just the white keys
 * with E and B bent. We model exactly that: twelve cent offsets, one per
 * pitch class, applied to every octave.
 *
 * Real maqam intonation is not a fixed −50 (Syrian Rast sits nearer −45,
 * Egyptian nearer −60, and players bend by ear). The panel default is the
 * keyboard convention, not a measurement, and the lesson copy says so.
 *
 * Deliberately import-free so a plain Node script can load it for checks.
 */

/** Cents offset for each pitch class 0–11 (C = 0). `+` sharpens. */
export type DetuneMap = readonly number[];

export const QUARTER_TONE_CENTS = -50;

/** Korg/Yamaha let the offset run to ±99¢; past that it is a different key. */
export const DETUNE_LIMIT_CENTS = 99;

export const NO_DETUNE: DetuneMap = Object.freeze(Array<number>(12).fill(0));

const mod12 = (n: number) => ((n % 12) + 12) % 12;

export function isDetuned(map: DetuneMap): boolean {
  return map.some((c) => c !== 0);
}

export function sameDetune(a: DetuneMap, b: DetuneMap): boolean {
  return a.length === b.length && a.every((c, i) => c === b[i]);
}

/** Toggle one pitch class between `cents` and 0. */
export function toggleDetune(map: DetuneMap, pitchClass: number, cents: number): DetuneMap {
  const next = [...map];
  const pc = mod12(pitchClass);
  next[pc] = next[pc] === 0 ? cents : 0;
  return next;
}

/** Give every bent pitch class the same new amount (leaves 0s alone). */
export function retuneAll(map: DetuneMap, cents: number): DetuneMap {
  return map.map((c) => (c === 0 ? 0 : cents));
}

/** Build a map from a list of bent pitch classes at one amount. */
export function detuneFor(pitchClasses: readonly number[], cents = QUARTER_TONE_CENTS): DetuneMap {
  const next = Array<number>(12).fill(0);
  for (const pc of pitchClasses) next[mod12(pc)] = cents;
  return next;
}

/** Frequency after detune: 100¢ is a semitone, so cents/1200 octaves. */
export function applyDetune(frequency: number, cents: number): number {
  return cents === 0 ? frequency : frequency * Math.pow(2, cents / 1200);
}

/** Nearest 12-TET MIDI note for a frequency (A4 = 440). */
export function midiFromFrequency(frequency: number): number {
  return Math.round(69 + 12 * Math.log2(frequency / 440));
}

/**
 * Suffix that names a cent offset the way players write it: "½♭" and "½♯"
 * for the quarter tones, otherwise the raw signed cents.
 */
export function centsSuffix(cents: number): string {
  if (cents === 0) return "";
  if (cents === -50) return "½♭";
  if (cents === 50) return "½♯";
  return `${cents > 0 ? "+" : "−"}${Math.abs(cents)}¢`;
}

/* ------------------------------------------------------------------------ */
/* Presets — the maqamat a keyboard player actually reaches for             */
/* ------------------------------------------------------------------------ */

export interface DetunePreset {
  id: string;
  /** "Rast" — the maqam. */
  name: string;
  /** Home key the preset is voiced in ("C"); the same maqam elsewhere needs other switches. */
  key: string;
  /** Pitch classes bent by a quarter tone. */
  bent: readonly number[];
  /** Which scale degrees those are, for the caption ("3 and 7"). */
  degrees: string;
}

/*
 * Voicings in the keys Arabic-music teaching material uses. Sikah on E½♭
 * and Saba on D bend the same switches as Rast on C and Bayati on D, so
 * they are not listed twice — the panel is about which keys bend, not
 * which is home.
 */
export const DETUNE_PRESETS: readonly DetunePreset[] = [
  { id: "rast-c", name: "Rast", key: "C", bent: [4, 11], degrees: "3 and 7" },
  { id: "rast-g", name: "Rast", key: "G", bent: [11, 6], degrees: "3 and 7" },
  { id: "bayati-d", name: "Bayati", key: "D", bent: [4], degrees: "2" },
  { id: "bayati-g", name: "Bayati", key: "G", bent: [9], degrees: "2" },
];

export function presetMap(preset: DetunePreset): DetuneMap {
  return detuneFor(preset.bent);
}

/** The preset a map matches exactly, if any. */
export function matchingPreset(map: DetuneMap): DetunePreset | undefined {
  return DETUNE_PRESETS.find((p) => sameDetune(presetMap(p), map));
}
