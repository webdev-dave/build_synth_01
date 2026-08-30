import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/kamjensl-freilach.json";

const doc = document as SongDocument;

export const kamjenslFreilach: SongEntry = {
  id: "kamjensl-freilach",
  title: "Kamjensl Freilach",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "kamjensl freilach.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/kamjensl%20freilach.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
