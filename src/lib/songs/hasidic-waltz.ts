import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/hasidic-waltz.json";

const doc = document as SongDocument;

export const hasidicWaltz: SongEntry = {
  id: "hasidic-waltz",
  title: "Hasidic Waltz",
  subtitle: "Klezmer folktune · 3/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "hasidic waltz.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/hasidic%20waltz.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
