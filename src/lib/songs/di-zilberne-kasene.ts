import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/di-zilberne-kasene.json";

const doc = document as SongDocument;

export const diZilberneKasene: SongEntry = {
  id: "di-zilberne-kasene",
  title: "di Zilberne Kasene",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "di zilberne kasene.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/di%20zilberne%20kasene.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
