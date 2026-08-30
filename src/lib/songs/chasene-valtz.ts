import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/chasene-valtz.json";

const doc = document as SongDocument;

export const chaseneValtz: SongEntry = {
  id: "chasene-valtz",
  title: "Chasene Valtz",
  subtitle: "Klezmer folktune · 3/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "chasene valtz.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/chasene%20valtz.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
