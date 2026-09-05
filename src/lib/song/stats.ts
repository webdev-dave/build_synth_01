import type { SongDocument } from "./types";

/** Bar count from quarter-note beats. 6/8 is 3 quarters, not 6. */
export function documentBars(doc: SongDocument): number {
  const beats = documentTotalBeats(doc);
  const [num, den] = doc.meta.timeSignature;
  const quartersPerBar = (num || 4) * (4 / (den || 4));
  return Math.max(1, Math.ceil(beats / quartersPerBar));
}

export function documentTotalBeats(doc: SongDocument): number {
  let max = 0;
  for (const track of doc.tracks) {
    for (const n of track.notes) {
      max = Math.max(max, n.startBeats + n.durationBeats);
    }
  }
  return max;
}

export function documentPitchRange(doc: SongDocument): {
  min: number;
  max: number;
} {
  let min = 127;
  let max = 0;
  for (const track of doc.tracks) {
    for (const n of track.notes) {
      min = Math.min(min, n.midi);
      max = Math.max(max, n.midi);
    }
  }
  if (max < min) return { min: 60, max: 72 };
  return { min, max };
}
