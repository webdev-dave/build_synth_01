import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/bulgar-joe-kutchers.json";

const doc = document as SongDocument;

export const bulgarJoeKutchers: SongEntry = {
  id: "bulgar-joe-kutchers",
  title: "Bulgar Joe Kutchers",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "bulgar joe kutchers.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/bulgar%20joe%20kutchers.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
