import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/der-badchen-freylach.json";

const doc = document as SongDocument;

export const derBadchenFreylach: SongEntry = {
  id: "der-badchen-freylach",
  title: "Der Badchen Freylach",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "der badchen freylach.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/der%20badchen%20freylach.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
