import type { ChordEvent, MelodyEvent } from "@/components/home/heroTune";
import type { SongDocument } from "@/lib/song";

export type SongId = string;

/**
 * A catalog entry the Piano Roll (and later, other labs) can load.
 * Add new drafts here instead of overwriting the live hero tune.
 */
export type SongEntry = {
  id: SongId;
  title: string;
  /** Version, artist, or other search/display context */
  subtitle?: string;
  bpm: number;
  /** Visible 4/4 workspace length. Derived from the melody if omitted. */
  bars?: number;
  /** Hero-style monophonic line. Empty when `document` is the source. */
  melody: MelodyEvent[];
  chords?: ChordEvent[];
  /** MIDI-ingested (or other adapter) canonical document. */
  document?: SongDocument;
};
