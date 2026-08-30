import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/baym-rebins-sude-at-the-rabbis-table.json";

const doc = document as SongDocument;

export const baymRebinsSudeAtTheRabbisTable: SongEntry = {
  id: "baym-rebins-sude-at-the-rabbis-table",
  title: "Baym Rebins Sude at The Rabbis Table",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "baym rebins sude at the rabbis table.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/baym%20rebins%20sude%20at%20the%20rabbis%20table.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
