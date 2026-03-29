"use client";

import { NOTES } from "@/lib/music";
import { POSITIONS, posLabel, calculateAllPositions } from "@/lib/harmonica";

export default function PositionMatrix() {
  return (
    <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4 px-2.5 overflow-x-auto">
      <h2 className="text-sm font-bold text-[#f5f0e8] uppercase tracking-wide mb-3 pl-1">
        Full Matrix — All 12 Harps × 5 Positions
      </h2>
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
                  style={{ color: p.color }}
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
                  {results.map((r) => (
                    <td
                      key={r.pos}
                      className={`py-[7px] px-1 text-center text-[#c8c4be] border-b border-[#1e1e28] ${
                        r.pos === 2 ? "font-bold" : "font-normal"
                      }`}
                    >
                      {r.playingKey}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-[#5a5650] mt-2.5 pl-1 italic">
        Read as: &quot;[Harp] in [position] → play in [key]&quot;
      </p>
    </div>
  );
}
