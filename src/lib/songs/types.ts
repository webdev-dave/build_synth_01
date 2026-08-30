import type { ChordEvent, MelodyEvent } from "@/components/home/heroTune";
import type { SongDocument, SongOrigin } from "@/lib/song";

export type { SongOrigin };

export type SongId = string;

/** Yesterday (hero drafts + Beatles MIDI). */
export const YESTERDAY_LABELS = ["pop", "rock", "folk"] as const;

/** Everything else in the current catalog. */
export const KLEZMER_LABELS = ["jewish", "klezmer", "yiddish"] as const;

export type SongLabel =
  | (typeof YESTERDAY_LABELS)[number]
  | (typeof KLEZMER_LABELS)[number]
  | (string & {});

/**
 * A catalog entry the Piano Roll (and later, other labs) can load.
 * Add new drafts here instead of overwriting the live hero tune.
 */
export type SongEntry = {
  id: SongId;
  title: string;
  /** Version, artist, or other search/display context */
  subtitle?: string;
  /** Searchable categories shown in the Song picker. */
  labels: readonly SongLabel[];
  /** Listing URL, original filename, collection — required for sourced MIDI. */
  source?: SongOrigin;
  bpm: number;
  /** Visible 4/4 workspace length. Derived from the melody if omitted. */
  bars?: number;
  /** Hero-style monophonic line. Empty when `document` is the source. */
  melody: MelodyEvent[];
  chords?: ChordEvent[];
  /** MIDI-ingested (or other adapter) canonical document. */
  document?: SongDocument;
};
