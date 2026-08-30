import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/di-goldene-chasene.json";

const doc = document as SongDocument;

export const diGoldeneChasene: SongEntry = {
  id: "di-goldene-chasene",
  title: "di Goldene Chasene",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "di goldene chasene.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/di%20goldene%20chasene.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
