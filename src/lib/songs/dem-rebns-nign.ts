import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/dem-rebns-nign.json";

const doc = document as SongDocument;

export const demRebnsNign: SongEntry = {
  id: "dem-rebns-nign",
  title: "Dem Rebns Nign",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "dem rebns nign.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/dem%20rebns%20nign.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
