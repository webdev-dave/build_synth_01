import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/la-belle-catherine.json";

const doc = document as SongDocument;

export const laBelleCatherine: SongEntry = {
  id: "la-belle-catherine",
  title: "la Belle Catherine",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "la belle catherine.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/la%20belle%20catherine.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
