import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/di-grine-kusine.json";

const doc = document as SongDocument;

export const diGrineKusine: SongEntry = {
  id: "di-grine-kusine",
  title: "di Grine Kusine",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "di grine kusine.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/di%20grine%20kusine.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
