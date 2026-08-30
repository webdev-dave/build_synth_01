import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/keshenever-bulgar.json";

const doc = document as SongDocument;

export const kesheneverBulgar: SongEntry = {
  id: "keshenever-bulgar",
  title: "Keshenever Bulgar",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "keshenever bulgar.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/keshenever%20bulgar.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
