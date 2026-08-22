"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Play, RotateCcw, SkipBack, Square } from "lucide-react";

import { BPM as DEFAULT_BPM, MELODY } from "@/components/home/heroTune";
import { useHeroAudio } from "@/components/home/useHeroAudio";
import { Button } from "@/components/ui/button";
import { melodyToCode, midiToHz } from "./melodyConvert";
import { PianoRollEditor, type PianoRollHandle } from "./PianoRollEditor";

export function MidiLab() {
  const { ensureContext, getContext, noteAt } = useHeroAudio();
  const rollRef = useRef<PianoRollHandle>(null);

  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState<"code" | "json" | null>(null);

  const stop = useCallback(() => {
    rollRef.current?.stop();
    setPlaying(false);
  }, []);

  useEffect(() => stop, [stop]);

  const togglePlay = () => {
    if (playing) {
      stop();
      return;
    }
    // Creating/resuming the AudioContext here, inside the click handler,
    // is the user gesture browsers (and AGENTS.md) require.
    ensureContext();
    const ctx = getContext();
    if (!ctx) return;
    rollRef.current?.play(ctx, (ev) => {
      noteAt(midiToHz(ev.n), ev.t, ev.g - ev.t);
    });
    setPlaying(true);
  };

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

  const reset = () => {
    if (!window.confirm("Discard all edits and reload the hero melody?"))
      return;
    stop();
    rollRef.current?.reset();
  };

  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="mb-1 text-sm font-medium text-muted-foreground">
          Dev tool
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">MIDI Lab</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Paint the melody on the roll, play it until it&apos;s right, then
          copy the result and paste it into the chat. Drag on empty space to
          draw a note; drag a note to move it, its edges to resize; right-click
          a note (or long-press) to delete; right-drag to select a region,{" "}
          <kbd className="rounded border border-border bg-card px-1 font-mono text-xs">
            Del
          </kbd>{" "}
          removes it. The gray flags mark the loop — the end flag also sets the
          final rest on export.
        </p>

        <div className="mt-8 overflow-x-auto rounded-md border border-border bg-card p-3">
          <PianoRollEditor
            ref={rollRef}
            initialMelody={MELODY}
            bpm={bpm}
            className="min-h-[362px]"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button onClick={togglePlay}>
            {playing ? (
              <Square className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {playing ? "Stop" : "Play"}
          </Button>
          <Button
            variant="outline"
            onClick={() => rollRef.current?.rewind()}
            aria-label="Rewind to start"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <label className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm">
            <span className="text-muted-foreground">BPM</span>
            <input
              type="number"
              min={40}
              max={200}
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value) || DEFAULT_BPM)}
              className="w-16 rounded border border-border bg-background px-2 py-1 text-right font-mono text-sm outline-none"
            />
          </label>

          <div className="ml-auto flex items-center gap-2">
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
      </div>
    </main>
  );
}
