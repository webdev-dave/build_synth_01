import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/naftule-shpil-es-nokh-amol.json";

const doc = document as SongDocument;

export const naftuleShpilEsNokhAmol: SongEntry = {
  id: "naftule-shpil-es-nokh-amol",
  title: "Naftule Shpil es Nokh Amol",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "naftule shpil es nokh amol.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/naftule%20shpil%20es%20nokh%20amol.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
