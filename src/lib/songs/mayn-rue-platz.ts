import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/mayn-rue-platz.json";

const doc = document as SongDocument;

export const maynRuePlatz: SongEntry = {
  id: "mayn-rue-platz",
  title: "Mayn Rue Platz",
  subtitle: "Klezmer folktune · 3/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "mayn rue platz.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/mayn%20rue%20platz.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
