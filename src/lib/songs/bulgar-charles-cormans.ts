import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/bulgar-charles-cormans.json";

const doc = document as SongDocument;

export const bulgarCharlesCormans: SongEntry = {
  id: "bulgar-charles-cormans",
  title: "Bulgar Charles Cormans",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "bulgar charles cormans.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/bulgar%20charles%20cormans.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
