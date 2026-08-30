import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/schwartzs-sirba.json";

const doc = document as SongDocument;

export const schwartzsSirba: SongEntry = {
  id: "schwartzs-sirba",
  title: "Schwartzs Sirba",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "schwartzs sirba.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/schwartzs%20sirba.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
