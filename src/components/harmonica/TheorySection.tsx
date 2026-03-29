"use client";

import { useState } from "react";
import PianoTheory from "./PianoTheory";
import type { ScaleMode } from "@/lib/harmonica";

interface TheorySectionProps {
  harpKey: string;
  activePosition: number;
  scaleMode: ScaleMode;
}

export default function TheorySection({
  harpKey,
  activePosition,
  scaleMode,
}: TheorySectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl mb-4 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-3.5 px-4 border-none cursor-pointer bg-transparent flex justify-between items-center font-[inherit] hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#f5f0e8] uppercase tracking-wide">
            Advanced Theory — Why Positions Work
          </span>
          <span className="text-[9px] text-[#8a8680] bg-[#1e1e28] py-0.5 px-1.5 rounded border border-[#2a2a35]">
            Piano Diagram
          </span>
        </div>
        <span
          className="text-base text-[#8a8680] transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <PianoTheory harpKey={harpKey} activePosition={activePosition} scaleMode={scaleMode} />
        </div>
      )}
    </div>
  );
}
