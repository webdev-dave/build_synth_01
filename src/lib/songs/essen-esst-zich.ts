import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/essen-esst-zich.json";

const doc = document as SongDocument;

export const essenEsstZich: SongEntry = {
  id: "essen-esst-zich",
  title: "Essen Esst Zich",
  subtitle: "Klezmer folktune · 3/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "essen esst zich.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/essen%20esst%20zich.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
