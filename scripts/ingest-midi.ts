/**
 * Ingest one or more .mid files into the Piano Roll song library.
 *
 * Usage (from repo root, in an AI chat or a terminal):
 *
 *   npm run ingest-midi -- \
 *     --id tumbalalaika \
 *     --title Tumbalalaika \
 *     --subtitle "Yiddish folk · voice + piano" \
 *     --key "Ab minor" \
 *     --voice path/to/voice.mid \
 *     --chords path/to/piano.mid
 *
 *   npm run ingest-midi -- \
 *     --id song-slug \
 *     --title "Song Title" \
 *     --file path/to/arrangement.mid \
 *     --source-url "https://example.com/listing" \
 *     --source-file "original name.mid" \
 *     --source-file-url "https://example.com/original%20name.mid" \
 *     --collection "FreeSheetMusic.net · Klezmer Folktunes"
 *
 * Writes:
 *   public/midi/<id>/*.mid
 *   public/catalog/<id>.json       (compact document)
 * and appends a row to src/lib/songs/manifest.json
 */

import fs from "node:fs";
import path from "node:path";

import { ingestMidiFile, ingestMidiTracks } from "../src/lib/song/fromMidi.ts";
import { documentTotalBeats } from "../src/lib/song/stats.ts";
import type { SongOrigin, SongTrackRole } from "../src/lib/song/types.ts";
import {
  LABEL_SETS,
  findCatalogDuplicate,
  upsertManifest,
  usedCatalogIds,
  writeCatalogDocument,
} from "./lib/song-catalog.ts";

type Args = {
  id: string;
  title: string;
  subtitle?: string;
  artist?: string;
  key?: string;
  voice?: string;
  chords?: string;
  bass?: string;
  file?: string;
  labels?: string;
  "source-url"?: string;
  "source-file"?: string;
  "source-file-url"?: string;
  collection?: string;
  "source-note"?: string;
  "lyric-sheet"?: string;
  force?: string;
};

function parseArgs(argv: string[]): Args {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const val = argv[i + 1];
    if (key === "force") {
      out.force = val && !val.startsWith("--") ? val : "true";
      if (val && !val.startsWith("--")) i++;
      continue;
    }
    if (!val || val.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }
    out[key] = val;
    i++;
  }
  if (!out.id || !out.title) {
    throw new Error("Required: --id and --title");
  }
  if (!out.voice && !out.chords && !out.bass && !out.file) {
    throw new Error("Provide --file, or at least one of --voice --chords --bass");
  }
  return out as unknown as Args;
}

function slugId(id: string): string {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) {
    throw new Error(`--id must be a lowercase slug (got "${id}")`);
  }
  return id;
}

function labelsFromArgs(args: Args, id: string): string[] {
  if (
    args.labels === "blues" ||
    args.labels === "BLUES_LABELS" ||
    args.labels === "blues,"
  ) {
    return [...LABEL_SETS.BLUES_LABELS];
  }
  if (args.labels) {
    return args.labels
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (id.startsWith("yesterday")) return [...LABEL_SETS.YESTERDAY_LABELS];
  return [...LABEL_SETS.KLEZMER_LABELS];
}

function buildOrigin(args: Args): SongOrigin | undefined {
  const filePath = args.file ?? args.voice ?? args.chords ?? args.bass;
  const filename =
    args["source-file"] ?? (filePath ? path.basename(filePath) : undefined);
  const origin: SongOrigin = {
    url: args["source-url"],
    filename,
    fileUrl: args["source-file-url"],
    localPath: filePath ? path.resolve(filePath) : undefined,
    collection: args.collection,
    note: args["source-note"],
    ingestedAt: new Date().toISOString().slice(0, 10),
  };
  if (!origin.url && !origin.filename && !origin.fileUrl && !origin.localPath) {
    return undefined;
  }
  return origin;
}

const ROLE_FLAG: Record<string, SongTrackRole> = {
  voice: "melody",
  chords: "chords",
  bass: "bass",
};

function main() {
  const args = parseArgs(process.argv.slice(2));
  const id = slugId(args.id);
  const root = process.cwd();
  const midiDir = path.join(root, "public", "midi", id);
  if (usedCatalogIds(root).has(id) && args.force !== "true") {
    console.error(
      `Catalog id "${id}" already exists. Pass --force to overwrite the document.`,
    );
    process.exit(1);
  }
  const origin = buildOrigin(args);
  if (origin && args.force !== "true") {
    const dup = findCatalogDuplicate(origin, root);
    if (dup) {
      console.error(
        `Same source file already ingested as "${dup.title}" (${dup.id}). ` +
          `A second listing of the same .mid is not a new version. ` +
          `If this is a different arrangement, use a new --id, a distinct ` +
          `--source-file, and name the version in --title. Pass --force to override.`,
      );
      process.exit(1);
    }
  }

  fs.mkdirSync(midiDir, { recursive: true });

  const inputs: {
    bytes: Uint8Array;
    role: SongTrackRole;
    name: string;
    sourceFile: string;
  }[] = [];

  for (const flag of ["voice", "chords", "bass"] as const) {
    const src = args[flag];
    if (!src) continue;
    const abs = path.resolve(src);
    if (!fs.existsSync(abs)) throw new Error(`File not found: ${abs}`);
    const destName = `${flag}${path.extname(abs) || ".mid"}`;
    const dest = path.join(midiDir, destName);
    fs.copyFileSync(abs, dest);
    inputs.push({
      bytes: fs.readFileSync(dest),
      role: ROLE_FLAG[flag],
      name: flag === "voice" ? "Voice" : flag === "chords" ? "Piano" : "Bass",
      sourceFile: `public/midi/${id}/${destName}`,
    });
    console.log(`copied ${abs} → ${dest}`);
  }

  let fileSource: string | undefined;
  let fileBytes: Uint8Array | undefined;
  if (args.file) {
    const abs = path.resolve(args.file);
    if (!fs.existsSync(abs)) throw new Error(`File not found: ${abs}`);
    const destName = `arrangement${path.extname(abs) || ".mid"}`;
    const dest = path.join(midiDir, destName);
    fs.copyFileSync(abs, dest);
    fileBytes = fs.readFileSync(dest);
    fileSource = `public/midi/${id}/${destName}`;
    console.log(`copied ${abs} → ${dest}`);
  }

  const lyricSheet = args["lyric-sheet"]
    ? fs.readFileSync(path.resolve(args["lyric-sheet"]), "utf8")
    : undefined;
  const meta = {
    title: args.title,
    artist: args.artist,
    key: args.key,
    origin,
    lyricSheet,
  };
  const doc = fileBytes
    ? ingestMidiFile(fileBytes, meta, fileSource)
    : ingestMidiTracks(inputs, meta);

  const labels = labelsFromArgs(args, id);
  const row = writeCatalogDocument(id, doc, {
    subtitle: args.subtitle,
    labels,
  }, root);
  row.title = args.title;
  if (args.subtitle) row.subtitle = args.subtitle;
  upsertManifest(row, root);
  console.log(`wrote public/catalog/${id}.json`);
  console.log(
    `tracks: ${doc.tracks.map((t) => `${t.name} (${t.notes.length} notes)`).join(", ")}`,
  );
  console.log(
    `tempo ${doc.meta.tempo} · ${doc.meta.timeSignature.join("/")} · ${documentTotalBeats(doc)} beats`,
  );
  if (doc.lyrics?.length) {
    console.log(`lyrics: ${doc.lyrics.length} timed events`);
  }
  if (doc.lyricSheet) {
    console.log(`lyric sheet: ${doc.lyricSheet.length} chars`);
  }
  console.log(`registered ${id} in manifest.json`);

  console.log(`\nDone. Reload /piano-roll and pick "${args.title}" from Song.`);
}

main();
