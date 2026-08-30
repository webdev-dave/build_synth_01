import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/bei-mir-bistu-shein.json";

const doc = document as SongDocument;

export const beiMirBistuShein: SongEntry = {
  id: "bei-mir-bistu-shein",
  title: "Bei Mir Bistu Shein",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "bei mir bistu shein.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/bei%20mir%20bistu%20shein.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
