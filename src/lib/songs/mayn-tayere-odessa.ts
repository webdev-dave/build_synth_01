import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/mayn-tayere-odessa.json";

const doc = document as SongDocument;

export const maynTayereOdessa: SongEntry = {
  id: "mayn-tayere-odessa",
  title: "Mayn Tayere Odessa",
  subtitle: "Klezmer folktune · 3/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "mayn tayere odessa.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/mayn%20tayere%20odessa.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
