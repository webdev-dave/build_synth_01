/**
 * Ingest unique .mid files from the FreeSheetMusic.net klezmer listing.
 * Same filename/URL already in catalog → skip. Different file, same title →
 * keep both and name from the original filename.
 *
 *   npm run ingest-klezmer-page
 */

import fs from "node:fs";
import path from "node:path";

import { ingestMidiFile } from "../src/lib/song/fromMidi.ts";
import { documentTotalBeats } from "../src/lib/song/stats.ts";
import type { SongOrigin } from "../src/lib/song/types.ts";

const PAGE_URL = "https://www.freesheetmusic.net/music/worldfolk/klezmer.html";
const COLLECTION = "FreeSheetMusic.net · Klezmer Folktunes";
const ORIGIN = "https://www.freesheetmusic.net";

const HEAD_EXPORTS = [
  { exportName: "yesterdayV2", module: "./yesterday" },
  { exportName: "yesterdayV1", module: "./yesterday" },
  { exportName: "yesterdayBeatles", module: "./yesterday-beatles" },
  { exportName: "beiMirBistDuSchon", module: "./bei-mir-bist-du-schon" },
  { exportName: "tumbalalaika", module: "./tumbalalaika" },
  { exportName: "tumbalalaikaPanamarjov", module: "./tumbalalaika-panamarjov" },
] as const;

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
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

function originKeys(origin: SongOrigin): string[] {
  const keys: string[] = [];
  if (origin.filename) keys.push(`file:${normKey(origin.filename)}`);
  if (origin.fileUrl) keys.push(`url:${normKey(origin.fileUrl)}`);
  return keys;
}

function slugFromFilename(filename: string): string {
  const stem = filename.replace(/\.mid$/i, "");
  const slug = stem
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    throw new Error(`Could not slugify "${filename}" → "${slug}"`);
  }
  return slug;
}

function camel(id: string): string {
  return id.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

function titleFromFilename(filename: string): string {
  return filename
    .replace(/\.mid$/i, "")
    .split(/\s+/)
    .map((word) => {
      if (word === "&") return "&";
      if (/^[a-z]{1,2}$/i.test(word) && !/^(a|an|am|bm|dm|em|v)$/i.test(word)) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function loadCatalogOrigins(catalogDir: string): Map<string, string> {
  const map = new Map<string, string>();
  if (!fs.existsSync(catalogDir)) return map;
  for (const name of fs.readdirSync(catalogDir)) {
    if (!name.endsWith(".json")) continue;
    const raw = JSON.parse(fs.readFileSync(path.join(catalogDir, name), "utf8")) as {
      meta?: { title?: string; origin?: SongOrigin };
    };
    const origin = raw.meta?.origin;
    if (!origin) continue;
    const id = name.replace(/\.json$/, "");
    for (const key of originKeys(origin)) map.set(key, id);
  }
  return map;
}

type Listing = {
  filename: string;
  href: string;
  fileUrl: string;
};

function parseListings(html: string): Listing[] {
  const seen = new Set<string>();
  const out: Listing[] = [];
  const re = /href="(\/music\/worldfolk\/klezmer\/[^"]+\.mid)"/gi;
  for (const match of html.matchAll(re)) {
    const href = decodeEntities(match[1]);
    const filename = decodeEntities(path.posix.basename(href));
    const key = normKey(filename);
    if (seen.has(key)) continue;
    seen.add(key);
    const encoded = href
      .split("/")
      .map((part) => encodeURIComponent(decodeEntities(part)))
      .join("/");
    out.push({
      filename,
      href,
      fileUrl: `${ORIGIN}${encoded.replace(/%2F/g, "/")}`,
    });
  }
  return out;
}

async function download(url: string): Promise<Uint8Array> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = new Uint8Array(await res.arrayBuffer());
  if (
    buf.length < 8 ||
    buf[0] !== 0x4d ||
    buf[1] !== 0x54 ||
    buf[2] !== 0x68 ||
    buf[3] !== 0x64
  ) {
    throw new Error(`Not a MIDI file: ${url} (${buf.length} bytes)`);
  }
  return buf;
}

function writeModule(opts: {
  id: string;
  title: string;
  subtitle: string;
  origin: SongOrigin;
  modulePath: string;
}): void {
  const exportName = camel(opts.id);
  const source = JSON.stringify(opts.origin, null, 2).replace(/\n/g, "\n  ");
  fs.writeFileSync(
    opts.modulePath,
    `import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/${opts.id}.json";

const doc = document as SongDocument;

export const ${exportName}: SongEntry = {
  id: "${opts.id}",
  title: ${JSON.stringify(opts.title)},
  subtitle: ${JSON.stringify(opts.subtitle)},
  labels: KLEZMER_LABELS,
  source: ${source},
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
`,
  );
}

function rewriteLibrary(
  libraryPath: string,
  indexPath: string,
  klezmer: { id: string; exportName: string }[],
): void {
  const imports = [
    `import { yesterdayV1, yesterdayV2 } from "./yesterday";`,
    ...HEAD_EXPORTS.filter((e) => e.module !== "./yesterday").map(
      (e) => `import { ${e.exportName} } from "${e.module}";`,
    ),
    ...klezmer.map((e) => `import { ${e.exportName} } from "./${e.id}";`),
  ];
  const songs = [
    ...HEAD_EXPORTS.map((e) => e.exportName),
    ...klezmer.map((e) => e.exportName),
  ];

  const library = fs.readFileSync(libraryPath, "utf8");
  const restStart = library.indexOf("export function getSong");
  if (restStart < 0) throw new Error("library.ts: could not find getSong");
  const header = `import type { TimeSignature } from "@/lib/music";
import { documentTotalBeats } from "@/lib/song/stats";

import type { SongEntry, SongId } from "./types";
${imports.join("\n")}

/** Piano Roll default — the draft we’re honing, not the live hero. */
export const DEFAULT_SONG_ID: SongId = "yesterday-v2";

/**
 * Append new tunes here. Order is display order; search is independent.
 */
export const SONGS: SongEntry[] = [
  ${songs.join(",\n  ")},
];

`;
  fs.writeFileSync(libraryPath, header + library.slice(restStart));

  const indexHeader = `export type { SongEntry, SongId, SongLabel, SongOrigin } from "./types";
export { KLEZMER_LABELS, YESTERDAY_LABELS } from "./types";
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
export { yesterdayV1, yesterdayV2 } from "./yesterday";
${klezmer
  .concat(
    HEAD_EXPORTS.filter((e) => e.module !== "./yesterday").map((e) => ({
      id: e.module.replace("./", ""),
      exportName: e.exportName,
    })),
  )
  .filter(
    (e, i, all) => all.findIndex((x) => x.exportName === e.exportName) === i,
  )
  .map((e) => `export { ${e.exportName} } from "./${e.id}";`)
  .join("\n")}
`;
  fs.writeFileSync(indexPath, `${indexHeader}\n`);
}

async function main() {
  const root = process.cwd();
  const catalogDir = path.join(root, "src", "lib", "songs", "catalog");
  const songsDir = path.join(root, "src", "lib", "songs");
  fs.mkdirSync(catalogDir, { recursive: true });

  console.log(`fetch ${PAGE_URL}`);
  const pageRes = await fetch(PAGE_URL);
  if (!pageRes.ok) throw new Error(`Could not load listing: ${pageRes.status}`);
  const listings = parseListings(await pageRes.text());
  console.log(`unique MIDI files on page: ${listings.length}`);

  const existing = loadCatalogOrigins(catalogDir);
  const usedIds = new Set(
    fs
      .readdirSync(catalogDir)
      .filter((n) => n.endsWith(".json"))
      .map((n) => n.replace(/\.json$/, "")),
  );

  const ingested: { id: string; exportName: string }[] = [];
  let skipped = 0;
  let failed = 0;
  const today = new Date().toISOString().slice(0, 10);

  for (const item of listings) {
    const keys = originKeys({
      filename: item.filename,
      fileUrl: item.fileUrl,
    });
    const already = keys.map((k) => existing.get(k)).find(Boolean);
    if (already) {
      ingested.push({ id: already, exportName: camel(already) });
      skipped += 1;
      console.log(`skip ${item.filename} (already ${already})`);
      continue;
    }

    let id = slugFromFilename(item.filename);
    if (usedIds.has(id)) {
      let n = 2;
      while (usedIds.has(`${id}-${n}`)) n += 1;
      id = `${id}-${n}`;
    }

    try {
      console.log(`get  ${item.filename}`);
      const bytes = await download(item.fileUrl);
      const origin: SongOrigin = {
        url: PAGE_URL,
        filename: item.filename,
        fileUrl: item.fileUrl,
        collection: COLLECTION,
        ingestedAt: today,
      };
      const title = titleFromFilename(item.filename);
      const doc = ingestMidiFile(bytes, { title, origin }, `public/midi/${id}/arrangement.mid`);
      const meter = doc.meta.timeSignature.join("/");
      const subtitle = `Klezmer folktune · ${meter} · ${COLLECTION}`;

      const midiDir = path.join(root, "public", "midi", id);
      fs.mkdirSync(midiDir, { recursive: true });
      fs.writeFileSync(path.join(midiDir, "arrangement.mid"), bytes);
      fs.writeFileSync(
        path.join(catalogDir, `${id}.json`),
        JSON.stringify(doc, null, 2) + "\n",
      );
      writeModule({
        id,
        title,
        subtitle,
        origin,
        modulePath: path.join(songsDir, `${id}.ts`),
      });
      usedIds.add(id);
      for (const key of originKeys(origin)) existing.set(key, id);
      ingested.push({ id, exportName: camel(id) });
      console.log(
        `ok   ${id} · ${doc.tracks.length} tracks · ${doc.meta.tempo} · ${meter} · ${documentTotalBeats(doc)} beats`,
      );
    } catch (err) {
      failed += 1;
      console.error(`fail ${item.filename}: ${(err as Error).message}`);
    }
  }

  const seenExport = new Set<string>();
  const uniqueKlezmer = ingested.filter((e) => {
    if (seenExport.has(e.exportName)) return false;
    seenExport.add(e.exportName);
    return true;
  });

  rewriteLibrary(
    path.join(songsDir, "library.ts"),
    path.join(songsDir, "index.ts"),
    uniqueKlezmer,
  );

  console.log(
    `\nDone. listed ${listings.length} unique · skipped ${skipped} · failed ${failed} · catalog now ${uniqueKlezmer.length} klezmer-page songs`,
  );
}

main();
