import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/araber-tanz.json";

const doc = document as SongDocument;

export const araberTanz: SongEntry = {
  id: "araber-tanz",
  title: "Araber Tanz",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "araber tanz.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/araber%20tanz.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
