import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/oifn-pripetshok.json";

const doc = document as SongDocument;

export const oifnPripetshok: SongEntry = {
  id: "oifn-pripetshok",
  title: "Oifn Pripetshok",
  subtitle: "Klezmer folktune · 3/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "oifn pripetshok.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/oifn%20pripetshok.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
