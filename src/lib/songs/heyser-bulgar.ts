import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/heyser-bulgar.json";

const doc = document as SongDocument;

export const heyserBulgar: SongEntry = {
  id: "heyser-bulgar",
  title: "Heyser Bulgar",
  subtitle: "Klezmer folktune · 6/8 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "heyser bulgar.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/heyser%20bulgar.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
