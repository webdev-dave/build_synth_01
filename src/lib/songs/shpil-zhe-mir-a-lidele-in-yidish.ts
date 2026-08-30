import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/shpil-zhe-mir-a-lidele-in-yidish.json";

const doc = document as SongDocument;

export const shpilZheMirALideleInYidish: SongEntry = {
  id: "shpil-zhe-mir-a-lidele-in-yidish",
  title: "Shpil Zhe Mir A Lidele in Yidish",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "shpil zhe mir a lidele in yidish.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/shpil%20zhe%20mir%20a%20lidele%20in%20yidish.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
