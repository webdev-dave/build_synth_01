"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Check, Copy, Play, RotateCcw, SkipBack, Square, Trash2, Volume2, VolumeX, Undo2, Redo2, Search, Plus, Minus } from "lucide-react";

import {
  COMMON_TIME_SIGNATURES,
  formatTimeSignature,
  parseTimeSignature,
  timeSignatureLesson,
  type TimeSignature,
} from "@/lib/music";
import { documentToRollView } from "@/lib/song/toSequence";
import {
  getDefaultSong,
  SONGS,
  songBars,
  songTimeSignature,
  type SongEntry,
} from "@/lib/songs";
import { useSharedAudioContext } from "@/hooks/useSharedAudioContext";
import { useAudioSynthesis, type OscillatorType } from "@/instruments/synth/templates/basic-synth/hooks/useAudioSynthesis";
import { WaveGlyph } from "@/instruments/synth/v2/SynthV2";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { melodyToCode, midiToHz, midiToPitchName } from "./melodyConvert";
import { PianoRollEditor, type PianoRollHandle } from "./PianoRollEditor";
import { type SequenceEvent } from "./melodyConvert";
import { SongLibrarySelect } from "./SongLibrarySelect";

import { LearnPanel, type LearnPanelConcept } from "@/components/learn/LearnPanel";
import { useScaleLogic } from "@/instruments/synth/templates/basic-synth/hooks/useScaleLogic";
import { ScaleSelector } from "@/components/music/ScaleSelector";

const MIDI_CONCEPTS: Record<string, LearnPanelConcept> = {
  basics: {
    id: "basics",
    title: "Piano Roll Basics",
    body: [
      "Drag on empty space to draw a note. Drag a painted note to move it, or drag its edges to change its duration.",
      "Scroll your mouse wheel while holding Ctrl/Cmd to zoom in and out of the workspace."
    ],
  },
  eraser: {
    id: "eraser",
    title: "Eraser Tool",
    body: [
      "When the eraser is active, click any note to delete it, or drag a box to delete multiple notes at once.",
      "Alternatively, you can right-click (or long-press) any note in normal mode to open the delete menu, or select notes and press the Delete key."
    ],
  },
  preview: {
    id: "preview",
    title: "Click-to-Hear (Preview)",
    body: [
      "When enabled, clicking on any painted note will immediately play its sound.",
      "This is useful for hunting down sour notes without having to play the entire loop."
    ],
  },
  loop: {
    id: "loop",
    title: "Looping & Playhead",
    body: [
      "Click anywhere on the top ruler to jump the playhead to that exact spot.",
      "Drag the gray flags on the ruler to set the loop area. (Shortcut: Alt-click to set the Loop Start, Shift-click to set the Loop End). The end flag also determines where the final rest will be placed when you export the melody."
    ],
  },
  history: {
    id: "history",
    title: "Undo & Redo",
    body: [
      "Mistakes happen! We track your edits in a lightweight, JSON-based memory stack.",
      "Use the Undo and Redo arrows to instantly step backward and forward through your note additions, deletions, and adjustments.",
    ],
  },
  playback: {
    id: "playback",
    title: "Playback & Navigation",
    body: [
      "Press the Spacebar at any time to toggle playback on and off.",
      "The playhead will loop between the two gray flags on the top ruler. Click the Rewind button to instantly jump back to the start of the loop.",
    ],
  },
  library: {
    id: "library",
    title: "Song Library",
    body: [
      "Open the Song dropdown to load a catalog melody onto the roll. Type or paste in the search field to filter titles.",
      "Yesterday has three options: v2 (working draft), v1 (homepage hero), and a Beatles MIDI arrangement. Tumbalalaika has two MIDI versions. Bei Mir Bist Du Schön is a lead sheet.",
    ],
  },
};

export function MidiLab() {
  const { audioContext, initializeAudio } = useSharedAudioContext();
  const { scheduleNote, waveType, setWaveType } = useAudioSynthesis(
    audioContext,
    () => {},
    []
  );
  const rollRef = useRef<PianoRollHandle>(null);
  const learnRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  
  const { selectedScale, setSelectedScale, isNoteInScale, allowOutOfScale, setAllowOutOfScale } = useScaleLogic();
  const hasScale = selectedScale !== "none";
  const lockToScale = hasScale && !allowOutOfScale;

  const [song, setSong] = useState<SongEntry>(getDefaultSong);
  const [bpm, setBpm] = useState(getDefaultSong().bpm);
  const [bars, setBars] = useState(songBars(getDefaultSong()));
  const [timeSig, setTimeSig] = useState<TimeSignature>(
    songTimeSignature(getDefaultSong()),
  );
  const rollView = song.document ? documentToRollView(song.document) : null;
  const meterOptions = COMMON_TIME_SIGNATURES.some(
    (sig) => sig[0] === timeSig[0] && sig[1] === timeSig[1],
  )
    ? COMMON_TIME_SIGNATURES
    : [timeSig, ...COMMON_TIME_SIGNATURES];
  const [playing, setPlaying] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [copied, setCopied] = useState<"code" | "json" | null>(null);
  const [selectedNote, setSelectedNote] = useState<SequenceEvent | null>(null);
  const [conceptId, setConceptId] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const stop = useCallback(() => {
    rollRef.current?.stop();
    setPlaying(false);
  }, []);

  const previewNote = useCallback((n: number) => {
    initializeAudio();
    if (!audioContext) return;
    scheduleNote(midiToHz(n), audioContext.currentTime, 0.25);
  }, [initializeAudio, audioContext, scheduleNote]);

  const handleNoteSelected = useCallback((ev: SequenceEvent | null) => {
    setSelectedNote(ev);
    if (ev && soundEnabled) {
      previewNote(ev.n);
    }
  }, [soundEnabled, previewNote]);

  useEffect(() => stop, [stop]);


  const togglePlay = useCallback(() => {
    if (playing) {
      stop();
      return;
    }
    // Creating/resuming the AudioContext here, inside the click handler,
    // is the user gesture browsers (and AGENTS.md) require.
    initializeAudio();
    if (!audioContext) return;
    rollRef.current?.play(audioContext, (ev) => {
      scheduleNote(midiToHz(ev.n), ev.t, ev.g - ev.t);
    });
    setPlaying(true);
  }, [playing, stop, initializeAudio, audioContext, scheduleNote]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input field (like BPM or Bars)
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.closest("[data-song-library]"))
      ) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault(); // Prevent page scroll
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay]);

  const flashCopied = (kind: "code" | "json") => {
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1600);
  };

  const copyCode = async () => {
    const result = rollRef.current?.getMelody();
    if (!result) return;
    await navigator.clipboard.writeText(melodyToCode(result));
    flashCopied("code");
  };

  const copyJson = async () => {
    const result = rollRef.current?.getMelody();
    if (!result) return;
    await navigator.clipboard.writeText(
      JSON.stringify({ bpm, events: result.events }, null, 2)
    );
    flashCopied("json");
  };

  const loadSong = (next: SongEntry) => {
    if (next.id === song.id) return;
    if (
      !window.confirm(
        `Load ${next.title}? Unsaved edits on the roll will be discarded.`,
      )
    ) {
      return;
    }
    stop();
    setSong(next);
    setBpm(next.bpm);
    setBars(songBars(next));
    setTimeSig(songTimeSignature(next));
    setSelectedNote(null);
    setCanUndo(false);
    setCanRedo(false);
    setConceptId("library");
  };

  const reset = () => {
    if (!window.confirm(`Discard all edits and reload ${song.title}?`))
      return;
    stop();
    rollRef.current?.reset();
    setBpm(song.bpm);
    setBars(songBars(song));
    setTimeSig(songTimeSignature(song));
    setSelectedNote(null);
  };
  
  const deleteSelected = () => {
    rollRef.current?.deleteSelected();
    setSelectedNote(null);
  };

  const showHowTo = () => {
    setConceptId("basics");
    learnRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-1 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight">Piano Roll</h1>
            <Badge variant="secondary">Beta</Badge>
          </div>
          <button
            type="button"
            className="text-xs text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground transition-colors"
            onClick={showHowTo}
            aria-controls="piano-roll-learn"
          >
            How do I use this?
          </button>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Paint notes on the roll, play them back, and copy the result when
          it&apos;s right. Click items below to learn how they work.
        </p>

        <div className="mt-8 overflow-x-auto rounded-md border border-border bg-card p-3 relative">
          <PianoRollEditor
            key={song.id}
            ref={rollRef}
            initialMelody={song.melody}
            initialSequence={rollView?.sequence}
            bpm={bpm}
            bars={bars}
            beatsPerBar={timeSig[0]}
            beatUnit={timeSig[1]}
            pitchMin={rollView?.pitchMin}
            pitchRange={rollView?.pitchRange}
            isDeleteMode={isDeleteMode}
            hasScale={hasScale}
            lockToScale={lockToScale}
            isNoteInScale={isNoteInScale}
            onPreviewNote={previewNote}
            onNoteSelected={handleNoteSelected}
            onHistoryChange={(undo, redo) => {
              setCanUndo(undo);
              setCanRedo(redo);
            }}
            className="min-h-[362px]"
          />

          {selectedNote && !isDeleteMode && (
            <div className="absolute top-4 right-4 bg-background border border-border rounded-md shadow-lg p-2 flex flex-col gap-2 z-10 w-40">
              <div className="text-xs font-medium text-muted-foreground px-1 pb-1 border-b border-border flex justify-between">
                <span>Selected Note</span>
                <span className="text-foreground">{midiToPitchName(selectedNote.n)}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8"
                onClick={deleteSelected}
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 relative">
          
          {/* Zoom D-Pad (outside canvas, floated right) */}
          <div className="absolute right-0 top-0 flex flex-col items-center gap-0.5 bg-card border border-border rounded-xl p-1 shadow-sm opacity-60 hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full hover:bg-muted" onClick={() => rollRef.current?.zoomY(1 / 1.25)} title="Zoom in vertically">
              <Plus className="h-3 w-3" />
            </Button>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full hover:bg-muted" onClick={() => rollRef.current?.zoomX(1.25)} title="Zoom out horizontally">
                <Minus className="h-3 w-3" />
              </Button>
              <div className="h-5 w-5 flex items-center justify-center" title="Zoom controls">
                <Search className="h-3 w-3 text-muted-foreground" />
              </div>
              <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full hover:bg-muted" onClick={() => rollRef.current?.zoomX(1 / 1.25)} title="Zoom in horizontally">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full hover:bg-muted" onClick={() => rollRef.current?.zoomY(1.25)} title="Zoom out vertically">
              <Minus className="h-3 w-3" />
            </Button>
          </div>

          <Button 
            onClick={() => {
              togglePlay();
              setConceptId(c => c === "playback" ? null : "playback");
            }}
          >
            {playing ? (
              <Square className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {playing ? "Stop" : "Play"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              rollRef.current?.rewind();
              setConceptId(c => c === "loop" ? null : "loop");
            }}
            aria-label="Rewind to start"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <div className="flex rounded-md border border-border bg-card overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              disabled={!canUndo}
              onClick={() => {
                rollRef.current?.undo();
                setConceptId("history");
              }}
              className="rounded-none border-r border-border"
              title="Undo"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={!canRedo}
              onClick={() => {
                rollRef.current?.redo();
                setConceptId("history");
              }}
              className="rounded-none"
              title="Redo"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>

          <SongLibrarySelect
            songs={SONGS}
            selectedId={song.id}
            onSelect={loadSong}
          />

          <label className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm">
            <span className="text-muted-foreground">BPM</span>
            <input
              type="number"
              min={40}
              max={200}
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value) || song.bpm)}
              className="w-16 rounded border border-border bg-background px-2 py-1 text-right font-mono text-sm outline-none"
            />
          </label>

          <label className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm">
            <span className="text-muted-foreground">Bars</span>
            <input
              type="number"
              min={1}
              max={256}
              value={bars}
              onChange={(e) => setBars(Number(e.target.value) || 8)}
              className="w-16 rounded border border-border bg-background px-2 py-1 text-right font-mono text-sm outline-none"
            />
          </label>

          <label
            className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm"
            onClick={() => setConceptId("meter")}
          >
            <span className="text-muted-foreground">Meter</span>
            <select
              value={formatTimeSignature(timeSig)}
              aria-label="Time signature"
              onChange={(e) => {
                setTimeSig(parseTimeSignature(e.target.value));
                setConceptId("meter");
              }}
              className="rounded border border-border bg-background px-2 py-1 font-mono text-sm outline-none"
            >
              {meterOptions.map((sig) => {
                const value = formatTimeSignature(sig);
                return (
                  <option key={value} value={value}>
                    {value}
                  </option>
                );
              })}
            </select>
          </label>

          <Button
            variant={soundEnabled ? "default" : "outline"}
            className={soundEnabled ? "bg-orange-600 hover:bg-orange-700 text-white" : ""}
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              setConceptId("preview");
            }}
            title="Toggle Click-to-Hear (Preview Note Sound)"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>

          <Button
            variant={isDeleteMode ? "default" : "outline"}
            className={isDeleteMode ? "bg-orange-600 hover:bg-orange-700 text-white" : ""}
            onClick={() => {
              setIsDeleteMode(!isDeleteMode);
              setConceptId("eraser");
            }}
            title="Toggle Eraser Tool"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <div className="flex flex-wrap items-center gap-2 sm:ml-auto mr-16">
            
            <div className="flex items-center gap-1 mr-2 bg-card rounded-md border border-input p-0.5">
              {(["sine", "square", "sawtooth", "triangle"] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWaveType(w)}
                  title={`Use ${w} wave`}
                  className={cn(
                    "p-1.5 rounded-sm transition-colors",
                    waveType === w 
                      ? "bg-secondary text-secondary-foreground" 
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <WaveGlyph type={w} />
                </button>
              ))}
            </div>

            <div className="mr-2">
              <ScaleSelector
                selectedScale={selectedScale}
                onScaleChange={setSelectedScale}
                allowOutOfScale={allowOutOfScale}
                onAllowOutOfScaleChange={setAllowOutOfScale}
                variant="shadcn"
              />
            </div>

            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button variant="outline" onClick={copyJson}>
              {copied === "json" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied === "json" ? "Copied" : "Copy JSON"}
            </Button>
            <Button onClick={copyCode}>
              {copied === "code" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied === "code" ? "Copied" : "Copy as MELODY"}
            </Button>
          </div>
        </div>

        {/* Learning area — shared, shows the last tool clicked */}
        <div
          id="piano-roll-learn"
          ref={learnRef}
          className="mt-8 scroll-mt-16"
        >
          <LearnPanel
            concept={
              conceptId === "meter"
                ? timeSignatureLesson(timeSig)
                : conceptId
                  ? MIDI_CONCEPTS[conceptId]
                  : null
            }
            onClose={() => setConceptId(null)}
          />
        </div>
      </div>
    </main>
  );
}
