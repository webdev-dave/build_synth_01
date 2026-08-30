import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/tumbalalaika.json";

const doc = document as SongDocument;

export const tumbalalaika: SongEntry = {
  id: "tumbalalaika",
  title: "Tumbalalaika — voice + piano",
  subtitle: "Version A · split MIDI · Ab minor · 3/4",
  labels: KLEZMER_LABELS,
  source: {
    filename: "tumbalalaika_voice_vo_abm.mid, tumbalalaika_voice_pn_abm.mid",
    collection: "user drop",
    note: "Split voice + piano MIDI. Version B is tumbalalaika_[panamarjov_oleg].mid.",
    ingestedAt: "2026-08-30",
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
