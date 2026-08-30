import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/a-dreidele-far-alle.json";

const doc = document as SongDocument;

export const aDreideleFarAlle: SongEntry = {
  id: "a-dreidele-far-alle",
  title: "A Dreidele Far Alle",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "a dreidele far alle.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/a%20dreidele%20far%20alle.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
