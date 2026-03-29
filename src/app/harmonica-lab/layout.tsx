import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Harmonica Lab — Position Guide & Theory",
  description:
    "Interactive harmonica position guide with 5 positions, bends, blues scale, and music theory. Find the right harp for any song key.",
};

export default function HarmonicaLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
