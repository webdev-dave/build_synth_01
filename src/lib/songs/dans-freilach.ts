import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/dans-freilach.json";

const doc = document as SongDocument;

export const dansFreilach: SongEntry = {
  id: "dans-freilach",
  title: "Dans Freilach",
  subtitle: "Klezmer folktune · 3/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "dans freilach.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/dans%20freilach.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
