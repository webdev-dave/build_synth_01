import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/oh-yossel-yossel.json";

const doc = document as SongDocument;

export const ohYosselYossel: SongEntry = {
  id: "oh-yossel-yossel",
  title: "oh Yossel Yossel",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "oh yossel yossel.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/oh%20yossel%20yossel.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
