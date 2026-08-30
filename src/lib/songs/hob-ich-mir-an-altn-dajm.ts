import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/hob-ich-mir-an-altn-dajm.json";

const doc = document as SongDocument;

export const hobIchMirAnAltnDajm: SongEntry = {
  id: "hob-ich-mir-an-altn-dajm",
  title: "Hob Ich Mir An Altn Dajm",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "hob ich mir an altn dajm.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/hob%20ich%20mir%20an%20altn%20dajm.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
