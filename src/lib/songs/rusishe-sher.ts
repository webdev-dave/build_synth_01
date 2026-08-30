import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/rusishe-sher.json";

const doc = document as SongDocument;

export const rusisheSher: SongEntry = {
  id: "rusishe-sher",
  title: "Rusishe Sher",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "rusishe sher.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/rusishe%20sher.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
