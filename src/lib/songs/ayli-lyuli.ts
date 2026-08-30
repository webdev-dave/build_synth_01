import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/ayli-lyuli.json";

const doc = document as SongDocument;

export const ayliLyuli: SongEntry = {
  id: "ayli-lyuli",
  title: "Ayli Lyuli",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "ayli lyuli.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/ayli%20lyuli.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
