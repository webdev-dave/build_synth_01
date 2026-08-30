import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/lebedich-un-freilech.json";

const doc = document as SongDocument;

export const lebedichUnFreilech: SongEntry = {
  id: "lebedich-un-freilech",
  title: "Lebedich un Freilech",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "lebedich un freilech.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/lebedich%20un%20freilech.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
