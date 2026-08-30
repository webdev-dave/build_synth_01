import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/od-yishoma.json";

const doc = document as SongDocument;

export const odYishoma: SongEntry = {
  id: "od-yishoma",
  title: "od Yishoma",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "od yishoma.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/od%20yishoma.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
