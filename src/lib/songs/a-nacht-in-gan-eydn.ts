import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/a-nacht-in-gan-eydn.json";

const doc = document as SongDocument;

export const aNachtInGanEydn: SongEntry = {
  id: "a-nacht-in-gan-eydn",
  title: "A Nacht in Gan Eydn",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "a nacht in gan eydn.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/a%20nacht%20in%20gan%20eydn.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
