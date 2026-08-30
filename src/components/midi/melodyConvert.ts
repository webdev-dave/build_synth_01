import type { MelodyEvent, NoteName } from "@/components/home/heroTune";

/**
 * Conversion between the hero-tune `MelodyEvent[]` format and the
 * webaudio-pianoroll `sequence` format ({t, g, n} in ticks / MIDI notes).
 *
 * The roll is configured with timebase 8 (eighth-note ticks in 4/4), so
 * 1 tick = half a beat — the finest value the hero melody uses. Rests are
 * implicit in the roll (gaps between notes); the piece end (markend) closes
 * the final rest.
 */

import { TICKS_PER_BEAT } from "@/lib/song/ticks";

export { TICKS_PER_BEAT };

export type SequenceEvent = { t: number; g: number; n: number; f?: number };

const MIDI_C4 = 60;

/** Chromatic C4–C5, indexed by (midi - 60). Matches the NOTES table range. */
const NOTE_ORDER: NoteName[] = [
  "C4",
  "C#4",
  "D4",
  "D#4",
  "E4",
  "F4",
  "F#4",
  "G4",
  "G#4",
  "A4",
  "A#4",
  "B4",
  "C5",
];

export const noteToMidi = (note: NoteName): number =>
  MIDI_C4 + NOTE_ORDER.indexOf(note);

export const midiToNote = (n: number): NoteName | null =>
  NOTE_ORDER[n - MIDI_C4] ?? null;

const PITCH_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

/** Scientific pitch for any MIDI number (C4 = 60). */
export const midiToPitchName = (n: number): string =>
  `${PITCH_NAMES[((n % 12) + 12) % 12]}${Math.floor(n / 12) - 1}`;

export const midiToHz = (n: number): number =>
  440 * Math.pow(2, (n - 69) / 12);

export const melodyTotalTicks = (melody: MelodyEvent[]): number =>
  Math.round(
    melody.reduce((sum, ev) => sum + ev.beats, 0) * TICKS_PER_BEAT
  );

export function melodyToSequence(melody: MelodyEvent[]): SequenceEvent[] {
  const seq: SequenceEvent[] = [];
  let tick = 0;
  for (const ev of melody) {
    const g = Math.round(ev.beats * TICKS_PER_BEAT);
    if (ev.note) seq.push({ t: tick, g, n: noteToMidi(ev.note), f: 0 });
    tick += g;
  }
  return seq;
}

export type MelodyExport = {
  events: MelodyEvent[];
  /** Notes outside C4–C5 that could not map to a NoteName */
  dropped: number;
  /** Lyric count vs painted note count, when they differ */
  lyricMismatch: { lyrics: number; notes: number } | null;
};

/**
 * Read a painted sequence back into `MelodyEvent[]`. Gaps become rests and
 * `endTick` (the roll's end marker) closes a trailing rest. Lyrics are
 * re-attached by note order from `lyricSource` — position, not pitch, since
 * the whole point of the tool is correcting pitches under the same words.
 */
export function sequenceToMelody(
  seq: SequenceEvent[],
  endTick: number,
  lyricSource: MelodyEvent[]
): MelodyExport {
  const sorted = [...seq].sort((a, b) => a.t - b.t);
  const lyrics = lyricSource
    .filter((ev) => ev.note)
    .map((ev) => ev.lyric);

  const events: MelodyEvent[] = [];
  let dropped = 0;
  let noteIdx = 0;
  let cursor = 0;

  for (const ev of sorted) {
    const note = midiToNote(ev.n);
    if (!note) {
      dropped++;
      continue;
    }
    if (ev.t > cursor) {
      events.push({ note: null, beats: (ev.t - cursor) / TICKS_PER_BEAT });
    }
    events.push({
      note,
      beats: ev.g / TICKS_PER_BEAT,
      lyric: lyrics[noteIdx] ?? undefined,
    });
    noteIdx++;
    cursor = Math.max(cursor, ev.t + ev.g);
  }
  if (endTick > cursor) {
    events.push({ note: null, beats: (endTick - cursor) / TICKS_PER_BEAT });
  }

  return {
    events,
    dropped,
    lyricMismatch:
      lyrics.length === noteIdx
        ? null
        : { lyrics: lyrics.length, notes: noteIdx },
  };
}

/** Render an export as the `MELODY` literal ready to paste into heroTune.ts. */
export function melodyToCode(result: MelodyExport): string {
  const warnings: string[] = [];
  if (result.dropped > 0) {
    warnings.push(
      `// WARNING: ${result.dropped} painted note(s) fell outside C4–C5 and were dropped.`
    );
  }
  if (result.lyricMismatch) {
    warnings.push(
      `// NOTE: lyrics re-attached by note order — source had ${result.lyricMismatch.lyrics} lyric slots, roll has ${result.lyricMismatch.notes} notes.`
    );
  }
  const body = result.events
    .map((ev) =>
      ev.note
        ? `  { note: "${ev.note}", beats: ${ev.beats}${
            ev.lyric ? `, lyric: "${ev.lyric}"` : ""
          } },`
        : `  { note: null, beats: ${ev.beats} },`
    )
    .join("\n");
  return [
    ...warnings,
    `export const MELODY: MelodyEvent[] = [`,
    body,
    `];`,
  ].join("\n");
}
