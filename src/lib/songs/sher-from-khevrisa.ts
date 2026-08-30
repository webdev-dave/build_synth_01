import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/sher-from-khevrisa.json";

const doc = document as SongDocument;

export const sherFromKhevrisa: SongEntry = {
  id: "sher-from-khevrisa",
  title: "Sher From Khevrisa",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "sher from khevrisa.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/sher%20from%20khevrisa.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
