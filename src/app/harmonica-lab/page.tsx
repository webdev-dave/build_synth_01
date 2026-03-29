"use client";

import { useState, useMemo } from "react";

import { calculateAllPositions } from "@/lib/harmonica";
import type { ScaleMode } from "@/lib/harmonica";

import {
  KeySelector,
  ModeToggle,
  type LookupMode,
  SelectionSummary,
  PositionCardList,
  TheorySection,
  HarmonicaDiagram,
  BendNotation,
  AlgorithmSection,
  PositionMatrix,
} from "@/components/harmonica";

export default function HarmonicaLab() {
  const [mode, setMode] = useState<LookupMode>("songKey");
  const [selectedNote, setSelectedNote] = useState("C");
  const [activePos, setActivePos] = useState(2);
  const [scaleMode, setScaleMode] = useState<ScaleMode>("blues");

  // Single source of truth for all position calculations
  const results = useMemo(
    () => calculateAllPositions(selectedNote, mode),
    [mode, selectedNote]
  );

  const activeResult = results.find((r) => r.pos === activePos);
  const harpKeyForDiagram = activeResult ? activeResult.harpKey : selectedNote;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e6e1] font-serif px-4 py-5">
      <div className="max-w-[640px] lg:max-w-[900px] xl:max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-[22px] font-bold tracking-wider uppercase text-[#f5f0e8] m-0 leading-tight">
            Harmonica Lab
          </h1>
          <div className="w-[60px] h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto my-2.5 rounded-sm" />
          <p className="text-[13px] text-[#8a8680] m-0 italic">
            Diatonic Blues Harp — 5 Positions — Bends & Blues Scale
          </p>
        </div>

        {/* Mode toggle */}
        <ModeToggle mode={mode} onModeChange={setMode} />

        {/* Prompt text */}
        <p className="text-[13px] text-[#a09a94] text-center mb-2 italic">
          {mode === "songKey"
            ? "Select the key the song is in:"
            : "Select the key on your harmonica:"}
        </p>

        {/* Key selector */}
        <KeySelector
          selectedNote={selectedNote}
          onSelect={setSelectedNote}
        />

        {/* Selection summary */}
        <SelectionSummary mode={mode} selectedNote={selectedNote} />

        {/* Position cards */}
        <PositionCardList
          results={results}
          activePos={activePos}
          mode={mode}
          onPositionSelect={setActivePos}
          scaleMode={scaleMode}
          onScaleModeChange={setScaleMode}
        />

        {/* Theory section (collapsible) */}
        <TheorySection
          harpKey={harpKeyForDiagram}
          activePosition={activePos}
          scaleMode={scaleMode}
        />

        {/* Harmonica diagram */}
        <HarmonicaDiagram
          harpKey={harpKeyForDiagram}
          activePosition={activePos}
          scaleMode={scaleMode}
          onScaleModeChange={setScaleMode}
        />

        {/* Reference sections */}
        <BendNotation />
        <AlgorithmSection results={results} selectedNote={selectedNote} mode={mode} />
        <PositionMatrix />

        {/* Footer hint */}
        <p className="text-[10px] text-[#4a4640] text-center mt-5 mb-2.5 italic">
          Select any position card to update the harmonica and piano diagrams
        </p>
      </div>
    </div>
  );
}
