"use client";

import { useState } from "react";
import {
  POSITIONS,
  BLOW_OFFSETS,
  DRAW_OFFSETS,
  BENDS,
  MAX_BLOW_BENDS,
  MAX_DRAW_BENDS,
  isNoteInActiveScale,
  getScaleDegreeOrdinal,
  posLabel,
  getPlayingTip,
} from "@/lib/harmonica";
import type { ScaleMode } from "@/lib/harmonica";
import { NOTES, noteName, enharmonic } from "@/lib/music";
import NoteCell from "./NoteCell";
import BendCell from "./BendCell";

interface HarmonicaDiagramProps {
  harpKey: string;
  activePosition: number;
  scaleMode: ScaleMode;
  onScaleModeChange: (mode: ScaleMode) => void;
}

export default function HarmonicaDiagram({
  harpKey,
  activePosition,
  scaleMode,
  onScaleModeChange,
}: HarmonicaDiagramProps) {
  const [showDegrees, setShowDegrees] = useState(true);
  
  const harpIdx = NOTES.indexOf(harpKey as (typeof NOTES)[number]);
  const pos = POSITIONS.find((p) => p.pos === activePosition);
  const posColor = pos ? pos.color : "#555";
  const homeOffset = pos ? pos.semitones : null;
  const hasBluesOption = pos?.bluesScale !== null;
  // Draw focus only applies in blues mode (not for Mixolydian/rock playing)
  const drawFocus = pos?.drawFocus && scaleMode === "blues";

  const BEND_H = 28;
  const BEND_GAP = 3;

  return (
    <div className="bg-gradient-to-b from-[#1a1a24] to-[#14141c] border border-[#2a2a35] rounded-xl p-4 pb-3.5 mb-4">
      {/* Header */}
      <div className="flex justify-between items-baseline px-1.5 mb-3 flex-wrap gap-2">
        <span className="text-base lg:text-lg font-bold text-[#f0efe8]">
          {enharmonic(harpKey)} Harmonica
        </span>
        {pos && (
          <span
            className="text-[13px] lg:text-sm font-semibold"
            style={{ color: posColor }}
          >
            {posLabel(pos.pos)} Pos — Key of {noteName(harpIdx, pos.semitones)}
          </span>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-3 justify-center flex-wrap mb-3 text-[11px] text-[#a0a090]">
        {pos && (
          <>
            <LegendItem bg={`${posColor}35`} border={posColor} label="Home" />
            <LegendItem bg={`${posColor}15`} border={`${posColor}50`} label="In scale" />
          </>
        )}
        <span className="flex items-center gap-1">
          <span className="inline-block w-[9px] h-[9px] rounded-sm bg-[#0c0c12] border border-[#2a2a30] relative overflow-hidden">
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="block w-[140%] h-[1.5px] bg-red-500/70 rotate-[-45deg]" />
            </span>
          </span>
          Not in scale
        </span>
        {drawFocus && pos && (
          <span className="flex items-center gap-1">
            <span
              className="inline-block w-[9px] h-[9px] rounded-sm"
              style={{
                background: `${posColor}15`,
                border: `1px dashed ${posColor}50`,
              }}
            />
            Dashed = use sparingly
          </span>
        )}
        {/* Toggle for scale degrees */}
        <button
          onClick={() => setShowDegrees(!showDegrees)}
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition-colors"
          style={{
            background: showDegrees ? `${posColor}20` : "#1a1a24",
            border: `1px solid ${showDegrees ? posColor : "#2a2a35"}`,
            color: showDegrees ? posColor : "#6a6560",
          }}
        >
          {showDegrees ? "✓" : "○"} Scale steps
        </button>
      </div>

      {/* Scale mode toggle (only for 2nd position) */}
      {hasBluesOption && (
        <div className="flex justify-center gap-1 mb-2">
          <button
            onClick={() => onScaleModeChange("blues")}
            className={`px-3 py-1 text-[11px] lg:text-xs font-semibold rounded-l-md transition-colors ${
              scaleMode === "blues"
                ? "text-white"
                : "text-[#8a8a80] hover:text-[#b0b0a0]"
            }`}
            style={{
              background: scaleMode === "blues" ? posColor : "#1a1a24",
              border: `1px solid ${scaleMode === "blues" ? posColor : "#2a2a35"}`,
            }}
          >
            Blues Scale
          </button>
          <button
            onClick={() => onScaleModeChange("full")}
            className={`px-3 py-1 text-[11px] lg:text-xs font-semibold rounded-r-md transition-colors ${
              scaleMode === "full"
                ? "text-white"
                : "text-[#8a8a80] hover:text-[#b0b0a0]"
            }`}
            style={{
              background: scaleMode === "full" ? posColor : "#1a1a24",
              border: `1px solid ${scaleMode === "full" ? posColor : "#2a2a35"}`,
            }}
          >
            {pos?.mode || "Full"} Scale
          </button>
        </div>
      )}

      {/* Blow label */}
      <div className="text-center text-[10px] lg:text-xs mt-4 mb-1 text-[#8a6a9a] tracking-wider uppercase font-bold">
        ↑ Blow (breathe out) ↑
      </div>

      {/* Harmonica Grid */}
      <div className="flex gap-0.5 justify-center px-px">
        {Array.from({ length: 10 }, (_, i) => {
          const blowOff = BLOW_OFFSETS[i];
          const drawOff = DRAW_OFFSETS[i];
          const blowNote = noteName(harpIdx, blowOff);
          const drawNote = noteName(harpIdx, drawOff);
          const holeBends = BENDS[i];
          const blowIsHome = homeOffset !== null && blowOff % 12 === homeOffset;
          const drawIsHome = homeOffset !== null && drawOff % 12 === homeOffset;
          const blowInScale = pos ? isNoteInActiveScale(blowOff, pos, scaleMode) : true;
          const drawInScale = pos ? isNoteInActiveScale(drawOff, pos, scaleMode) : true;
          const blowDegree = pos ? getScaleDegreeOrdinal(blowOff, pos, scaleMode) : null;
          const drawDegree = pos ? getScaleDegreeOrdinal(drawOff, pos, scaleMode) : null;
          const drawBends = holeBends.filter((b) => b.type === "draw");
          const blowBends = holeBends.filter((b) => b.type === "blow");

          return (
            <div
              key={i}
              className="flex flex-col items-stretch flex-1 min-w-0 max-w-[72px] lg:max-w-[88px] xl:max-w-[100px]"
            >
              {/* Blow bends zone */}
              <div
                className="flex flex-col justify-end items-stretch"
                style={{
                  height: MAX_BLOW_BENDS * (BEND_H + BEND_GAP),
                  gap: BEND_GAP,
                }}
              >
                {blowBends.map((b, bi) => {
                  const bn = noteName(harpIdx, b.offset);
                  const inScale = pos ? isNoteInActiveScale(b.offset, pos, scaleMode) : true;
                  const bendDegree = pos ? getScaleDegreeOrdinal(b.offset, pos, scaleMode) : null;
                  return (
                    <BendCell
                      key={bi}
                      note={bn}
                      depth={b.depth}
                      arrow="↑"
                      posColor={posColor}
                      isInScale={inScale}
                      deemphasize={!!drawFocus}
                      height={BEND_H}
                      scaleDegree={bendDegree}
                      showDegrees={showDegrees}
                    />
                  );
                })}
              </div>

              {/* Blow note */}
              <div className="mt-0.5">
                <NoteCell
                  note={blowNote}
                  isHome={blowIsHome}
                  isInScale={blowInScale}
                  posColor={posColor}
                  type="blow"
                  deemphasize={!!drawFocus}
                  scaleDegree={blowDegree}
                  showDegrees={showDegrees}
                />
              </div>

              {/* Hole number */}
              <div className="py-1.5 lg:py-2 text-center bg-[#0e0e16] border-x border-[#2a2a35]">
                <span className="text-[13px] lg:text-sm font-extrabold font-mono text-[#7a7670]">
                  {i + 1}
                </span>
              </div>

              {/* Draw note */}
              <div className="mb-0.5">
                <NoteCell
                  note={drawNote}
                  isHome={drawIsHome}
                  isInScale={drawInScale}
                  posColor={posColor}
                  type="draw"
                  deemphasize={false}
                  scaleDegree={drawDegree}
                  showDegrees={showDegrees}
                />
              </div>

              {/* Draw bends zone */}
              <div
                className="flex flex-col justify-start items-stretch"
                style={{
                  height: MAX_DRAW_BENDS * (BEND_H + BEND_GAP),
                  gap: BEND_GAP,
                }}
              >
                {drawBends.map((b, bi) => {
                  const bn = noteName(harpIdx, b.offset);
                  const inScale = pos ? isNoteInActiveScale(b.offset, pos, scaleMode) : true;
                  const bendDegree = pos ? getScaleDegreeOrdinal(b.offset, pos, scaleMode) : null;
                  return (
                    <BendCell
                      key={bi}
                      note={bn}
                      depth={b.depth}
                      arrow="↓"
                      posColor={posColor}
                      isInScale={inScale}
                      deemphasize={false}
                      height={BEND_H}
                      scaleDegree={bendDegree}
                      showDegrees={showDegrees}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Draw label */}
      <div className="text-center text-[10px] lg:text-xs mt-1.5 text-[#8a6a9a] tracking-wider uppercase font-bold">
        ↓ Draw (breathe in) ↓
      </div>

      {/* Playing tip */}
      {pos && (
        <div
          className="mt-3 py-2.5 px-3 rounded-md text-[12px] lg:text-[13px] text-[#c0bab4] leading-relaxed text-center"
          style={{
            background: `${posColor}10`,
            border: `1px solid ${posColor}30`,
          }}
          dangerouslySetInnerHTML={{
            __html: formatPlayingTip(getPlayingTip(pos), posColor),
          }}
        />
      )}
    </div>
  );
}

function LegendItem({
  bg,
  border,
  label,
  round = false,
}: {
  bg: string;
  border: string;
  label: string;
  round?: boolean;
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className={`inline-block w-[9px] h-[9px] ${
          round ? "rounded-full" : "rounded-sm"
        }`}
        style={{ background: bg, border: `1.5px solid ${border}` }}
      />
      {label}
    </span>
  );
}

function formatPlayingTip(tip: string, posColor: string): string {
  return tip
    .replace(
      /draw \d+/g,
      (match) => `<strong style="color:${posColor}">${match}</strong>`
    )
    .replace(
      /blow \d+/g,
      (match) => `<strong style="color:${posColor}">${match}</strong>`
    )
    .replace(
      /blow notes/g,
      (match) => `<strong style="color:${posColor}">${match}</strong>`
    )
    .replace(
      /bends/g,
      (match) => `<strong style="color:${posColor}">${match}</strong>`
    )
    .replace(
      /♭3|♭5|♭7/g,
      (match) => `<strong style="color:${posColor}">${match}</strong>`
    );
}
