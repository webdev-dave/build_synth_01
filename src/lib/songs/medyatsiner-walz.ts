import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/medyatsiner-walz.json";

const doc = document as SongDocument;

export const medyatsinerWalz: SongEntry = {
  id: "medyatsiner-walz",
  title: "Medyatsiner Walz",
  subtitle: "Klezmer folktune · 3/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "medyatsiner walz.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/medyatsiner%20walz.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
