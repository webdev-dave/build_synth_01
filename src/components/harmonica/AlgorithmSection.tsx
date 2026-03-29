"use client";

import type { PositionCalculation } from "@/lib/harmonica";

interface AlgorithmSectionProps {
  results: PositionCalculation[];
  selectedNote: string;
  mode: "songKey" | "harpKey";
}

export default function AlgorithmSection({ 
  results, 
  selectedNote,
  mode 
}: AlgorithmSectionProps) {
  // Get position data from single source of truth
  const pos1 = results.find((r) => r.pos === 1);
  const pos2 = results.find((r) => r.pos === 2);
  const pos3 = results.find((r) => r.pos === 3);

  if (!pos1 || !pos2 || !pos3) return null;

  return (
    <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4 mb-4">
      <h2 className="text-sm font-bold text-[#f5f0e8] uppercase tracking-wide mb-3">
        The Algorithm
      </h2>
      <div className="text-[12.5px] leading-relaxed text-[#b0aaa4]">
        <p className="mb-2.5">
          <strong className="text-blue-500">Blues (2nd pos):</strong>{" "}
          {mode === "songKey" 
            ? "Song key → count up a 4th → that's your harp."
            : "Your harp → play in the key a 5th up."}
          <br />
          <span className="text-[#6a6560] text-[11.5px]">
            {mode === "songKey" ? (
              <>
                Song in {selectedNote}? → {pos2.algorithmSteps.slice(0, -1).join(" → ")} →{" "}
                <strong className="text-[#e8e6e1]">{pos2.harpKey}</strong> →
                grab {pos2.harpKey} harp.
              </>
            ) : (
              <>
                {pos2.harpKey} harp → play in{" "}
                <strong className="text-[#e8e6e1]">{pos2.playingKey}</strong>
              </>
            )}
          </span>
        </p>
        <p className="mb-2.5">
          <strong className="text-emerald-500">Major (1st pos):</strong>{" "}
          {mode === "songKey"
            ? "Song key = harp key. Simple."
            : "Harp key = playing key. Simple."}
          <br />
          <span className="text-[#6a6560] text-[11.5px]">
            {mode === "songKey" ? (
              <>
                Song in {selectedNote}? → grab{" "}
                <strong className="text-[#e8e6e1]">{pos1.harpKey}</strong> harp.
              </>
            ) : (
              <>
                {pos1.harpKey} harp → play in{" "}
                <strong className="text-[#e8e6e1]">{pos1.playingKey}</strong>
              </>
            )}
          </span>
        </p>
        <p>
          <strong className="text-violet-500">Minor (3rd pos):</strong>{" "}
          {mode === "songKey"
            ? "Song key → count down a whole step → that's your harp."
            : "Your harp → play in the key a whole step up."}
          <br />
          <span className="text-[#6a6560] text-[11.5px]">
            {mode === "songKey" ? (
              <>
                Song in {selectedNote}m? → down from {selectedNote} →{" "}
                <strong className="text-[#e8e6e1]">{pos3.harpKey}</strong> → grab {pos3.harpKey} harp.
              </>
            ) : (
              <>
                {pos3.harpKey} harp → play in{" "}
                <strong className="text-[#e8e6e1]">{pos3.playingKey}m</strong>
              </>
            )}
          </span>
        </p>
      </div>
    </div>
  );
}
