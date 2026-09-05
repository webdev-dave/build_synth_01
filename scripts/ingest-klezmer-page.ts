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
import {
  LABEL_SETS,
  type ManifestRow,
  findInOriginIndex,
  loadOriginIndex,
  rememberOrigin,
  upsertManifestMany,
  usedCatalogIds,
  writeCatalogDocument,
} from "./lib/song-catalog.ts";

const PAGE_URL = "https://www.freesheetmusic.net/music/worldfolk/klezmer.html";
const COLLECTION = "FreeSheetMusic.net · Klezmer Folktunes";
const ORIGIN = "https://www.freesheetmusic.net";

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

async function main() {
  const root = process.cwd();
  const existing = loadOriginIndex(root);
  const usedIds = usedCatalogIds(root);

  console.log(`fetch ${PAGE_URL}`);
  const pageRes = await fetch(PAGE_URL);
  if (!pageRes.ok) throw new Error(`Could not load listing: ${pageRes.status}`);
  const listings = parseListings(await pageRes.text());
  console.log(`unique MIDI files on page: ${listings.length}`);

  const addedRows: ManifestRow[] = [];
  let skipped = 0;
  let failed = 0;
  const today = new Date().toISOString().slice(0, 10);
  const labels = [...LABEL_SETS.KLEZMER_LABELS];

  for (const item of listings) {
    const already = findInOriginIndex(
      { filename: item.filename, fileUrl: item.fileUrl },
      existing,
    );
    if (already) {
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
      const doc = ingestMidiFile(
        bytes,
        { title, origin },
        `public/midi/${id}/arrangement.mid`,
      );
      const meter = doc.meta.timeSignature.join("/");
      const subtitle = `Klezmer folktune · ${meter} · ${COLLECTION}`;

      const midiDir = path.join(root, "public", "midi", id);
      fs.mkdirSync(midiDir, { recursive: true });
      fs.writeFileSync(path.join(midiDir, "arrangement.mid"), bytes);
      const row = writeCatalogDocument(id, doc, { subtitle, labels }, root);
      row.title = title;
      row.subtitle = subtitle;
      addedRows.push(row);
      usedIds.add(id);
      rememberOrigin(existing, origin, id);
      console.log(
        `ok   ${id} · ${doc.tracks.length} tracks · ${doc.meta.tempo} · ${meter} · ${documentTotalBeats(doc)} beats`,
      );
    } catch (err) {
      failed += 1;
      console.error(`fail ${item.filename}: ${(err as Error).message}`);
    }
  }

  if (addedRows.length) upsertManifestMany(addedRows, root);

  console.log(
    `\nDone. listed ${listings.length} unique · skipped ${skipped} · failed ${failed} · added ${addedRows.length}`,
  );
}

main();
