import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/bobover-wedding-march.json";

const doc = document as SongDocument;

export const boboverWeddingMarch: SongEntry = {
  id: "bobover-wedding-march",
  title: "Bobover Wedding March",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "bobover wedding march.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/bobover%20wedding%20march.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
