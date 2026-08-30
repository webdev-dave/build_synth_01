import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/the-rabbis-hornpipe.json";

const doc = document as SongDocument;

export const theRabbisHornpipe: SongEntry = {
  id: "the-rabbis-hornpipe",
  title: "The Rabbis Hornpipe",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "the rabbis hornpipe.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/the%20rabbis%20hornpipe.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
