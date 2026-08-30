import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/mekhuteneste-mayne.json";

const doc = document as SongDocument;

export const mekhutenesteMayne: SongEntry = {
  id: "mekhuteneste-mayne",
  title: "Mekhuteneste Mayne",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "mekhuteneste mayne.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/mekhuteneste%20mayne.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
