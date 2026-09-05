import { expandDocument } from "@/lib/song/compact";
import type { SongDocument } from "@/lib/song";

import type { SongEntry } from "./types";

const memory = new Map<string, SongDocument>();

export function catalogUrl(id: string): string {
  return `/catalog/${id}.json`;
}

export function songNeedsCatalog(song: SongEntry): boolean {
  return Boolean(song.hasCatalog) && !song.document;
}

export async function loadSongDocument(id: string): Promise<SongDocument> {
  const hit = memory.get(id);
  if (hit) return hit;
  const res = await fetch(catalogUrl(id));
  if (!res.ok) {
    throw new Error(`Catalog ${id}: HTTP ${res.status}`);
  }
  const doc = expandDocument(await res.json());
  memory.set(id, doc);
  return doc;
}

/** Attach the fetched document when the picker row is catalog-backed. */
export async function resolveSongEntry(song: SongEntry): Promise<SongEntry> {
  if (!songNeedsCatalog(song)) return song;
  const document = await loadSongDocument(song.id);
  return { ...song, document };
}
