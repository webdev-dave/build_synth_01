import type { SongOrigin } from "@/lib/song";

import type { SongEntry } from "./types";

/** Collapse encoding and punctuation so `hopak katsatske.mid` matches `%20`. */
export function normalizeSourceKey(value: string): string {
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    decoded = value;
  }
  return decoded.trim().toLowerCase().replace(/[_+]+/g, " ").replace(/\s+/g, " ");
}

export function sourceMatchKeys(origin: SongOrigin): string[] {
  const keys: string[] = [];
  if (origin.filename) keys.push(`file:${normalizeSourceKey(origin.filename)}`);
  if (origin.fileUrl) keys.push(`url:${normalizeSourceKey(origin.fileUrl)}`);
  return keys;
}

/** Same remote/local file already in the catalog (not merely the same title). */
export function findSameSource(
  origin: SongOrigin,
  catalog: SongEntry[],
): SongEntry | undefined {
  const incoming = new Set(sourceMatchKeys(origin));
  if (incoming.size === 0) return undefined;
  return catalog.find((song) => {
    const existing = song.source ?? song.document?.meta.origin;
    if (!existing) return false;
    return sourceMatchKeys(existing).some((key) => incoming.has(key));
  });
}
