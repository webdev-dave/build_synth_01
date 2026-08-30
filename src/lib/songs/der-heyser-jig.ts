import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/der-heyser-jig.json";

const doc = document as SongDocument;

export const derHeyserJig: SongEntry = {
  id: "der-heyser-jig",
  title: "Der Heyser Jig",
  subtitle: "Klezmer folktune · 6/8 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "der heyser jig.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/der%20heyser%20jig.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
