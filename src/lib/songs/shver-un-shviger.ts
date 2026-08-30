import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/shver-un-shviger.json";

const doc = document as SongDocument;

export const shverUnShviger: SongEntry = {
  id: "shver-un-shviger",
  title: "Shver un Shviger",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "shver un shviger.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/shver%20un%20shviger.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
