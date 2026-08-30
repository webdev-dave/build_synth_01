import type { Metadata } from "next";

import { MidiLab } from "@/components/midi/MidiLab";

export const metadata: Metadata = {
  title: "Piano Roll (beta)",
  description:
    "Draw, play, and edit melodies on an interactive piano roll.",
};

export default function PianoRollPage() {
  return <MidiLab />;
}
