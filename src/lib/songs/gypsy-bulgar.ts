import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/gypsy-bulgar.json";

const doc = document as SongDocument;

export const gypsyBulgar: SongEntry = {
  id: "gypsy-bulgar",
  title: "Gypsy Bulgar",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "gypsy bulgar.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/gypsy%20bulgar.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
