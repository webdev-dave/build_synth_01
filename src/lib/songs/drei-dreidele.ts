import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/drei-dreidele.json";

const doc = document as SongDocument;

export const dreiDreidele: SongEntry = {
  id: "drei-dreidele",
  title: "Drei Dreidele",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "drei dreidele.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/drei%20dreidele.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
