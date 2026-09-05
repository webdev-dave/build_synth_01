import { MidiLabRoute } from "./MidiLabRoute";

export default function PianoRollLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <MidiLabRoute />
    </>
  );
}
