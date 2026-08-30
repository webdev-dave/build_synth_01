import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/baym-rebins-sude.json";

const doc = document as SongDocument;

export const baymRebinsSude: SongEntry = {
  id: "baym-rebins-sude",
  title: "Baym Rebins Sude",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "baym rebins sude.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/baym%20rebins%20sude.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
