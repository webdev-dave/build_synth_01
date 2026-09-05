import type { TimeSignature } from "@/lib/music";
import { documentBars } from "@/lib/song/stats";

import type { SongEntry, SongId, SongManifestEntry } from "./types";
import { yesterdayV1, yesterdayV2 } from "./yesterday";
import manifestJson from "./manifest.json";

const MANIFEST = manifestJson as unknown as SongManifestEntry[];

function fromManifest(row: SongManifestEntry): SongEntry {
  return { ...row, melody: [], hasCatalog: true };
}

/** Piano Roll default — the draft we’re honing, not the live hero. */
export const DEFAULT_SONG_ID: SongId = "yesterday-v2";

/**
 * Picker rows only. MIDI payloads load from /catalog/<id>.json on select.
 */
export const SONGS: SongEntry[] = [
  yesterdayV2,
  yesterdayV1,
  ...MANIFEST.map(fromManifest),
];

export function getSong(id: SongId): SongEntry | undefined {
  return SONGS.find((song) => song.id === id);
}

export function getDefaultSong(): SongEntry {
  return getSong(DEFAULT_SONG_ID) ?? SONGS[0];
}

/** Case-insensitive match on id, title, subtitle, and labels. Empty query = all. */
export function searchSongs(
  query: string,
  catalog: SongEntry[] = SONGS,
): SongEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return catalog;
  return catalog.filter((song) => {
    const hay = [
      song.id,
      song.title,
      song.subtitle ?? "",
      ...(song.labels ?? []),
      song.source?.url ?? "",
      song.source?.filename ?? "",
      song.source?.fileUrl ?? "",
      song.source?.collection ?? "",
      song.source?.note ?? "",
      song.artist ?? "",
      song.key ?? "",
      song.document?.meta.artist ?? "",
      song.document?.meta.key ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function songBeatsPerBar(song: SongEntry): number {
  return songTimeSignature(song)[0];
}

export function songTimeSignature(song: SongEntry): TimeSignature {
  const ts = song.timeSignature ?? song.document?.meta.timeSignature;
  if (ts && ts.length >= 2) return [ts[0], ts[1]];
  return [4, 4];
}

export function songBars(song: SongEntry): number {
  if (song.bars && song.bars > 0) return song.bars;
  if (song.document) {
    return documentBars(song.document);
  }
  const beats = song.melody.reduce((sum, ev) => sum + ev.beats, 0);
  return Math.max(1, Math.ceil(beats / 4));
}
