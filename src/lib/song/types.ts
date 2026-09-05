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

/**
 * One timed lyric syllable or phrase from MIDI meta (`lyrics` 0x05) or
 * KAR `text` events. Times are in beats, matching notes.
 */
export type SongLyric = {
  startBeats: number;
  text: string;
};

/** Where a sourced MIDI came from — used to avoid ingesting the same file twice. */
export type SongOrigin = {
  /** Listing or article page. */
  url?: string;
  /** Original filename as published or downloaded (not `arrangement.mid`). */
  filename?: string;
  /** Direct URL of the `.mid` if we have one. */
  fileUrl?: string;
  /** Local path we copied from (Downloads, etc.). */
  localPath?: string;
  /** Site or set name, e.g. FreeSheetMusic.net · Klezmer Folktunes. */
  collection?: string;
  /** Version, arranger, or why this is a second copy of a known title. */
  note?: string;
  /** ISO date the file was ingested (YYYY-MM-DD). */
  ingestedAt?: string;
};

export type SongDocumentMeta = {
  title: string;
  /** Search/display line (version, collection). Copied onto the picker manifest. */
  subtitle?: string;
  /** Picker labels, stored as strings so the document stays catalog-independent. */
  labels?: string[];
  artist?: string;
  key?: string;
  tempo: number;
  /** [beats per bar, beat unit] e.g. [3, 4] */
  timeSignature: [number, number];
  provenance: "midi" | "abc" | "musicxml" | "audio" | "omr" | "manual";
  confidence: number;
  sources?: { role: SongTrackRole; file: string }[];
  origin?: SongOrigin;
};

/**
 * Canonical in-app song. MIDI / ABC / etc. are adapters into this.
 * The Piano Roll consumes a derived sequence; it does not store the document.
 */
export type SongDocument = {
  meta: SongDocumentMeta;
  tracks: SongTrack[];
  /** Timed lyrics from the MIDI/KAR. Omitted when the file has none. */
  lyrics?: SongLyric[];
  /** Unsynced full text when the source publishes a lyric sheet beside the MIDI. */
  lyricSheet?: string;
};
