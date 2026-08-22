"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

import { NOTES } from "@/lib/music";
import {
  POSITIONS,
  posLabel,
  calculateAllPositions,
  relativeKeyLabel,
} from "@/lib/harmonica";

export default function PositionMatrix() {
  // Default on: the relative reading is part of the cheat sheet, not an extra.
  const [showRelative, setShowRelative] = useState(true);

  return (
    <div className="cheatsheet bg-[#12121a] border border-[#2a2a35] rounded-xl p-4 px-2.5 overflow-x-auto">
      <div className="flex items-start justify-between gap-3 mb-3 pl-1">
        <h2 className="text-sm font-bold text-[#f5f0e8] uppercase tracking-wide">
          Full Matrix — All 12 Harps × 5 Positions
        </h2>
        <div className="flex items-center gap-2 shrink-0 print:hidden">
          <button
            type="button"
            onClick={() => setShowRelative((v) => !v)}
            aria-pressed={showRelative}
            className={`text-[10px] font-mono uppercase tracking-wide rounded-md border px-2 py-1 transition-colors ${
              showRelative
                ? "border-[#3a3a48] bg-[#1c1c28] text-[#c8c4be]"
                : "border-[#2a2a35] bg-transparent text-[#6a665f] hover:text-[#8a8680]"
            }`}
          >
            Relative keys: {showRelative ? "on" : "off"}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="text-[10px] font-mono uppercase tracking-wide rounded-md border border-[#2a2a35] bg-transparent text-[#8a8680] px-2 py-1 transition-colors hover:text-[#c8c4be] hover:border-[#3a3a48]"
          >
            Save as PDF
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11.5px] font-mono">
          <thead>
            <tr>
              <th className="py-1.5 px-1.5 text-left text-[#8a8680] border-b border-[#2a2a35] text-[10px] font-semibold uppercase tracking-wide sticky left-0 bg-[#12121a] z-[1] align-top">
                Harp
              </th>
              {POSITIONS.map((p) => (
                <th
                  key={p.pos}
                  className="py-1.5 px-1 text-center border-b border-[#2a2a35] text-[9.5px] font-bold uppercase whitespace-nowrap align-top"
                  style={{ color: p.color, "--pos-color": p.color } as CSSProperties}
                >
                  {posLabel(p.pos)}
                  <br />
                  <span className="text-[8px] text-[#5a5650] font-normal">
                    {p.pos === 2 ? (<>Mixolydian<br />/ Blues</>) : p.mode}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NOTES.map((note, ni) => {
              const results = calculateAllPositions(note, "harpKey");
              return (
                <tr
                  key={note}
                  className={ni % 2 === 0 ? "" : "bg-white/[0.02]"}
                >
                  <td
                    className="py-[7px] px-1.5 font-bold text-[#e8e6e1] border-b border-[#1e1e28] sticky left-0 z-[1]"
                    style={{
                      background: ni % 2 === 0 ? "#12121a" : "#141420",
                    }}
                  >
                    {note}
                  </td>
                  {results.map((r) => {
                    const relative = relativeKeyLabel(r.playingKey, r);
                    return (
                      <td
                        key={r.pos}
                        className={`py-[7px] px-1 text-center text-[#c8c4be] border-b border-[#1e1e28] ${
                          r.pos === 2 ? "font-bold" : "font-normal"
                        }`}
                      >
                        {r.playingKey}
                        {relative && (
                          <span
                            className={`rel-key-wrap${
                              showRelative ? "" : " hidden print:contents"
                            }`}
                          >
                            <br />
                            <span className="rel-key text-[8px] font-normal text-[#5a5650]">
                              {relative}
                            </span>
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-[#5a5650] mt-2.5 pl-1 italic">
        Read as: &quot;[Harp] in [position] → play in [key]&quot;
        <span className={showRelative ? undefined : "hidden print:inline"}>
          {" "}
          · small line on 1st / 4th = relative pair (same notes: C and{" "}
          <span className="not-italic font-mono">Am</span>, etc.)
        </span>
      </p>
    </div>
  );
}
