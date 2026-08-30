import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/shalom-aleichim.json";

const doc = document as SongDocument;

export const shalomAleichim: SongEntry = {
  id: "shalom-aleichim",
  title: "Shalom Aleichim",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "shalom aleichim.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/shalom%20aleichim.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
