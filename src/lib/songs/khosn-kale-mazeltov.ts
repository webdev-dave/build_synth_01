import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/khosn-kale-mazeltov.json";

const doc = document as SongDocument;

export const khosnKaleMazeltov: SongEntry = {
  id: "khosn-kale-mazeltov",
  title: "Khosn Kale Mazeltov",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "khosn kale mazeltov.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/khosn%20kale%20mazeltov.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
