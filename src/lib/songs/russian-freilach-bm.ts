import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/russian-freilach-bm.json";

const doc = document as SongDocument;

export const russianFreilachBm: SongEntry = {
  id: "russian-freilach-bm",
  title: "Russian Freilach Bm",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "russian freilach bm.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/russian%20freilach%20bm.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
