import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/josefins-dopvals.json";

const doc = document as SongDocument;

export const josefinsDopvals: SongEntry = {
  id: "josefins-dopvals",
  title: "Josefins Dopvals",
  subtitle: "Klezmer folktune · 3/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "josefins dopvals.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/josefins%20dopvals.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
