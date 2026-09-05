/**
 * Ingest unique .mid / .kar files from an HTML listing.
 * Same origin.filename / fileUrl already in catalog → skip.
 *
 *   npm run ingest-listing-page -- --preset blues
 *   npm run ingest-listing-page -- --preset midkar-old
 *   npm run ingest-listing-page -- --preset midkar-chicago
 *   npm run ingest-listing-page -- --preset pdmusic-blues
 */

import fs from "node:fs";
import path from "node:path";

import { ingestMidiFile } from "../src/lib/song/fromMidi.ts";
import { documentTotalBeats } from "../src/lib/song/stats.ts";
import type { SongOrigin } from "../src/lib/song/types.ts";
import {
  LABEL_SETS,
  type ManifestRow,
  findInOriginIndex,
  loadOriginIndex,
  rebuildManifestFromPublic,
  rememberOrigin,
  upsertManifestMany,
  usedCatalogIds,
  writeCatalogDocument,
} from "./lib/song-catalog.ts";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

type LabelsConst = "BLUES_LABELS" | "KLEZMER_LABELS";

type PageSpec = {
  id: string;
  pageUrl: string;
  collection: string;
  subtitlePrefix: string;
  labels: LabelsConst;
  lyricSheet: boolean;
};

const PRESETS: Record<string, PageSpec[]> = {
  "midkar-old": [
    {
      id: "midkar-old",
      pageUrl: "https://midkar.com/Blues/Blues_MIDIs.html",
      collection: "MidKar · Blues MIDI (old page)",
      subtitlePrefix: "MidKar old blues page",
      labels: "BLUES_LABELS",
      lyricSheet: false,
    },
  ],
  "midkar-chicago": [
    {
      id: "midkar-chicago",
      pageUrl: "https://midkar.com/Blues/Chicago/Chicago.html",
      collection: "MidKar · Wayne's Blues Venue (Chicago / Delta / Texas)",
      subtitlePrefix: "Wayne's Blues Venue",
      labels: "BLUES_LABELS",
      lyricSheet: false,
    },
  ],
  "pdmusic-blues": [
    {
      id: "pdmusic-blues",
      pageUrl: "https://dirkncl.github.io/pdmusic_org/blues.html",
      collection: "pdmusic.org · Blues (1850–1923)",
      subtitlePrefix: "pdmusic.org",
      labels: "BLUES_LABELS",
      lyricSheet: true,
    },
  ],
};

PRESETS.blues = [
  ...PRESETS["midkar-old"],
  ...PRESETS["midkar-chicago"],
  ...PRESETS["pdmusic-blues"],
];

type Listing = {
  filename: string;
  fileUrl: string;
  title?: string;
};

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

function slugFromFilename(filename: string): string {
  const stem = filename.replace(/\.(mid|kar)$/i, "");
  const slug = stem
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    throw new Error(`Could not slugify "${filename}" → "${slug}"`);
  }
  return slug;
}

function titleFromFilename(filename: string): string {
  return filename
    .replace(/\.(mid|kar)$/i, "")
    .replace(/[_]+/g, " ")
    .split(/\s+/)
    .map((word) => {
      if (word === "&") return "&";
      if (/^[a-z]{1,2}$/i.test(word) && !/^(a|an|am|bm|dm|eb|em|v)$/i.test(word)) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function fileUrlFromHref(href: string, pageUrl: string): string {
  const decoded = decodeEntities(href).replace(/^\.\//, "");
  if (/^https?:\/\//i.test(decoded)) return decoded;
  const base = pageUrl.replace(/[^/]*$/, "");
  return (
    base +
    decoded
      .split("/")
      .map((part) => encodeURIComponent(part))
      .join("/")
  );
}

function parseListings(html: string, pageUrl: string): Listing[] {
  const seen = new Set<string>();
  const out: Listing[] = [];
  const re = /href="([^"]+\.(?:mid|kar))"/gi;
  for (const match of html.matchAll(re)) {
    const href = decodeEntities(match[1]);
    if (/^https?:\/\//i.test(href) && !href.includes(".mid") && !href.includes(".kar")) {
      continue;
    }
    const filename = decodeEntities(path.posix.basename(href.split("?")[0]));
    if (!/\.(mid|kar)$/i.test(filename)) continue;
    const fileUrl = fileUrlFromHref(href, pageUrl);
    const key = `url:${normKey(fileUrl)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ filename, fileUrl });
  }
  return out;
}

function pdmusicTitles(html: string): Map<string, string> {
  const map = new Map<string, string>();
  const row =
    /<td>([^<]+)<\/td>[\s\S]*?href="(blues\/[^"]+\.mid)"/gi;
  for (const match of html.matchAll(row)) {
    map.set(normKey(path.posix.basename(match[2])), decodeEntities(match[1]).trim());
  }
  return map;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,*/*" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function downloadMidi(url: string): Promise<Uint8Array> {
  let lastErr: Error | undefined;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "*/*" },
      });
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
    } catch (err) {
      lastErr = err as Error;
      await new Promise((r) => setTimeout(r, 400 * attempt));
    }
  }
  throw lastErr ?? new Error(`download failed: ${url}`);
}

async function downloadText(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return undefined;
    const text = await res.text();
    if (text.includes("<html") || text.length < 20) return undefined;
    return text;
  } catch {
    return undefined;
  }
}

async function ingestPage(
  spec: PageSpec,
  root: string,
  existing: Map<string, string>,
  usedIds: Set<string>,
): Promise<{
  listed: number;
  skipped: number;
  failed: number;
  added: number;
  rows: ManifestRow[];
}> {
  console.log(`\n== ${spec.collection} ==`);
  console.log(`fetch ${spec.pageUrl}`);
  const html = await fetchText(spec.pageUrl);
  const listings = parseListings(html, spec.pageUrl);
  const titles = spec.lyricSheet ? pdmusicTitles(html) : new Map<string, string>();
  console.log(`unique MIDI/KAR files on page: ${listings.length}`);

  let skipped = 0;
  let failed = 0;
  let added = 0;
  const rows: ManifestRow[] = [];
  const today = new Date().toISOString().slice(0, 10);
  const labels = [...LABEL_SETS[spec.labels]];

  for (const item of listings) {
    const already = findInOriginIndex(
      { filename: item.filename, fileUrl: item.fileUrl },
      existing,
    );
    if (already) {
      skipped += 1;
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
      const bytes = await downloadMidi(item.fileUrl);
      const origin: SongOrigin = {
        url: spec.pageUrl,
        filename: item.filename,
        fileUrl: item.fileUrl,
        collection: spec.collection,
        ingestedAt: today,
      };
      const title =
        titles.get(normKey(item.filename)) ?? titleFromFilename(item.filename);
      let lyricSheet: string | undefined;
      if (spec.lyricSheet) {
        lyricSheet = await downloadText(item.fileUrl.replace(/\.mid$/i, ".txt"));
      }
      const doc = ingestMidiFile(
        bytes,
        { title, origin, lyricSheet },
        `public/midi/${id}/arrangement.mid`,
      );
      const meter = doc.meta.timeSignature.join("/");
      const lyricNote = doc.lyrics?.length
        ? ` · ${doc.lyrics.length} lyrics`
        : doc.lyricSheet
          ? " · lyric sheet"
          : "";
      const subtitle = `${spec.subtitlePrefix} · ${meter} · ${spec.collection}`;

      const midiDir = path.join(root, "public", "midi", id);
      fs.mkdirSync(midiDir, { recursive: true });
      fs.writeFileSync(path.join(midiDir, "arrangement.mid"), bytes);
      const row = writeCatalogDocument(id, doc, { subtitle, labels }, root);
      row.title = title;
      row.subtitle = subtitle;
      rows.push(row);
      usedIds.add(id);
      rememberOrigin(existing, origin, id);
      added += 1;
      console.log(
        `ok   ${id} · ${doc.tracks.length} tracks · ${doc.meta.tempo} · ${meter} · ${documentTotalBeats(doc)} beats${lyricNote}`,
      );
    } catch (err) {
      failed += 1;
      console.error(`fail ${item.filename}: ${(err as Error).message}`);
    }
  }

  return { listed: listings.length, skipped, failed, added, rows };
}

function parsePreset(argv: string[]): string {
  const i = argv.indexOf("--preset");
  const preset = i >= 0 ? argv[i + 1] : "blues";
  if (!preset || !PRESETS[preset]) {
    throw new Error(
      `Unknown --preset "${preset}". Use: ${Object.keys(PRESETS).join(", ")}`,
    );
  }
  return preset;
}

async function main() {
  if (process.argv.includes("--rewrite-only")) {
    const rows = rebuildManifestFromPublic();
    console.log(`Rebuilt manifest from public/catalog (${rows.length} songs).`);
    return;
  }
  const preset = parsePreset(process.argv.slice(2));
  const pages = PRESETS[preset];
  const root = process.cwd();

  const existing = loadOriginIndex(root);
  const usedIds = usedCatalogIds(root);
  const addedRows: ManifestRow[] = [];

  const totals = { listed: 0, skipped: 0, failed: 0, added: 0 };
  for (const spec of pages) {
    const result = await ingestPage(spec, root, existing, usedIds);
    totals.listed += result.listed;
    totals.skipped += result.skipped;
    totals.failed += result.failed;
    totals.added += result.added;
    addedRows.push(...result.rows);
  }

  if (addedRows.length) upsertManifestMany(addedRows, root);
  console.log(
    `\nDone. listed ${totals.listed} · added ${totals.added} · skipped ${totals.skipped} · failed ${totals.failed}`,
  );
}

main();
