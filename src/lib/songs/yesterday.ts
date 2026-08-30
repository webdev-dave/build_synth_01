import {
  BPM,
  CHORDS,
  MELODY,
  type ChordEvent,
  type MelodyEvent,
} from "@/components/home/heroTune";
import { YESTERDAY_LABELS, type SongEntry } from "./types";

/** Same low pad voicings the hero uses, so v2 can share them without edits. */
const VOICE = {
  C: [130.81, 164.81, 196],
  Bm7: [123.47, 146.83, 185, 220],
  E7: [164.81, 207.65, 246.94, 293.66],
  Am: [110, 130.81, 164.81],
  F: [87.31, 110, 130.81],
  G7: [98, 123.47, 146.83, 174.61],
} as const;

/**
 * Current homepage attract-mode — kept as a library snapshot so we can
 * compare drafts without losing what the hero still plays.
 */
export const yesterdayV1: SongEntry = {
  id: "yesterday-v1",
  title: "Yesterday v1",
  subtitle: "Homepage hero — 5-bar draft",
  labels: YESTERDAY_LABELS,
  source: {
    collection: "instrumaps",
    note: "Handwritten hero draft — not sourced MIDI.",
  },
  bpm: BPM,
  bars: 8,
  melody: MELODY,
  chords: CHORDS,
};

/*
 * Pickup on beat 4, dotted-half “-day”, verse lined up to bar lines,
 * extra G dropped, two-bar rest so the loop is a full 8 bars.
 * Pitches of the sung line are unchanged from v1.
 */
export const YESTERDAY_V2_MELODY: MelodyEvent[] = [
  { note: null, beats: 3.0 },
  { note: "D4", beats: 0.5, lyric: "Yes-" },
  { note: "C4", beats: 0.5, lyric: "-ter-" },
  { note: "C4", beats: 3.0, lyric: "-day" },
  { note: null, beats: 1.0 },
  { note: "E4", beats: 0.5, lyric: "all" },
  { note: "F#4", beats: 0.5, lyric: "my" },
  { note: "G#4", beats: 0.5, lyric: "trou-" },
  { note: "A4", beats: 0.5, lyric: "-bles" },
  { note: "B4", beats: 0.5, lyric: "seemed" },
  { note: "C5", beats: 0.5, lyric: "so" },
  { note: "B4", beats: 1.0, lyric: "far" },
  { note: "A4", beats: 0.5, lyric: "a-" },
  { note: "A4", beats: 2.5, lyric: "-way" },
  { note: "A4", beats: 0.5, lyric: "Now" },
  { note: "A4", beats: 0.5, lyric: "it" },
  { note: "G4", beats: 0.5, lyric: "looks" },
  { note: "F4", beats: 0.5, lyric: "as" },
  { note: "E4", beats: 0.5, lyric: "though" },
  { note: "D4", beats: 0.5, lyric: "they're" },
  { note: "F4", beats: 1.0, lyric: "here" },
  { note: "E4", beats: 1.0, lyric: "to" },
  { note: "E4", beats: 3.0, lyric: "stay" },
  { note: null, beats: 1.0 },
  { note: null, beats: 8.0 },
];

export const YESTERDAY_V2_CHORDS: ChordEvent[] = [
  { at: 0, beats: 8, name: "C", hz: [...VOICE.C] },
  { at: 8, beats: 2, name: "Bm7", hz: [...VOICE.Bm7] },
  { at: 10, beats: 2, name: "E7", hz: [...VOICE.E7] },
  { at: 12, beats: 4, name: "Am", hz: [...VOICE.Am] },
  { at: 16, beats: 2, name: "F", hz: [...VOICE.F] },
  { at: 18, beats: 2, name: "G7", hz: [...VOICE.G7] },
  { at: 20, beats: 12, name: "C", hz: [...VOICE.C] },
];

export const yesterdayV2: SongEntry = {
  id: "yesterday-v2",
  title: "Yesterday v2",
  subtitle: "8-bar form, pickup on beat 4",
  labels: YESTERDAY_LABELS,
  source: {
    collection: "instrumaps",
    note: "Handwritten draft — not sourced MIDI.",
  },
  bpm: BPM,
  bars: 8,
  melody: YESTERDAY_V2_MELODY,
  chords: YESTERDAY_V2_CHORDS,
};
