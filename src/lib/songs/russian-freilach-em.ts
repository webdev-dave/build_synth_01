import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/russian-freilach-em.json";

const doc = document as SongDocument;

export const russianFreilachEm: SongEntry = {
  id: "russian-freilach-em",
  title: "Russian Freilach Em",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "russian freilach em.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/russian%20freilach%20em.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
