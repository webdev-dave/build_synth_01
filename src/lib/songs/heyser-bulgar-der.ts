import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/heyser-bulgar-der.json";

const doc = document as SongDocument;

export const heyserBulgarDer: SongEntry = {
  id: "heyser-bulgar-der",
  title: "Heyser Bulgar Der",
  subtitle: "Klezmer folktune · 6/8 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "heyser bulgar der.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/heyser%20bulgar%20der.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
