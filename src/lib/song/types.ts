/** One note in a canonical song document. Times are in beats, not seconds. */
export type SongNote = {
  midi: number;
  startBeats: number;
  durationBeats: number;
  velocity: number;
};

export type SongTrackRole = "melody" | "chords" | "bass" | "other";

export type SongTrack = {
  id: string;
  name: string;
  role: SongTrackRole;
  notes: SongNote[];
};

export type SongDocumentMeta = {
  title: string;
  artist?: string;
  key?: string;
  tempo: number;
  /** [beats per bar, beat unit] e.g. [3, 4] */
  timeSignature: [number, number];
  provenance: "midi" | "abc" | "musicxml" | "audio" | "omr" | "manual";
  confidence: number;
  sources?: { role: SongTrackRole; file: string }[];
};

/**
 * Canonical in-app song. MIDI / ABC / etc. are adapters into this.
 * The Piano Roll consumes a derived sequence; it does not store the document.
 */
export type SongDocument = {
  meta: SongDocumentMeta;
  tracks: SongTrack[];
};
