import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/anniversary-waltz-chanesse-valts.json";

const doc = document as SongDocument;

export const anniversaryWaltzChanesseValts: SongEntry = {
  id: "anniversary-waltz-chanesse-valts",
  title: "Anniversary Waltz Chanesse Valts",
  subtitle: "Klezmer folktune · 3/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "anniversary waltz chanesse valts.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/anniversary%20waltz%20chanesse%20valts.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
