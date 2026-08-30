import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/freylekhs-fun-der-khupe.json";

const doc = document as SongDocument;

export const freylekhsFunDerKhupe: SongEntry = {
  id: "freylekhs-fun-der-khupe",
  title: "Freylekhs Fun Der Khupe",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "freylekhs fun der khupe.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/freylekhs%20fun%20der%20khupe.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
