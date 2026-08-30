import type { TimeSignature } from "@/lib/music";
import { documentTotalBeats } from "@/lib/song/stats";

import type { SongEntry, SongId } from "./types";
import { yesterdayV1, yesterdayV2 } from "./yesterday";
import { yesterdayBeatles } from "./yesterday-beatles";
import { beiMirBistDuSchon } from "./bei-mir-bist-du-schon";
import { tumbalalaikaPanamarjov } from "./tumbalalaika-panamarjov";
import { tumbalalaika } from "./tumbalalaika";

/** Piano Roll default — the draft we’re honing, not the live hero. */
export const DEFAULT_SONG_ID: SongId = "yesterday-v2";

/**
 * Append new tunes here. Order is display order; search is independent.
 */
export const SONGS: SongEntry[] = [
  yesterdayV2,
  yesterdayV1,
  yesterdayBeatles,
  beiMirBistDuSchon,
  tumbalalaika,
  tumbalalaikaPanamarjov,
];

export function getSong(id: SongId): SongEntry | undefined {
  return SONGS.find((song) => song.id === id);
}

export function getDefaultSong(): SongEntry {
  return getSong(DEFAULT_SONG_ID) ?? SONGS[0];
}

/** Case-insensitive match on id, title, and subtitle. Empty query = all. */
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
  const ts = song.document?.meta.timeSignature;
  if (ts && ts.length >= 2) return [ts[0], ts[1]];
  return [4, 4];
}

export function songBars(song: SongEntry): number {
  if (song.bars && song.bars > 0) return song.bars;
  if (song.document) {
    const beats = documentTotalBeats(song.document);
    const [num, den] = songTimeSignature(song);
    const quartersPerBar = num * (4 / den);
    return Math.max(1, Math.ceil(beats / quartersPerBar));
  }
  const beats = song.melody.reduce((sum, ev) => sum + ev.beats, 0);
  return Math.max(1, Math.ceil(beats / 4));
}
