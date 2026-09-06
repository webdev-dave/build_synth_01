"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "motion/react";
import { Check, Copy, Eraser, Pencil, Play, RotateCcw, SkipBack, Square, Trash2, Volume2, VolumeX, Undo2, Redo2, Search, Plus, Minus } from "lucide-react";

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
  getSong,
  resolveSongEntry,
  songNeedsCatalog,
  SONGS,
  songBars,
  songTimeSignature,
  type SongEntry,
} from "@/lib/songs";
import { useSharedAudioContext } from "@/hooks/useSharedAudioContext";
import { useAudioSynthesis } from "@/instruments/synth/templates/basic-synth/hooks/useAudioSynthesis";
import { WaveGlyph } from "@/instruments/synth/v2/SynthV2";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { melodyToCode, midiToHz, detectKey, melodyToSequence } from "./melodyConvert";
import { PianoRollEditor, type PianoRollHandle } from "./PianoRollEditor";
import { type SequenceEvent } from "./melodyConvert";
import { SongLibrarySelect } from "./SongLibrarySelect";
import { GenrePills } from "@/components/content/GenrePills";

import { LearnPanel, type LearnPanelConcept } from "@/components/learn/LearnPanel";
import { useScaleLogic, type ScaleCombination } from "@/instruments/synth/templates/basic-synth/hooks/useScaleLogic";
import { ScaleSelector } from "@/components/music/ScaleSelector";

const PITCH_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const MIDI_CONCEPTS: Record<string, LearnPanelConcept> = {
  basics: {
    id: "basics",
    title: "Piano Roll Basics",
    body: [
      "Edit starts off so a swipe on a phone doesn't paint notes. You can still see the notes, press Play, and watch the playhead — Edit only locks painting. Turn it on when you want to paint, move, or erase.",
      "With Edit on: drag empty space to draw a note, drag a painted note to move it, or drag its edges to change duration. On a mouse, click a note (or right-click) to open its menu. On a phone, hold the note for a moment.",
      "The roll is a camera over the grid, not a page with scrollbars. Wheel pans up and down; Shift+wheel (or a sideways trackpad swipe) pans left and right. Ctrl/Cmd+wheel zooms.",
    ],
  },
  delete: {
    id: "delete",
    title: "Deleting notes",
    body: [
      "Two ways, both need Edit on. Select notes (click one, or drag a box) then hit the trash button — or the Delete key — to remove them.",
      "Or turn on the eraser (the second icon): the cursor becomes a trash can and any note you click, tap, or drag over is deleted. Click the eraser again to turn it off.",
      "You can also click a note on a mouse, or hold it on a phone, to open its menu and Delete just that one.",
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
  edit: {
    id: "edit",
    title: "Edit",
    body: [
      "Edit is the roll's write switch — not the same as Scale lock. Scale lock only limits which pitches sound; Edit decides whether the grid accepts paint, moves, and erases at all.",
      "It starts off so scrolling a phone doesn't drop stray notes. Play, the moving playhead, and the notes themselves still work — Edit off is listen mode. Turn it on when you mean to change the MIDI.",
    ],
  },
  library: {
    id: "library",
    title: "Song Library",
    body: [
      "Open the Song dropdown to load a catalog melody onto the roll. Type or paste in the search field to filter titles.",
      "Yesterday has three options (labels: pop, rock, folk). Search jewish / klezmer / yiddish for the FreeSheetMusic.net klezmer page. Search blues for MidKar (old page + Wayne's Chicago/Delta/Texas venue) and pdmusic.org 1850–1923. Type a title, label, or original filename to filter. Same .mid is stored once; a different file of the same title is a named version. MIDI/KAR lyrics stay on the song document.",
    ],
  },
};

export function MidiLab({ songId }: { songId?: string }) {
  const router = useRouter();
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

  const initialSong = (songId && getSong(songId)) || getDefaultSong();
  // A catalog song (like the default Beatles MIDI) must still be fetched —
  // only a bundled song counts as already applied at mount.
  const appliedKeyRef = useRef<string | null>(
    songId || songNeedsCatalog(initialSong) ? null : initialSong.id,
  );
  const [song, setSong] = useState<SongEntry>(initialSong);
  const [loadingTitle, setLoadingTitle] = useState<string | null>(
    songNeedsCatalog(initialSong) ? initialSong.title : null,
  );
  const loadGen = useRef(0);
  const [bpm, setBpm] = useState(initialSong.bpm);
  const [bars, setBars] = useState(songBars(initialSong));
  const [timeSig, setTimeSig] = useState<TimeSignature>(
    songTimeSignature(initialSong),
  );
  const rollView = song.document ? documentToRollView(song.document) : null;
  const meterOptions = COMMON_TIME_SIGNATURES.some(
    (sig) => sig[0] === timeSig[0] && sig[1] === timeSig[1],
  )
    ? COMMON_TIME_SIGNATURES
    : [timeSig, ...COMMON_TIME_SIGNATURES];
  const [playing, setPlaying] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [editsEnabled, setEditsEnabled] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [showEditHint, setShowEditHint] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [copied, setCopied] = useState<"code" | "json" | null>(null);
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
    if (ev && soundEnabled) {
      previewNote(ev.n);
    }
  }, [soundEnabled, previewNote]);

  const handleEditBlocked = useCallback(() => {
    setShowEditHint(true);
    setConceptId("edit");
  }, []);

  const deleteSelected = useCallback(() => {
    if (!editsEnabled) {
      handleEditBlocked();
      return;
    }
    rollRef.current?.deleteSelected();
    setConceptId("delete");
  }, [editsEnabled, handleEditBlocked]);

  const toggleEraser = useCallback(() => {
    if (!editsEnabled) {
      handleEditBlocked();
      return;
    }
    setIsDeleteMode((v) => !v);
    setConceptId("delete");
  }, [editsEnabled, handleEditBlocked]);

  useEffect(() => {
    if (!showEditHint) return;
    const t = window.setTimeout(() => setShowEditHint(false), 4500);
    return () => window.clearTimeout(t);
  }, [showEditHint]);

  useEffect(() => {
    if (editsEnabled) setShowEditHint(false);
    else setIsDeleteMode(false);
  }, [editsEnabled]);

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

  const transposeNotesAndScale = useCallback(
    (semitones: number) => {
      rollRef.current?.transpose(semitones);
      if (selectedScale === "none") return;
      const [root, type] = selectedScale.split(" ");
      const i = PITCH_NAMES.indexOf(root);
      if (i < 0) return;
      const nextRoot = PITCH_NAMES[(i + semitones + 120) % 12];
      setSelectedScale(`${nextRoot} ${type}` as ScaleCombination);
    },
    [selectedScale, setSelectedScale],
  );

  const handleScaleChange = useCallback((newScale: ScaleCombination) => {
    if (selectedScale !== "none" && newScale !== "none") {
       const oldRoot = PITCH_NAMES.indexOf(selectedScale.split(" ")[0]);
       const newRoot = PITCH_NAMES.indexOf(newScale.split(" ")[0]);
       let diff = newRoot - oldRoot;
       // Shortest path transposition
       if (diff > 6) diff -= 12;
       if (diff < -6) diff += 12;
       if (diff !== 0) {
          rollRef.current?.transpose(diff);
       }
    }
    setSelectedScale(newScale);
  }, [selectedScale, setSelectedScale]);

  const applySong = useCallback(
    (next: SongEntry) => {
      appliedKeyRef.current = next.id;
      setSong(next);
      setBpm(next.bpm);
      setBars(songBars(next));
      setTimeSig(songTimeSignature(next));
      setCanUndo(false);
      setCanRedo(false);
      const nextSeq = next.document
        ? documentToRollView(next.document)?.sequence || []
        : melodyToSequence(next.melody);
      const detected = detectKey(nextSeq);
      if (detected !== "unknown") {
        setSelectedScale(detected);
        setAllowOutOfScale(true);
      } else {
        setSelectedScale("none");
      }
    },
    [setAllowOutOfScale, setSelectedScale],
  );

  useEffect(() => {
    const target = songId ? getSong(songId) : getDefaultSong();
    if (!target) return;
    if (appliedKeyRef.current === target.id) return;

    stop();
    const gen = ++loadGen.current;
    if (songNeedsCatalog(target)) setLoadingTitle(target.title);
    void resolveSongEntry(target)
      .then((loaded) => {
        if (gen !== loadGen.current) return;
        applySong(loaded);
      })
      .catch((err: unknown) => {
        if (gen !== loadGen.current) return;
        const message = err instanceof Error ? err.message : "unknown error";
        window.alert(`Could not load ${target.title}. ${message}`);
      })
      .finally(() => {
        if (gen === loadGen.current) setLoadingTitle(null);
      });
  }, [songId, applySong, stop]);

  const loadSong = (next: SongEntry) => {
    if (next.id === song.id || loadingTitle) return;
    if (
      !window.confirm(
        `Load ${next.title}? Unsaved edits on the roll will be discarded.`,
      )
    ) {
      return;
    }
    stop();
    setConceptId("library");
    const gen = ++loadGen.current;
    setLoadingTitle(next.title);
    void resolveSongEntry(next)
      .then((loaded) => {
        if (gen !== loadGen.current) return;
        applySong(loaded);
        router.replace(`/piano-roll/${loaded.id}`);
      })
      .catch((err: unknown) => {
        if (gen !== loadGen.current) return;
        const message = err instanceof Error ? err.message : "unknown error";
        window.alert(`Could not load ${next.title}. ${message}`);
      })
      .finally(() => {
        if (gen === loadGen.current) setLoadingTitle(null);
      });
  };

  const reset = () => {
    if (!window.confirm(`Discard all edits and reload ${song.title}?`))
      return;
    stop();
    rollRef.current?.reset();
    setBpm(song.bpm);
    setBars(songBars(song));
    setTimeSig(songTimeSignature(song));
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
          <div className="relative mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="h-8"
              onClick={() => {
                togglePlay();
                setConceptId((c) => (c === "playback" ? null : "playback"));
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
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                rollRef.current?.rewind();
                setConceptId((c) => (c === "loop" ? null : "loop"));
              }}
              title="Rewind to the start of the loop"
              aria-label="Rewind to the start of the loop"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            </div>
            <div className="flex items-center gap-2">
            {/* Delete cluster: trash removes the selection; eraser arms the
                trash-cursor so any note you click/touch is deleted. */}
            <div className="flex overflow-hidden rounded-md border border-border bg-card">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none border-r border-border"
                disabled={editsEnabled && selectedCount === 0}
                onClick={deleteSelected}
                title={
                  !editsEnabled
                    ? "Turn on Edit to delete notes"
                    : selectedCount > 0
                      ? `Delete ${selectedCount} selected note${selectedCount > 1 ? "s" : ""} (Del)`
                      : "Select a note to delete"
                }
                aria-label="Delete selected notes"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-none",
                  isDeleteMode && "bg-orange-600 text-white hover:bg-orange-700 hover:text-white",
                )}
                onClick={toggleEraser}
                title={
                  !editsEnabled
                    ? "Turn on Edit to use the eraser"
                    : isDeleteMode
                      ? "Eraser on — click notes to delete. Click to turn off"
                      : "Eraser — click notes to delete them"
                }
                aria-label="Toggle eraser (delete notes on click)"
                aria-pressed={isDeleteMode}
              >
                <Eraser className="h-4 w-4" />
              </Button>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={editsEnabled}
              aria-label={
                editsEnabled
                  ? "Edit is on. Notes can be painted and moved."
                  : "Edit is off. Turn on to paint or move notes."
              }
              title={
                editsEnabled
                  ? "Edit on — paint and move notes"
                  : "Edit off — listen: play and watch, no painting"
              }
              onClick={() => {
                setEditsEnabled((v) => !v);
                setConceptId("edit");
              }}
              className={cn(
                "inline-flex h-8 items-center gap-2 rounded-md border bg-background px-2.5 text-xs font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                editsEnabled
                  ? "border-emerald-600/50 text-foreground"
                  : "border-border text-muted-foreground",
              )}
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Edit</span>
              <span
                aria-hidden="true"
                className={cn(
                  "flex h-4 w-7 items-center rounded-full p-0.5 transition-colors",
                  editsEnabled ? "bg-emerald-600" : "bg-muted",
                )}
              >
                <span
                  className={cn(
                    "h-3 w-3 rounded-full bg-white transition-transform",
                    editsEnabled ? "translate-x-3" : "translate-x-0",
                  )}
                />
              </span>
            </button>
            </div>
            {showEditHint && !editsEnabled && (
              <div
                role="status"
                className="absolute right-0 top-10 z-20 w-64 rounded-md border border-orange-700/50 bg-background p-3 shadow-lg"
              >
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Turn on <span className="font-medium text-foreground">Edit</span> to
                  paint or move notes. Dragging still pans the roll.
                </p>
                <Button
                  size="sm"
                  className="mt-2 h-7 text-xs"
                  onClick={() => {
                    setEditsEnabled(true);
                    setConceptId("edit");
                  }}
                >
                  Turn on Edit
                </Button>
              </div>
            )}
          </div>
          <PianoRollEditor
            // The roll seeds its notes once, at mount. Include the document
            // state so the async catalog load (same id) remounts it seeded.
            key={song.document ? `${song.id}:doc` : song.id}
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
            allowEdits={editsEnabled}
            onPreviewNote={previewNote}
            onNoteSelected={handleNoteSelected}
            onSelectionChange={setSelectedCount}
            onEditBlocked={handleEditBlocked}
            onHistoryChange={(undo, redo) => {
              setCanUndo(undo);
              setCanRedo(redo);
            }}
            className="min-h-[362px]"
          />
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
          <GenrePills slugs={song.labels} compact />
          {loadingTitle && (
            <span className="font-mono text-xs text-muted-foreground">
              Loading {loadingTitle}…
            </span>
          )}

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
                onScaleChange={handleScaleChange}
                allowOutOfScale={allowOutOfScale}
                onAllowOutOfScaleChange={setAllowOutOfScale}
                variant="shadcn"
              />
            </div>
            
            <div className="flex items-center gap-1 bg-card rounded-md border border-input p-0.5 mr-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                onClick={() => transposeNotesAndScale(-1)}
                title="Transpose down one semitone (updates the scale)"
              >
                -1
              </Button>
              <div className="text-xs text-muted-foreground uppercase font-semibold px-1">Transpose</div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                onClick={() => transposeNotesAndScale(1)}
                title="Transpose up one semitone (updates the scale)"
              >
                +1
              </Button>
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
