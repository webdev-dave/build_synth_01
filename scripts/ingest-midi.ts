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
 *   src/lib/songs/catalog/<id>.json
 *   src/lib/songs/<id>.ts          (if missing)
 * and registers the song in src/lib/songs/library.ts
 */

import fs from "node:fs";
import path from "node:path";

import { ingestMidiFile, ingestMidiTracks } from "../src/lib/song/fromMidi.ts";
import { documentTotalBeats } from "../src/lib/song/stats.ts";
import type { SongOrigin, SongTrackRole } from "../src/lib/song/types.ts";

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

function camel(id: string): string {
  return id.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
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

function findCatalogDuplicate(
  catalogDir: string,
  origin: SongOrigin,
): { id: string; title: string } | undefined {
  const incoming = new Set(originKeys(origin));
  if (incoming.size === 0 || !fs.existsSync(catalogDir)) return undefined;
  for (const name of fs.readdirSync(catalogDir)) {
    if (!name.endsWith(".json")) continue;
    const raw = JSON.parse(fs.readFileSync(path.join(catalogDir, name), "utf8")) as {
      meta?: { title?: string; origin?: SongOrigin };
    };
    const existing = raw.meta?.origin;
    if (!existing) continue;
    if (originKeys(existing).some((key) => incoming.has(key))) {
      return {
        id: name.replace(/\.json$/, ""),
        title: raw.meta?.title ?? name,
      };
    }
  }
  return undefined;
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
  const catalogDir = path.join(root, "src", "lib", "songs", "catalog");
  const catalogPath = path.join(catalogDir, `${id}.json`);
  const modulePath = path.join(root, "src", "lib", "songs", `${id}.ts`);
  const libraryPath = path.join(root, "src", "lib", "songs", "library.ts");
  const indexPath = path.join(root, "src", "lib", "songs", "index.ts");
  const origin = buildOrigin(args);
  if (origin && args.force !== "true") {
    const dup = findCatalogDuplicate(catalogDir, origin);
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
  fs.mkdirSync(path.dirname(catalogPath), { recursive: true });

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

  const meta = {
    title: args.title,
    artist: args.artist,
    key: args.key,
    origin,
  };
  const doc = fileBytes
    ? ingestMidiFile(fileBytes, meta, fileSource)
    : ingestMidiTracks(inputs, meta);

  fs.writeFileSync(catalogPath, JSON.stringify(doc, null, 2) + "\n");
  console.log(`wrote ${catalogPath}`);
  console.log(
    `tracks: ${doc.tracks.map((t) => `${t.name} (${t.notes.length} notes)`).join(", ")}`,
  );
  console.log(
    `tempo ${doc.meta.tempo} · ${doc.meta.timeSignature.join("/")} · ${documentTotalBeats(doc)} beats`,
  );

  const exportName = camel(id);
  if (!fs.existsSync(modulePath)) {
    const subtitle = args.subtitle
      ? `\n  subtitle: ${JSON.stringify(args.subtitle)},`
      : "";
    const isYesterday = id.startsWith("yesterday");
    const labelsExpr = args.labels
      ? JSON.stringify(
          args.labels
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        )
      : isYesterday
        ? "YESTERDAY_LABELS"
        : "KLEZMER_LABELS";
    const labelsImport = args.labels
      ? "import type { SongEntry } from \"./types\";"
      : `import { ${isYesterday ? "YESTERDAY_LABELS" : "KLEZMER_LABELS"}, type SongEntry } from "./types";`;
    const sourceField = origin
      ? `\n  source: ${JSON.stringify(origin, null, 2).replace(/\n/g, "\n  ")},`
      : "";
    fs.writeFileSync(
      modulePath,
      `import type { SongDocument } from "@/lib/song";
${labelsImport}
import document from "./catalog/${id}.json";

const doc = document as SongDocument;

export const ${exportName}: SongEntry = {
  id: "${id}",
  title: ${JSON.stringify(args.title)},${subtitle}
  labels: ${labelsExpr},${sourceField}
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
`,
    );
    console.log(`wrote ${modulePath}`);
  } else {
    console.log(`kept existing ${modulePath}`);
  }

  let library = fs.readFileSync(libraryPath, "utf8");
  if (!library.includes(exportName)) {
    library = library.replace(
      /^(import \{[^}]+\} from "\.\/yesterday";)/m,
      `$1\nimport { ${exportName} } from "./${id}";`,
    );
    library = library.replace(
      /(export const SONGS: SongEntry\[\] = \[)([^\]]*)(\];)/,
      `$1${exportName}, $2$3`,
    );
    fs.writeFileSync(libraryPath, library);
    console.log(`registered ${exportName} in library.ts`);
  }

  let index = fs.readFileSync(indexPath, "utf8");
  if (!index.includes(exportName)) {
    index = index.replace(
      /(export \{ yesterdayV1, yesterdayV2 \} from "\.\/yesterday";)/,
      `$1\nexport { ${exportName} } from "./${id}";`,
    );
    fs.writeFileSync(indexPath, index);
    console.log(`exported ${exportName} from songs/index.ts`);
  }

  console.log(`\nDone. Reload /piano-roll and pick "${args.title}" from Song.`);
}

main();
