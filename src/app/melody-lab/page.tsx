import type { Metadata } from "next";

import { MelodyLab } from "@/components/melody-lab/MelodyLab";

export const metadata: Metadata = {
  title: "Melody Lab — dev tool",
  robots: { index: false },
};

export default function MelodyLabPage() {
  return <MelodyLab />;
}
