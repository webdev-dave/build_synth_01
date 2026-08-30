import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/sholem-zol-zajn.json";

const doc = document as SongDocument;

export const sholemZolZajn: SongEntry = {
  id: "sholem-zol-zajn",
  title: "Sholem Zol Zajn",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "sholem zol zajn.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/sholem%20zol%20zajn.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
