import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/braneles-chasene.json";

const doc = document as SongDocument;

export const branelesChasene: SongEntry = {
  id: "braneles-chasene",
  title: "Braneles Chasene",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "braneles chasene.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/braneles%20chasene.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
