import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/chupen-tanz.json";

const doc = document as SongDocument;

export const chupenTanz: SongEntry = {
  id: "chupen-tanz",
  title: "Chupen Tanz",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "chupen tanz.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/chupen%20tanz.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
