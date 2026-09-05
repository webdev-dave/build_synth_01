/**
 * Shared on-disk catalog: compact JSON under public/catalog + a small
 * picker manifest in src/lib/songs. Ingest scripts and the one-shot
 * migrate both go through here so we don't grow another module-per-song.
 */

import fs from "node:fs";
import path from "node:path";

import { compactDocument, expandDocument } from "../../src/lib/song/compact.ts";
import { documentBars } from "../../src/lib/song/stats.ts";
import type { SongDocument, SongOrigin } from "../../src/lib/song/types.ts";

export type ManifestRow = {
  id: string;
  title: string;
  subtitle?: string;
  labels: string[];
  source?: SongOrigin;
  bpm: number;
  bars: number;
  timeSignature: [number, number];
  artist?: string;
  key?: string;
  hasLyrics?: boolean;
  hasLyricSheet?: boolean;
  hasCatalog: true;
};

export const LABEL_SETS: Record<string, string[]> = {
  YESTERDAY_LABELS: ["pop", "rock", "folk"],
  KLEZMER_LABELS: ["jewish", "klezmer", "yiddish"],
  BLUES_LABELS: ["blues"],
};

export function publicCatalogDir(root = process.cwd()): string {
  return path.join(root, "public", "catalog");
}

export function manifestPath(root = process.cwd()): string {
  return path.join(root, "src", "lib", "songs", "manifest.json");
}

export function catalogFile(id: string, root = process.cwd()): string {
  return path.join(publicCatalogDir(root), `${id}.json`);
}

function normKey(value: string): string {
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    decoded = value;
  }
  return decoded.trim().toLowerCase().replace(/[_+]+/g, " ").replace(/\s+/g, " ");
}

export function originKeys(origin: SongOrigin): string[] {
  const keys: string[] = [];
  if (origin.filename) keys.push(`file:${normKey(origin.filename)}`);
  if (origin.fileUrl) keys.push(`url:${normKey(origin.fileUrl)}`);
  return keys;
}

export function entryFromDocument(
  id: string,
  doc: SongDocument,
  extras?: { subtitle?: string; labels?: string[] },
): ManifestRow {
  const labels = extras?.labels ?? doc.meta.labels ?? [];
  const subtitle = extras?.subtitle ?? doc.meta.subtitle;
  const row: ManifestRow = {
    id,
    title: doc.meta.title,
    labels,
    source: doc.meta.origin,
    bpm: doc.meta.tempo,
    bars: documentBars(doc),
    timeSignature: doc.meta.timeSignature,
    hasCatalog: true,
  };
  if (subtitle) row.subtitle = subtitle;
  if (doc.meta.artist) row.artist = doc.meta.artist;
  if (doc.meta.key) row.key = doc.meta.key;
  if (doc.lyrics?.length) row.hasLyrics = true;
  if (doc.lyricSheet) row.hasLyricSheet = true;
  return row;
}

export function writeCatalogDocument(
  id: string,
  doc: SongDocument,
  extras?: { subtitle?: string; labels?: string[] },
  root = process.cwd(),
): ManifestRow {
  const next: SongDocument = {
    ...doc,
    meta: {
      ...doc.meta,
      subtitle: extras?.subtitle ?? doc.meta.subtitle,
      labels: extras?.labels ?? doc.meta.labels,
    },
  };
  const dir = publicCatalogDir(root);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(catalogFile(id, root), JSON.stringify(compactDocument(next)));
  return entryFromDocument(id, next, extras);
}

export function readCatalogDocument(
  id: string,
  root = process.cwd(),
): SongDocument {
  const raw = JSON.parse(fs.readFileSync(catalogFile(id, root), "utf8"));
  return expandDocument(raw);
}

export function readManifest(root = process.cwd()): ManifestRow[] {
  const file = manifestPath(root);
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8")) as ManifestRow[];
}

export function writeManifest(rows: ManifestRow[], root = process.cwd()): void {
  fs.writeFileSync(manifestPath(root), `${JSON.stringify(rows)}\n`);
}

export function upsertManifest(row: ManifestRow, root = process.cwd()): void {
  upsertManifestMany([row], root);
}

export function upsertManifestMany(
  incoming: ManifestRow[],
  root = process.cwd(),
): void {
  const rows = readManifest(root);
  const byId = new Map(rows.map((r) => [r.id, r]));
  for (const row of incoming) byId.set(row.id, row);
  writeManifest([...byId.values()], root);
}

export function rebuildManifestFromPublic(root = process.cwd()): ManifestRow[] {
  const dir = publicCatalogDir(root);
  if (!fs.existsSync(dir)) return [];
  const rows: ManifestRow[] = [];
  for (const name of fs.readdirSync(dir).sort()) {
    if (!name.endsWith(".json")) continue;
    const id = name.replace(/\.json$/, "");
    rows.push(entryFromDocument(id, readCatalogDocument(id, root)));
  }
  writeManifest(rows, root);
  return rows;
}

export function usedCatalogIds(root = process.cwd()): Set<string> {
  const ids = new Set(readManifest(root).map((r) => r.id));
  const dir = publicCatalogDir(root);
  if (!fs.existsSync(dir)) return ids;
  for (const name of fs.readdirSync(dir)) {
    if (name.endsWith(".json")) ids.add(name.replace(/\.json$/, ""));
  }
  return ids;
}

export function rememberOrigin(
  index: Map<string, string>,
  origin: SongOrigin,
  id: string,
): void {
  for (const key of originKeys(origin)) index.set(key, id);
}

export function findInOriginIndex(
  origin: SongOrigin,
  index: Map<string, string>,
): string | undefined {
  return originKeys(origin).map((key) => index.get(key)).find(Boolean);
}

export function loadOriginIndex(root = process.cwd()): Map<string, string> {
  const map = new Map<string, string>();
  const knownIds = new Set<string>();
  for (const row of readManifest(root)) {
    if (!row.source) continue;
    rememberOrigin(map, row.source, row.id);
    knownIds.add(row.id);
  }
  const dir = publicCatalogDir(root);
  if (!fs.existsSync(dir)) return map;
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".json")) continue;
    const id = name.replace(/\.json$/, "");
    if (knownIds.has(id)) continue;
    try {
      const doc = readCatalogDocument(id, root);
      const origin = doc.meta.origin;
      if (!origin) continue;
      rememberOrigin(map, origin, id);
      knownIds.add(id);
    } catch {
      /* skip unreadable leftovers */
    }
  }
  return map;
}

export function findCatalogDuplicate(
  origin: SongOrigin,
  root = process.cwd(),
  index = loadOriginIndex(root),
): { id: string; title: string } | undefined {
  const id = findInOriginIndex(origin, index);
  if (!id) return undefined;
  const row = readManifest(root).find((r) => r.id === id);
  return { id, title: row?.title ?? id };
}
