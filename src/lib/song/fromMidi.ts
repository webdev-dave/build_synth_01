import * as ToneMidi from "@tonejs/midi";

type MidiCtor = typeof import("@tonejs/midi").Midi;
type MidiFile = InstanceType<MidiCtor>;

/** CJS (Node ingest script) and ESM (Next) export `Midi` differently. */
function MidiClass(): MidiCtor {
  const ns = ToneMidi as unknown as {
    Midi?: MidiCtor;
    default?: MidiCtor | { Midi: MidiCtor };
  };
  if (typeof ns.Midi === "function") return ns.Midi;
  if (typeof ns.default === "function") return ns.default;
  if (ns.default && typeof ns.default.Midi === "function") return ns.default.Midi;
  throw new Error("Could not load @tonejs/midi Midi constructor");
}

import type {
  SongDocument,
  SongDocumentMeta,
  SongNote,
  SongTrack,
  SongTrackRole,
} from "./types";

export type MidiTrackInput = {
  bytes: ArrayBuffer | Uint8Array;
  role: SongTrackRole;
  name?: string;
  sourceFile?: string;
};

const quantize = (beats: number, step = 0.5): number =>
  Math.round(beats / step) * step;

function notesFromTrack(
  track: MidiFile["tracks"][number],
  ppq: number,
): SongNote[] {
  return track.notes.map((n) => ({
    midi: n.midi,
    startBeats: quantize(n.ticks / ppq),
    durationBeats: Math.max(0.5, quantize(n.durationTicks / ppq)),
    velocity: n.velocity,
  }));
}

function notesFromMidi(midi: MidiFile): SongNote[] {
  const ppq = midi.header.ppq || 480;
  const out: SongNote[] = [];
  for (const track of midi.tracks) {
    if (track.channel === 9) continue;
    out.push(...notesFromTrack(track, ppq));
  }
  return out;
}

function inferRole(notes: SongNote[]): SongTrackRole {
  if (notes.length === 0) return "other";
  const min = Math.min(...notes.map((n) => n.midi));
  const max = Math.max(...notes.map((n) => n.midi));
  if (max <= 52) return "bass";
  if (max - min <= 26 && notes.length <= 400) return "melody";
  return "chords";
}

function firstTimeSignature(midi: MidiFile): [number, number] {
  const ts = midi.header.timeSignatures[0]?.timeSignature;
  if (ts && ts.length >= 2) return [ts[0], ts[1]];
  return [4, 4];
}

function firstTempo(midi: MidiFile): number {
  const bpm = midi.header.tempos[0]?.bpm;
  return bpm ? Math.round(bpm) : 120;
}

/**
 * Merge one or more `.mid` files (e.g. a voice file + a piano file) into
 * one SongDocument. Empty and drum-channel tracks are skipped.
 */
export function ingestMidiTracks(
  inputs: MidiTrackInput[],
  meta: Pick<SongDocumentMeta, "title"> & Partial<SongDocumentMeta>,
): SongDocument {
  if (inputs.length === 0) {
    throw new Error("ingestMidiTracks: no MIDI inputs");
  }

  const tracks: SongTrack[] = [];
  const sources: NonNullable<SongDocumentMeta["sources"]> = [];
  let tempo = meta.tempo;
  let timeSignature = meta.timeSignature;

  for (const input of inputs) {
    const midi = new (MidiClass())(input.bytes);
    if (!tempo) tempo = firstTempo(midi);
    if (!timeSignature) timeSignature = firstTimeSignature(midi);

    const notes = notesFromMidi(midi);
    if (notes.length === 0) continue;

    const id = input.role;
    const existing = tracks.filter((t) => t.role === input.role).length;
    tracks.push({
      id: existing === 0 ? id : `${id}-${existing + 1}`,
      name: input.name ?? (input.role === "melody" ? "Voice" : input.role),
      role: input.role,
      notes,
    });

    if (input.sourceFile) {
      sources.push({ role: input.role, file: input.sourceFile });
    }
  }

  if (tracks.length === 0) {
    throw new Error("ingestMidiTracks: no pitched notes found");
  }

  return {
    meta: {
      title: meta.title,
      artist: meta.artist,
      key: meta.key,
      tempo: tempo ?? 120,
      timeSignature: timeSignature ?? [4, 4],
      provenance: "midi",
      confidence: 1,
      sources: sources.length ? sources : undefined,
    },
    tracks,
  };
}

/**
 * One multi-track `.mid` → one SongDocument, keeping pitched tracks
 * separate (drums on channel 10 are dropped).
 */
export function ingestMidiFile(
  bytes: ArrayBuffer | Uint8Array,
  meta: Pick<SongDocumentMeta, "title"> & Partial<SongDocumentMeta>,
  sourceFile?: string,
): SongDocument {
  const midi = new (MidiClass())(bytes);
  const ppq = midi.header.ppq || 480;
  const tracks: SongTrack[] = [];

  for (const raw of midi.tracks) {
    if (raw.channel === 9 || raw.notes.length === 0) continue;
    const notes = notesFromTrack(raw, ppq);
    const role = inferRole(notes);
    const used = tracks.filter((t) => t.role === role).length;
    tracks.push({
      id: used === 0 ? role : `${role}-${used + 1}`,
      name: raw.name?.trim() || `Track ${tracks.length + 1}`,
      role,
      notes,
    });
  }

  if (tracks.length === 0) {
    throw new Error("ingestMidiFile: no pitched notes found");
  }

  return {
    meta: {
      title: meta.title,
      artist: meta.artist,
      key: meta.key,
      tempo: meta.tempo ?? firstTempo(midi),
      timeSignature: meta.timeSignature ?? firstTimeSignature(midi),
      provenance: "midi",
      confidence: 1,
      sources: sourceFile
        ? [{ role: tracks[0].role, file: sourceFile }]
        : undefined,
    },
    tracks,
  };
}
