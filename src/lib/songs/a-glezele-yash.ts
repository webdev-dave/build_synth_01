import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/a-glezele-yash.json";

const doc = document as SongDocument;

export const aGlezeleYash: SongEntry = {
  id: "a-glezele-yash",
  title: "A Glezele Yash",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "a glezele yash.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/a%20glezele%20yash.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
