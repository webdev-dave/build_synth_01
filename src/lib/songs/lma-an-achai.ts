import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/lma-an-achai.json";

const doc = document as SongDocument;

export const lmaAnAchai: SongEntry = {
  id: "lma-an-achai",
  title: "Lma`an Achai",
  subtitle: "Klezmer folktune · 3/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "lma`an achai.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/lma%60an%20achai.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
