import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/a-glezele-lchaym.json";

const doc = document as SongDocument;

export const aGlezeleLchaym: SongEntry = {
  id: "a-glezele-lchaym",
  title: "A Glezele Lchaym",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "a glezele lchaym.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/a%20glezele%20lchaym.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
