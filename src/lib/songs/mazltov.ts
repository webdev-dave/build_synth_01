import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/mazltov.json";

const doc = document as SongDocument;

export const mazltov: SongEntry = {
  id: "mazltov",
  title: "Mazltov",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "mazltov.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/mazltov.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
