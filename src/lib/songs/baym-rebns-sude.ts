import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/baym-rebns-sude.json";

const doc = document as SongDocument;

export const baymRebnsSude: SongEntry = {
  id: "baym-rebns-sude",
  title: "Baym Rebns Sude",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "baym rebns sude.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/baym%20rebns%20sude.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
