import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/jump-at-the-sun.json";

const doc = document as SongDocument;

export const jumpAtTheSun: SongEntry = {
  id: "jump-at-the-sun",
  title: "Jump at The Sun",
  subtitle: "Klezmer folktune · 6/8 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "jump at the sun.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/jump%20at%20the%20sun.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
