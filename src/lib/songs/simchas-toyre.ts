import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/simchas-toyre.json";

const doc = document as SongDocument;

export const simchasToyre: SongEntry = {
  id: "simchas-toyre",
  title: "Simchas Toyre",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "simchas toyre.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/simchas%20toyre.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
