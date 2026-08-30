import type { SequenceEvent } from "@/components/midi/melodyConvert";
import { TICKS_PER_BEAT } from "./ticks";

import { documentPitchRange, documentTotalBeats } from "./stats";
import type { SongDocument, SongTrackRole } from "./types";

export function documentToSequence(
  doc: SongDocument,
  roles?: SongTrackRole[],
): SequenceEvent[] {
  const seq: SequenceEvent[] = [];
  for (const track of doc.tracks) {
    if (roles && !roles.includes(track.role)) continue;
    for (const n of track.notes) {
      seq.push({
        t: Math.round(n.startBeats * TICKS_PER_BEAT),
        g: Math.max(1, Math.round(n.durationBeats * TICKS_PER_BEAT)),
        n: n.midi,
        f: 0,
      });
    }
  }
  return seq.sort((a, b) => a.t - b.t || a.n - b.n);
}

export type RollView = {
  sequence: SequenceEvent[];
  bpm: number;
  bars: number;
  beatsPerBar: number;
  pitchMin: number;
  pitchRange: number;
  totalTicks: number;
};

export function documentToRollView(doc: SongDocument): RollView {
  const sequence = documentToSequence(doc);
  const beatsPerBar = doc.meta.timeSignature[0] || 4;
  const totalBeats = documentTotalBeats(doc);
  const bars = Math.max(1, Math.ceil(totalBeats / beatsPerBar));
  const { min, max } = documentPitchRange(doc);
  const pad = 1;
  const pitchMin = Math.max(0, min - pad);
  const pitchRange = Math.max(13, max - pitchMin + 1 + pad);
  const lastTick = sequence.reduce((m, ev) => Math.max(m, ev.t + ev.g), 0);
  return {
    sequence,
    bpm: doc.meta.tempo,
    bars,
    beatsPerBar,
    pitchMin,
    pitchRange,
    totalTicks: lastTick,
  };
}
