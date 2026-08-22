import type { Metadata } from "next";

import { MidiLab } from "@/components/midi/MidiLab";

export const metadata: Metadata = {
  title: "MIDI Lab — dev tool",
  robots: { index: false },
};

export default function MidiLabPage() {
  return <MidiLab />;
}
