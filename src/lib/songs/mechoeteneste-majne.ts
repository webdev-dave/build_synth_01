import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/mechoeteneste-majne.json";

const doc = document as SongDocument;

export const mechoetenesteMajne: SongEntry = {
  id: "mechoeteneste-majne",
  title: "Mechoeteneste Majne",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "mechoeteneste majne.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/mechoeteneste%20majne.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
