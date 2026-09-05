/**
 * One-shot: compact src/lib/songs/catalog/*.json into public/catalog,
 * write a picker manifest, drop the per-song TypeScript modules.
 *
 *   npm run migrate-catalog-offload
 */

import fs from "node:fs";
import path from "node:path";

import { expandDocument } from "../src/lib/song/compact.ts";
import type { SongDocument } from "../src/lib/song/types.ts";
import {
  LABEL_SETS,
  type ManifestRow,
  writeCatalogDocument,
  writeManifest,
} from "./lib/song-catalog.ts";

const KEEP_MODULES = new Set([
  "types.ts",
  "library.ts",
  "index.ts",
  "origin.ts",
  "yesterday.ts",
  "loadDocument.ts",
]);

const HANDWRITTEN = new Set(["yesterdayV1", "yesterdayV2"]);

type ParsedModule = {
  exportName: string;
  id: string;
  title: string;
  subtitle?: string;
  labels: string[];
  catalogId: string;
};

function parseQuoted(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as string;
  } catch {
    return raw.slice(1, -1);
  }
}

function parseLabels(token: string | undefined): string[] {
  if (!token) return [];
  if (LABEL_SETS[token]) return [...LABEL_SETS[token]];
  try {
    return JSON.parse(token) as string[];
  } catch {
    return [];
  }
}

function parseSongModule(text: string): ParsedModule | undefined {
  const exportName = text.match(/export const (\w+): SongEntry/)?.[1];
  const id = text.match(/\bid:\s*"([^"]+)"/)?.[1];
  const title = parseQuoted(text.match(/\btitle:\s*("(?:\\.|[^"\\])*")/)?.[1]);
  const subtitle = parseQuoted(
    text.match(/\bsubtitle:\s*("(?:\\.|[^"\\])*")/)?.[1],
  );
  const labels = parseLabels(
    text.match(
      /\blabels:\s*(YESTERDAY_LABELS|KLEZMER_LABELS|BLUES_LABELS|\[[^\]]*\])/,
    )?.[1],
  );
  const catalogId = text.match(/from "\.\/catalog\/([^"]+)\.json"/)?.[1];
  if (!exportName || !id || !title || !catalogId) return undefined;
  return { exportName, id, title, subtitle, labels, catalogId };
}

function songOrder(libraryText: string, byExport: Map<string, ParsedModule>): string[] {
  const block = libraryText.match(
    /export const SONGS: SongEntry\[\] = \[([\s\S]*?)\];/,
  )?.[1];
  if (!block) return [...byExport.values()].map((m) => m.exportName);
  return block
    .split(",")
    .map((s) => s.trim())
    .filter((name) => name && !HANDWRITTEN.has(name) && byExport.has(name));
}

function librarySource(): string {
  return `import type { TimeSignature } from "@/lib/music";
import { documentBars } from "@/lib/song/stats";

import type { SongEntry, SongId, SongManifestEntry } from "./types";
import { yesterdayV1, yesterdayV2 } from "./yesterday";
import manifestJson from "./manifest.json";

const MANIFEST = manifestJson as SongManifestEntry[];

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
`;
}

function indexSource(): string {
  return `export type { SongEntry, SongId, SongLabel, SongManifestEntry, SongOrigin } from "./types";
export { BLUES_LABELS, KLEZMER_LABELS, YESTERDAY_LABELS } from "./types";
export { findSameSource, normalizeSourceKey } from "./origin";
export {
  DEFAULT_SONG_ID,
  SONGS,
  getDefaultSong,
  getSong,
  searchSongs,
  songBars,
  songBeatsPerBar,
  songTimeSignature,
} from "./library";
export { catalogUrl, loadSongDocument, resolveSongEntry, songNeedsCatalog } from "./loadDocument";
export { yesterdayV1, yesterdayV2 } from "./yesterday";
`;
}

function main() {
  const root = process.cwd();
  const songsDir = path.join(root, "src", "lib", "songs");
  const oldCatalog = path.join(songsDir, "catalog");
  const libraryPath = path.join(songsDir, "library.ts");
  const indexPath = path.join(songsDir, "index.ts");

  if (!fs.existsSync(oldCatalog)) {
    console.error("No src/lib/songs/catalog — already migrated?");
    process.exit(1);
  }

  const byExport = new Map<string, ParsedModule>();
  for (const name of fs.readdirSync(songsDir)) {
    if (!name.endsWith(".ts") || KEEP_MODULES.has(name)) continue;
    const parsed = parseSongModule(
      fs.readFileSync(path.join(songsDir, name), "utf8"),
    );
    if (!parsed) {
      console.warn(`skip unreadable module ${name}`);
      continue;
    }
    byExport.set(parsed.exportName, parsed);
  }

  const order = songOrder(fs.readFileSync(libraryPath, "utf8"), byExport);
  const seen = new Set(order);
  for (const name of [...byExport.keys()].sort()) {
    if (!seen.has(name)) order.push(name);
  }

  const rows: ManifestRow[] = [];
  let notes = 0;
  for (const exportName of order) {
    const mod = byExport.get(exportName);
    if (!mod) continue;
    const jsonPath = path.join(oldCatalog, `${mod.catalogId}.json`);
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`Missing catalog JSON for ${mod.id} (${jsonPath})`);
    }
    const doc = expandDocument(
      JSON.parse(fs.readFileSync(jsonPath, "utf8")),
    ) as SongDocument;
    if (!doc.meta.title) doc.meta.title = mod.title;
    const row = writeCatalogDocument(mod.id, doc, {
      subtitle: mod.subtitle,
      labels: mod.labels,
    }, root);
    row.title = mod.title;
    if (mod.subtitle) row.subtitle = mod.subtitle;
    rows.push(row);
    notes += doc.tracks.reduce((n, t) => n + t.notes.length, 0);
  }

  writeManifest(rows, root);
  fs.writeFileSync(libraryPath, librarySource());
  fs.writeFileSync(indexPath, `${indexSource()}\n`);

  let removedModules = 0;
  for (const name of fs.readdirSync(songsDir)) {
    if (!name.endsWith(".ts") || KEEP_MODULES.has(name)) continue;
    fs.unlinkSync(path.join(songsDir, name));
    removedModules += 1;
  }
  fs.rmSync(oldCatalog, { recursive: true, force: true });

  console.log(
    `migrated ${rows.length} songs · ${notes} notes · removed ${removedModules} modules`,
  );
  console.log(`wrote public/catalog/ and src/lib/songs/manifest.json`);
}

main();
