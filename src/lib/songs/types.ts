import type { ChordEvent, MelodyEvent } from "@/components/home/heroTune";
import type { SongDocument, SongOrigin } from "@/lib/song";

export type { SongOrigin };

export type SongId = string;

/** Yesterday (hero drafts + Beatles MIDI). */
export const YESTERDAY_LABELS = ["pop", "rock", "folk"] as const;

/** Everything else in the current catalog. */
export const KLEZMER_LABELS = ["jewish", "klezmer", "yiddish"] as const;

/** Blues samples and (later) MidKar / pdmusic blues pages. */
export const BLUES_LABELS = ["blues"] as const;

export type SongLabel =
  | (typeof YESTERDAY_LABELS)[number]
  | (typeof KLEZMER_LABELS)[number]
  | (typeof BLUES_LABELS)[number]
  | (string & {});

/**
 * Picker/search row. Lives in the bundle via `manifest.json`.
 * MIDI payloads are fetched from `/catalog/<id>.json` on select.
 */
export type SongManifestEntry = {
  id: SongId;
  title: string;
  /** Version, artist, or other search/display context */
  subtitle?: string;
  /** Searchable categories shown in the Song picker. */
  labels: readonly SongLabel[];
  /** Listing URL, original filename, collection — required for sourced MIDI. */
  source?: SongOrigin;
  bpm: number;
  /** Visible workspace length. Derived at ingest if omitted. */
  bars?: number;
  timeSignature?: [number, number];
  artist?: string;
  key?: string;
  hasLyrics?: boolean;
  hasLyricSheet?: boolean;
  /** Fetch `/catalog/<id>.json` on select. Handwritten drafts omit this. */
  hasCatalog?: boolean;
};

/**
 * A catalog entry the Piano Roll (and later, other labs) can load.
 * Add new drafts here instead of overwriting the live hero tune.
 */
export type SongEntry = SongManifestEntry & {
  /** Hero-style monophonic line. Empty when `document` is the source. */
  melody: MelodyEvent[];
  chords?: ChordEvent[];
  /** Present after fetch, or inline for handwritten drafts. */
  document?: SongDocument;
};
