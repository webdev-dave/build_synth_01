"use client";

import {
  POSITIONS,
  posLabel,
  getPositionDegreeOrdinal,
  getModeExplanation,
} from "@/lib/harmonica";
import type { ScaleMode } from "@/lib/harmonica";
import {
  NOTES,
  DEGREE_NAMES,
  niceNote,
  isBlackKey,
} from "@/lib/music";

interface PianoTheoryProps {
  harpKey: string;
  activePosition: number;
  scaleMode: ScaleMode;
}

export default function PianoTheory({
  harpKey,
  activePosition,
  scaleMode,
}: PianoTheoryProps) {
  const harpIdx = NOTES.indexOf(harpKey as (typeof NOTES)[number]);
  const pos = POSITIONS.find((p) => p.pos === activePosition);
  const posColor = pos ? pos.color : "#555";
  const posRoot = pos ? (harpIdx + pos.semitones) % 12 : harpIdx;
  const posRootNote = NOTES[posRoot];
  
  // Determine which scale intervals to use based on mode
  const hasBluesOption = pos?.bluesScale !== null;
  const useBluesScale = scaleMode === "blues" && hasBluesOption && pos?.bluesScale;
  
  // Get active scale intervals (relative to position root)
  const activeScaleIntervals = useBluesScale
    ? pos.bluesScale!.intervals  // [0, 3, 5, 6, 7, 10] for blues
    : pos?.scaleIntervals || [0, 2, 4, 5, 7, 9, 11];  // modal scale
  
  // Convert intervals to actual note indices
  const activeScaleNoteIndices = activeScaleIntervals.map(
    (interval) => (posRoot + interval) % 12
  );
  
  // For step markers, we still use the modal scale
  const majorScaleOffsets = [0, 2, 4, 5, 7, 9, 11];
  const majorScaleNoteIndices = majorScaleOffsets.map((o) => (harpIdx + o) % 12);
  
  const modeScaleNotes = majorScaleNoteIndices
    .map((ni) => {
      const interval = (ni - posRoot + 12) % 12;
      return {
        noteIdx: ni,
        note: NOTES[ni],
        interval,
        degree: DEGREE_NAMES[interval],
      };
    })
    .sort((a, b) => a.interval - b.interval);

  const totalSemitones = 25;

  interface PianoKey {
    semitone: number;
    noteIdx: number;
    note: string;
    black: boolean;
    inActiveScale: boolean;
    inMajorScale: boolean;
    isRoot: boolean;
    degree: string;
    interval: number;
  }

  const pianoKeys: PianoKey[] = [];
  for (let i = 0; i < totalSemitones; i++) {
    const noteIdx = (harpIdx + i) % 12;
    const inActiveScale = activeScaleNoteIndices.includes(noteIdx);
    const inMajorScale = majorScaleNoteIndices.includes(noteIdx);
    const isRoot = noteIdx === posRoot;
    const interval = (noteIdx - posRoot + 12) % 12;
    pianoKeys.push({
      semitone: i,
      noteIdx,
      note: NOTES[noteIdx],
      black: isBlackKey(noteIdx),
      inActiveScale,
      inMajorScale,
      isRoot,
      degree: DEGREE_NAMES[interval],
      interval,
    });
  }

  const whiteKeys = pianoKeys.filter((k) => !k.black);
  const wkw = 580 / whiteKeys.length;
  
  // Scale name for display
  const activeScaleName = useBluesScale ? "Blues" : pos?.mode || "Major";
  const scaleNoteCount = activeScaleIntervals.length;

  if (!pos) return null;

  return (
    <div>
      {/* Explanation text */}
      <div className="text-[12.5px] leading-relaxed text-[#b0aaa4] mb-4">
        {useBluesScale ? (
          <>
            <p className="mb-2.5">
              The <strong className="text-[#e8e6e1]">{niceNote(posRootNote)} Blues Scale</strong>{" "}
              uses only <strong className="text-[#e8e6e1]">6 notes</strong>:{" "}
              {pos.bluesScale!.names.join(", ")}. This pentatonic-based scale is the foundation
              of blues harmonica playing.
            </p>
            <p className="mb-2.5">
              Notes <span className="text-red-400">marked with stripes</span> are{" "}
              <strong className="text-[#e8e6e1]">outside the blues scale</strong> — use them
              sparingly as passing tones, or avoid them for a pure blues sound.
            </p>
            <p>
              The{" "}
              <span className="font-bold" style={{ color: posColor }}>
                highlighted note
              </span>{" "}
              is your home ({niceNote(posRootNote)}). The{" "}
              <span className="text-[#8aca9e]">green keys</span> are the other blues scale tones.
            </p>
          </>
        ) : (
          <>
            <p className="mb-2.5">
              A <strong className="text-[#e8e6e1]">{niceNote(harpKey)} harmonica</strong>{" "}
              is tuned to the {niceNote(harpKey)} major scale — it gives you exactly{" "}
              <strong className="text-[#e8e6e1]">7 natural notes</strong> (blow and
              draw, no bends). All 5 positions use <em>these same 7 notes</em>. The
              only thing that changes is which note you treat as &quot;home.&quot;
            </p>
            <p className="mb-2.5">
              By shifting your home note, the pattern of{" "}
              <strong className="text-[#e8e6e1]">whole steps (W)</strong> and{" "}
              <strong className="text-[#e8e6e1]">half steps (H)</strong> around you
              changes — creating a different <em>mode</em> (scale with a different
              emotional flavor).
            </p>
            <p>
              Below: the{" "}
              <span className="font-bold" style={{ color: posColor }}>
                highlighted note
              </span>{" "}
              is your home for {posLabel(pos.pos)} position. The{" "}
              <span className="text-[#8aca9e]">green keys</span> are the other
              available scale tones. Keys with <span className="text-red-400">red stripes</span>{" "}
              are outside the {activeScaleName} scale.
            </p>
          </>
        )}
      </div>

      {/* Info cards */}
      <div className="flex gap-2 flex-wrap mb-3.5 justify-center">
        <InfoCard
          label="Scale"
          value={`${activeScaleName} (${scaleNoteCount} notes)`}
          color={posColor}
          bg={`${posColor}15`}
          border={`${posColor}40`}
        />
        <InfoCard label="Home Note" value={niceNote(posRootNote)} color={posColor} />
        {!useBluesScale && (
          <InfoCard label="Step Pattern" value={pos.pattern.join(" ")} mono />
        )}
        <InfoCard label="Character" value={useBluesScale ? "Bluesy, gritty, soulful" : pos.feel} italic />
      </div>

      {/* Piano SVG */}
      <div className="bg-[#0e0e16] rounded-xl p-3.5 pt-3 pb-2 border border-[#2a2a35]">
        <div className="text-[10px] text-[#6a6560] text-center mb-2 uppercase tracking-wider font-semibold">
          {niceNote(posRootNote)} {activeScaleName} Scale — {posLabel(pos.pos)} Position
        </div>
        <div className="relative w-full max-w-[580px] mx-auto">
          <svg
            viewBox="0 0 580 130"
            className="w-full h-auto block"
          >
            {/* Pattern definition for "not in scale" stripes */}
            <defs>
              <pattern
                id="notInScaleWhite"
                patternUnits="userSpaceOnUse"
                width="6"
                height="6"
                patternTransform="rotate(-45)"
              >
                <rect width="6" height="6" fill="#e8e4dc" />
                <line x1="0" y1="0" x2="0" y2="6" stroke="#ef444480" strokeWidth="2" />
              </pattern>
              <pattern
                id="notInScaleBlack"
                patternUnits="userSpaceOnUse"
                width="6"
                height="6"
                patternTransform="rotate(-45)"
              >
                <rect width="6" height="6" fill="#333" />
                <line x1="0" y1="0" x2="0" y2="6" stroke="#ef444480" strokeWidth="2" />
              </pattern>
            </defs>

            {/* White keys */}
            {whiteKeys.map((k, wi) => {
              const x = wi * wkw;
              const w = wkw - 1;
              const notInScale = !k.inActiveScale;
              const fill = k.isRoot
                ? posColor
                : k.inActiveScale
                  ? "#2a5a3a"
                  : "url(#notInScaleWhite)";
              return (
                <g key={`w${wi}`}>
                  <rect
                    x={x}
                    y={0}
                    width={w}
                    height={110}
                    rx={3}
                    fill={fill}
                    stroke={k.isRoot ? posColor : k.inActiveScale ? "#3a7a4a" : "#bbb"}
                    strokeWidth={k.isRoot ? 2 : 0.5}
                  />
                  <text
                    x={x + w / 2}
                    y={96}
                    textAnchor="middle"
                    fontSize={9}
                    fontFamily="'Courier New',monospace"
                    fontWeight={700}
                    fill={k.isRoot ? "#fff" : k.inActiveScale ? "#c8f0d8" : "#444"}
                  >
                    {niceNote(k.note)}
                  </text>
                  {k.inActiveScale && (
                    <text
                      x={x + w / 2}
                      y={108}
                      textAnchor="middle"
                      fontSize={7}
                      fontFamily="Georgia,serif"
                      fill={k.isRoot ? "#fff" : "#8ac8a0"}
                    >
                      {k.degree}
                    </text>
                  )}
                  {notInScale && (
                    <text
                      x={x + w / 2}
                      y={108}
                      textAnchor="middle"
                      fontSize={7}
                      fontFamily="Georgia,serif"
                      fill="#999"
                    >
                      ×
                    </text>
                  )}
                </g>
              );
            })}

            {/* Black keys */}
            {pianoKeys
              .filter((k) => k.black)
              .map((k) => {
                const whitesBefore = pianoKeys.filter(
                  (pk) => !pk.black && pk.semitone < k.semitone
                ).length;
                const x = whitesBefore * wkw - wkw * 0.3;
                const w = wkw * 0.58;
                const fill = k.isRoot
                  ? posColor
                  : k.inActiveScale
                    ? "#1a4a2e"
                    : "url(#notInScaleBlack)";
                return (
                  <g key={`b${k.semitone}`}>
                    <rect
                      x={x}
                      y={0}
                      width={w}
                      height={68}
                      rx={2}
                      fill={fill}
                      stroke={k.isRoot ? posColor : k.inActiveScale ? "#2a6a3e" : "#222"}
                      strokeWidth={k.isRoot ? 2 : 0.5}
                    />
                    <text
                      x={x + w / 2}
                      y={58}
                      textAnchor="middle"
                      fontSize={7.5}
                      fontFamily="'Courier New',monospace"
                      fontWeight={700}
                      fill={k.isRoot ? "#fff" : k.inActiveScale ? "#a0d8b0" : "#888"}
                    >
                      {niceNote(k.note)}
                    </text>
                  </g>
                );
              })}

            {/* Step markers */}
            {modeScaleNotes.map((sn, si) => {
              if (si >= modeScaleNotes.length - 1) return null;
              const thisKey = pianoKeys.find(
                (pk) => pk.noteIdx === sn.noteIdx && pk.semitone < 20
              );
              const nextSn = modeScaleNotes[(si + 1) % modeScaleNotes.length];
              const nextKey = pianoKeys.find(
                (pk) =>
                  pk.noteIdx === nextSn.noteIdx &&
                  pk.semitone > (thisKey?.semitone ?? 0)
              );
              if (!thisKey || !nextKey) return null;

              const getX = (pk: PianoKey) => {
                if (!pk.black) {
                  const wi = whiteKeys.findIndex((w) => w.semitone === pk.semitone);
                  return wi * wkw + (wkw - 1) / 2;
                }
                const wb = pianoKeys.filter(
                  (p) => !p.black && p.semitone < pk.semitone
                ).length;
                return wb * wkw - wkw * 0.3 + wkw * 0.29;
              };

              const x1 = getX(thisKey);
              const x2 = getX(nextKey);
              const step = nextKey.semitone - thisKey.semitone;
              const label = step === 1 ? "H" : step === 2 ? "W" : `${step}`;
              const isHalf = step === 1;

              return (
                <g key={`s${si}`}>
                  <line
                    x1={x1}
                    y1={120}
                    x2={x2}
                    y2={120}
                    stroke={isHalf ? "#f87171" : "#6ac890"}
                    strokeWidth={1.5}
                    strokeDasharray={isHalf ? "3,2" : "none"}
                  />
                  <text
                    x={(x1 + x2) / 2}
                    y={128}
                    textAnchor="middle"
                    fontSize={8}
                    fontFamily="'Courier New',monospace"
                    fontWeight={800}
                    fill={isHalf ? "#f87171" : "#6ac890"}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="mt-2.5 text-center text-[11px] text-[#8a8680] leading-relaxed flex flex-wrap justify-center gap-x-4 gap-y-1">
          <span>
            <span className="inline-block w-3 h-3 rounded-sm align-middle mr-1" style={{ background: posColor }} />
            Home note
          </span>
          <span>
            <span className="inline-block w-3 h-3 rounded-sm align-middle mr-1 bg-[#2a5a3a]" />
            In scale
          </span>
          <span>
            <span className="inline-block w-3 h-3 rounded-sm align-middle mr-1 bg-[#e8e4dc] relative overflow-hidden">
              <span className="absolute inset-0" style={{ background: "repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(239,68,68,0.5) 2px, rgba(239,68,68,0.5) 4px)" }} />
            </span>
            Not in scale
          </span>
          {!useBluesScale && (
            <>
              <span className="text-[#6ac890] font-bold">W</span>
              <span>= whole step</span>
              <span className="text-red-400 font-bold">H</span>
              <span>= half step</span>
            </>
          )}
        </div>
      </div>

      {/* Why explanation - only show for modal (non-blues) view */}
      {!useBluesScale && (
        <div className="mt-3.5 p-2.5 bg-[#12121a] border border-[#2a2a35] rounded-lg text-xs leading-relaxed text-[#a09a94]">
          <strong className="text-[#e8e6e1] text-xs">
            Why does shifting the root change everything?
          </strong>
          <p className="mt-1.5">
            The major scale&apos;s step pattern is{" "}
            <code className="bg-[#1e1e28] px-1 py-px rounded text-[#8aca9e] text-[11px]">
              W W H W W W H
            </code>
            . When you start on a different note, you &quot;rotate&quot; this
            pattern. For {posLabel(pos.pos)} position, you start on the{" "}
            <span className="font-semibold" style={{ color: posColor }}>
              {getPositionDegreeOrdinal(pos.pos)}
            </span>{" "}
            degree of {niceNote(harpKey)} major, giving you:{" "}
            <code
              className="bg-[#1e1e28] px-1 py-px rounded text-[11px]"
              style={{ color: posColor }}
            >
              {pos.pattern.join(" ")}
            </code>
            . {getModeExplanation(pos)}
          </p>
        </div>
      )}

      {/* Blues scale explanation - only show for blues view */}
      {useBluesScale && pos.bluesScale && (
        <div className="mt-3.5 p-2.5 bg-[#12121a] border border-[#2a2a35] rounded-lg text-xs leading-relaxed text-[#a09a94]">
          <strong className="text-[#e8e6e1] text-xs">
            Why the Blues Scale works for 2nd Position
          </strong>
          <p className="mt-1.5">
            The blues scale ({pos.bluesScale.names.join(", ")}) is a 6-note scale derived from
            the minor pentatonic with an added &quot;blue note&quot; (♭5). In 2nd position,
            your draw notes and bends naturally emphasize these intervals, creating the
            characteristic bluesy sound. The ♭3, ♭5, and ♭7 provide the tension and grit
            that defines blues music.
          </p>
        </div>
      )}

      {/* All position roots */}
      <div className="mt-3.5 p-2.5 bg-[#12121a] border border-[#2a2a35] rounded-lg">
        <div className="text-[11px] text-[#8a8680] uppercase tracking-wide font-semibold mb-2">
          All 5 position roots on the {niceNote(harpKey)} harp
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {POSITIONS.map((p) => {
            const root = NOTES[(harpIdx + p.semitones) % 12];
            const isActive = p.pos === activePosition;
            return (
              <div
                key={p.pos}
                className={`py-1 px-2.5 rounded-md text-[11px] font-mono ${
                  isActive ? "font-bold" : "font-normal"
                }`}
                style={{
                  background: isActive ? `${p.color}25` : "#1a1a24",
                  border: `1px solid ${isActive ? p.color : "#2a2a35"}`,
                  color: isActive ? p.color : "#8a8680",
                }}
              >
                {posLabel(p.pos)}: <strong>{niceNote(root)}</strong>{" "}
                <span className="text-[9px] opacity-70">({p.mode})</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  color,
  bg,
  border,
  mono,
  italic,
}: {
  label: string;
  value: string;
  color?: string;
  bg?: string;
  border?: string;
  mono?: boolean;
  italic?: boolean;
}) {
  return (
    <div
      className="rounded-lg py-2 px-3.5 text-center"
      style={{
        background: bg || "#16161e",
        border: `1px solid ${border || "#2a2a35"}`,
      }}
    >
      <div className="text-[10px] text-[#8a8680] uppercase tracking-wide mb-0.5">
        {label}
      </div>
      <div
        className={`${mono ? "text-sm font-mono tracking-wider" : italic ? "text-[13px]" : "text-base"} ${
          italic ? "font-semibold italic" : "font-bold"
        }`}
        style={{ color: color || "#e8e6e1" }}
      >
        {value}
      </div>
    </div>
  );
}
