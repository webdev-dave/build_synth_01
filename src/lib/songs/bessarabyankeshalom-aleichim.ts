import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/bessarabyankeshalom-aleichim.json";

const doc = document as SongDocument;

export const bessarabyankeshalomAleichim: SongEntry = {
  id: "bessarabyankeshalom-aleichim",
  title: "Bessarabyankeshalom Aleichim",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "bessarabyankeshalom aleichim.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/bessarabyankeshalom%20aleichim.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
