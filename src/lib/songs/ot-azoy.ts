import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/ot-azoy.json";

const doc = document as SongDocument;

export const otAzoy: SongEntry = {
  id: "ot-azoy",
  title: "ot Azoy",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "ot azoy.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/ot%20azoy.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
