import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/nye-zuritse-chloptsi.json";

const doc = document as SongDocument;

export const nyeZuritseChloptsi: SongEntry = {
  id: "nye-zuritse-chloptsi",
  title: "Nye Zuritse Chloptsi",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "nye zuritse chloptsi.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/nye%20zuritse%20chloptsi.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
