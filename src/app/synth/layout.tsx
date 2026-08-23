import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WebSynth — Web Synthesizer",
  description: "A web-based synthesizer keyboard you can play in your browser.",
};

export default function SynthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
