import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/epstein-bulgar-v.json";

const doc = document as SongDocument;

export const epsteinBulgarV: SongEntry = {
  id: "epstein-bulgar-v",
  title: "Epstein Bulgar V",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "epstein bulgar v.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/epstein%20bulgar%20v.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
