import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/shalom-aleichem.json";

const doc = document as SongDocument;

export const shalomAleichem: SongEntry = {
  id: "shalom-aleichem",
  title: "Shalom Aleichem",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "shalom aleichem.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/shalom%20aleichem.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
