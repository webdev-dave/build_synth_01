import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/ojfn-veg-stejt-a-bojm.json";

const doc = document as SongDocument;

export const ojfnVegStejtABojm: SongEntry = {
  id: "ojfn-veg-stejt-a-bojm",
  title: "Ojfn Veg Stejt A Bojm",
  subtitle: "Klezmer folktune · 3/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "ojfn veg stejt a bojm.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/ojfn%20veg%20stejt%20a%20bojm.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
