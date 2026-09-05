import type {
  SongDocument,
  SongLyric,
  SongNote,
  SongTrack,
} from "./types";

/** On-disk catalog format. Notes are tuples so 800 files stay small. */
export const CATALOG_FORMAT = 1 as const;

export type CompactNote = [
  midi: number,
  startBeats: number,
  durationBeats: number,
  velocity: number,
];

export type CompactLyric = [startBeats: number, text: string];

export type CompactTrack = {
  id: string;
  name: string;
  role: SongTrack["role"];
  notes: CompactNote[];
};

export type CompactDocument = {
  v: typeof CATALOG_FORMAT;
  meta: SongDocument["meta"];
  tracks: CompactTrack[];
  lyrics?: CompactLyric[];
  lyricSheet?: string;
};

function compactNote(n: SongNote): CompactNote {
  return [n.midi, n.startBeats, n.durationBeats, n.velocity];
}

function expandNote(n: CompactNote | SongNote): SongNote {
  if (Array.isArray(n)) {
    return {
      midi: n[0],
      startBeats: n[1],
      durationBeats: n[2],
      velocity: n[3],
    };
  }
  return n;
}

function compactLyric(l: SongLyric): CompactLyric {
  return [l.startBeats, l.text];
}

function expandLyric(l: CompactLyric | SongLyric): SongLyric {
  if (Array.isArray(l)) {
    return { startBeats: l[0], text: l[1] };
  }
  return l;
}

export function compactDocument(doc: SongDocument): CompactDocument {
  const compact: CompactDocument = {
    v: CATALOG_FORMAT,
    meta: doc.meta,
    tracks: doc.tracks.map((track) => ({
      id: track.id,
      name: track.name,
      role: track.role,
      notes: track.notes.map(compactNote),
    })),
  };
  if (doc.lyrics?.length) compact.lyrics = doc.lyrics.map(compactLyric);
  if (doc.lyricSheet) compact.lyricSheet = doc.lyricSheet;
  return compact;
}

function isLegacyDocument(raw: unknown): raw is SongDocument {
  if (!raw || typeof raw !== "object") return false;
  const tracks = (raw as SongDocument).tracks;
  if (!Array.isArray(tracks) || tracks.length === 0) {
    return "meta" in raw && "tracks" in raw && !("v" in raw);
  }
  const first = tracks[0]?.notes?.[0];
  return Boolean(first && !Array.isArray(first) && typeof first === "object");
}

/** Accept compact v1 or the old pretty-printed SongDocument. */
export function expandDocument(raw: unknown): SongDocument {
  if (!raw || typeof raw !== "object") {
    throw new Error("Catalog document is not an object");
  }
  if (isLegacyDocument(raw)) return raw;

  const compact = raw as CompactDocument;
  if (!compact.meta || !Array.isArray(compact.tracks)) {
    throw new Error("Catalog document is missing meta/tracks");
  }

  const doc: SongDocument = {
    meta: compact.meta,
    tracks: compact.tracks.map((track) => ({
      id: track.id,
      name: track.name,
      role: track.role,
      notes: (track.notes ?? []).map(expandNote),
    })),
  };
  if (compact.lyrics?.length) doc.lyrics = compact.lyrics.map(expandLyric);
  if (compact.lyricSheet) doc.lyricSheet = compact.lyricSheet;
  return doc;
}
