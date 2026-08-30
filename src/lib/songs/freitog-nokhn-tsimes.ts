import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/freitog-nokhn-tsimes.json";

const doc = document as SongDocument;

export const freitogNokhnTsimes: SongEntry = {
  id: "freitog-nokhn-tsimes",
  title: "Freitog Nokhn Tsimes",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "freitog nokhn tsimes.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/freitog%20nokhn%20tsimes.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
