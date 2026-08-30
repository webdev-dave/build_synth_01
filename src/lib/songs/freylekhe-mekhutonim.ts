import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/freylekhe-mekhutonim.json";

const doc = document as SongDocument;

export const freylekheMekhutonim: SongEntry = {
  id: "freylekhe-mekhutonim",
  title: "Freylekhe Mekhutonim",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "freylekhe mekhutonim.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/freylekhe%20mekhutonim.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
