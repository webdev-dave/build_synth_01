import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/long-live-the-nigun.json";

const doc = document as SongDocument;

export const longLiveTheNigun: SongEntry = {
  id: "long-live-the-nigun",
  title: "Long Live The Nigun",
  subtitle: "Klezmer folktune · 3/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "long live the nigun.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/long%20live%20the%20nigun.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
