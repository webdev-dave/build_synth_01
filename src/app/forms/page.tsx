import type { Metadata } from "next";

import { getAppIcon } from "@/lib/appIcons";
import { FormsExplorer } from "@/components/forms/FormsExplorer";

export const metadata: Metadata = {
  title: "Song Forms — Heard, Seen, and Played",
  description:
    "How songs are shaped: the 12-bar blues chorus and its AAB line, eight- and sixteen-bar blues, verse–chorus form — each drawn as a map whose width is time, with the music sounding under it so you always know where you are.",
  alternates: { canonical: "/forms" },
  keywords: [
    "song form explained",
    "12 bar blues form",
    "AAB blues form",
    "verse chorus form",
    "song structure",
    "what is a chorus in music",
  ],
};

export default function FormsPage() {
  const Icon = getAppIcon("forms");
  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <div className="flex items-center gap-2.5">
            <Icon className="h-6 w-6" strokeWidth={1.75} />
            <h1 className="text-2xl font-semibold tracking-tight">Song forms</h1>
          </div>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            A form is the length of the loop before the music comes round
            again, and how its bars group into lines, choruses and a whole
            song. Each page here takes one shape, draws it as a{" "}
            <strong>map whose width is time</strong>, and plays the music
            under it — so the lit cell is where you are, and the empty half
            of a line is visibly where the answer lives.
          </p>
        </header>

        <FormsExplorer />
      </div>
    </main>
  );
}
