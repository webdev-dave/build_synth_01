"use client";

import { enharmonic, relativeMinor } from "@/lib/music";

interface SelectionSummaryProps {
  mode: "songKey" | "harpKey";
  selectedNote: string;
}

export default function SelectionSummary({
  mode,
  selectedNote,
}: SelectionSummaryProps) {
  return (
    <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl py-2.5 px-3.5 mb-3.5 text-center">
      <span className="text-[13px] text-[#8a8680]">
        {mode === "songKey" ? (
          <>
            Song key:{" "}
            <strong className="text-blue-400 text-base">
              {enharmonic(selectedNote)}
            </strong>{" "}
            <span className="text-purple-500 text-xs">
              (rel. minor: {relativeMinor(selectedNote)}m)
            </span>
          </>
        ) : (
          <>
            Harmonica:{" "}
            <strong className="text-blue-400 text-base">
              {enharmonic(selectedNote)} harp
            </strong>
          </>
        )}
      </span>
    </div>
  );
}
