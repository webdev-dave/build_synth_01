"use client";

import { NOTES, relativeMinor } from "@/lib/music";

interface KeySelectorProps {
  selectedNote: string;
  onSelect: (note: string) => void;
}

export default function KeySelector({
  selectedNote,
  onSelect,
}: KeySelectorProps) {
  return (
    <div className="grid grid-cols-6 gap-1.5 mb-5">
      {NOTES.map((note) => {
        const rm = relativeMinor(note);
        const isSelected = selectedNote === note;

        return (
          <button
            key={note}
            onClick={() => onSelect(note)}
            className={`py-2 px-0 rounded-lg cursor-pointer font-mono transition-all duration-150 flex flex-col items-center gap-0.5 ${
              isSelected
                ? "border-2 border-blue-600 bg-blue-600/15"
                : "border border-[#2a2a35] bg-[#12121a] hover:border-[#3a3a45]"
            }`}
          >
            <span
              className={`text-[15px] font-bold ${
                isSelected ? "text-blue-400" : "text-[#c8c4be]"
              }`}
            >
              {note}
            </span>
            <span
              className={`text-[9.5px] font-medium italic ${
                isSelected ? "text-purple-400" : "text-[#5a5650]"
              }`}
            >
              ({rm}m)
            </span>
          </button>
        );
      })}
    </div>
  );
}
