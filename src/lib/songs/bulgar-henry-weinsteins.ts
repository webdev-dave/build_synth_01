import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/bulgar-henry-weinsteins.json";

const doc = document as SongDocument;

export const bulgarHenryWeinsteins: SongEntry = {
  id: "bulgar-henry-weinsteins",
  title: "Bulgar Henry Weinsteins",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "bulgar henry weinsteins.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/bulgar%20henry%20weinsteins.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
