"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Play, Square } from "lucide-react";

import {
  BPM as DEFAULT_BPM,
  CHORDS,
  MELODY,
  NOTES,
  type MelodyEvent,
  type NoteName,
} from "@/components/home/heroTune";
import { useHeroAudio } from "@/components/home/useHeroAudio";
import { Button } from "@/components/ui/button";

/* One event per line: "D4 0.5 Yes-" or "rest 1". Lines starting with #
   are comments. */
const serialize = (events: MelodyEvent[]) =>
  events
    .map((ev) =>
      ev.note
        ? `${ev.note} ${ev.beats}${ev.lyric ? ` ${ev.lyric}` : ""}`
        : `rest ${ev.beats}`
    )
    .join("\n");

type ParseResult = { events: MelodyEvent[]; errors: string[] };

const parseScore = (text: string): ParseResult => {
  const events: MelodyEvent[] = [];
  const errors: string[] = [];
  text.split("\n").forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const [noteTok, beatsTok, ...lyricParts] = trimmed.split(/\s+/);
    const beats = Number(beatsTok);
    if (!beatsTok || Number.isNaN(beats) || beats <= 0) {
      errors.push(`Line ${i + 1}: beats must be a positive number`);
      return;
    }
    if (noteTok.toLowerCase() === "rest") {
      events.push({ note: null, beats });
      return;
    }
    if (!(noteTok in NOTES)) {
      errors.push(
        `Line ${i + 1}: unknown note "${noteTok}" — use C4…C5 (sharps like F#4) or "rest"`
      );
      return;
    }
    events.push({
      note: noteTok as NoteName,
      beats,
      lyric: lyricParts.join(" ") || undefined,
    });
  });
  return { events, errors };
};

const toCode = (events: MelodyEvent[]) =>
  `export const MELODY: MelodyEvent[] = [\n${events
    .map((ev) =>
      ev.note
        ? `  { note: "${ev.note}", beats: ${ev.beats}${
            ev.lyric ? `, lyric: "${ev.lyric}"` : ""
          } },`
        : `  { note: null, beats: ${ev.beats} },`
    )
    .join("\n")}\n];`;

export function MelodyLab() {
  const { ensureContext, noteOn, chordOn } = useHeroAudio();

  const [text, setText] = useState(() => serialize(MELODY));
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [loop, setLoop] = useState(true);
  const [withChords, setWithChords] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(-1);
  const [copied, setCopied] = useState(false);

  const { events, errors } = useMemo(() => parseScore(text), [text]);

  const timers = useRef<number[]>([]);
  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const stop = useCallback(() => {
    clearTimers();
    setPlaying(false);
    setCurrent(-1);
  }, []);

  useEffect(() => stop, [stop]);

  const play = () => {
    if (playing) {
      stop();
      return;
    }
    if (errors.length || events.length === 0) return;
    ensureContext();
    setPlaying(true);

    const beatSec = 60 / bpm;
    const scheduleLoop = (offsetMs: number) => {
      let t = 0;
      events.forEach((ev, idx) => {
        const atMs = offsetMs + t * beatSec * 1000;
        timers.current.push(
          window.setTimeout(() => {
            setCurrent(idx);
            if (ev.note) noteOn(NOTES[ev.note].hz, ev.beats * beatSec);
          }, atMs)
        );
        t += ev.beats;
      });
      if (withChords) {
        for (const chord of CHORDS) {
          timers.current.push(
            window.setTimeout(
              () => chordOn(chord.hz, chord.beats * beatSec),
              offsetMs + chord.at * beatSec * 1000
            )
          );
        }
      }
      const totalMs = t * beatSec * 1000;
      timers.current.push(
        window.setTimeout(
          () => (loop ? scheduleLoop(0) : stop()),
          offsetMs + totalMs + (loop ? 0 : 600)
        )
      );
    };
    scheduleLoop(120);
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(toCode(events));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <p className="mb-1 text-sm font-medium text-muted-foreground">
          Dev tool
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Melody Lab</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          One note per line: <code className="font-mono">note beats lyric</code>{" "}
          — e.g. <code className="font-mono">D4 0.5 Yes-</code> or{" "}
          <code className="font-mono">rest 1</code>. Notes range C4–C5, sharps
          written like F#4. Edit, press play, and when it sounds right, copy the
          result and paste it into the chat.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_260px]">
          {/* Score editor */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            rows={24}
            className="w-full resize-y rounded-md border border-border bg-card p-4 font-mono text-sm leading-6 text-foreground outline-none focus:ring-1 focus:ring-ring"
            aria-label="Melody score"
          />

          {/* Controls */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Button onClick={play} disabled={errors.length > 0}>
                {playing ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {playing ? "Stop" : "Play"}
              </Button>
              <Button variant="outline" onClick={copyCode}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied" : "Copy result"}
              </Button>
            </div>

            <label className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm">
              <span className="text-muted-foreground">Tempo (BPM)</span>
              <input
                type="number"
                min={40}
                max={200}
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value) || DEFAULT_BPM)}
                className="w-16 rounded border border-border bg-background px-2 py-1 text-right font-mono text-sm outline-none"
              />
            </label>
            <label className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm">
              <span className="text-muted-foreground">Loop</span>
              <input
                type="checkbox"
                checked={loop}
                onChange={(e) => setLoop(e.target.checked)}
                className="h-4 w-4 accent-foreground"
              />
            </label>
            <label className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm">
              <span className="text-muted-foreground">Chord pad</span>
              <input
                type="checkbox"
                checked={withChords}
                onChange={(e) => setWithChords(e.target.checked)}
                className="h-4 w-4 accent-foreground"
              />
            </label>

            {errors.length > 0 && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
                {errors.map((e) => (
                  <p key={e}>{e}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live note trail — the sounding note lights up so you can name
            exactly which one is off ("the note on 'so' is wrong") */}
        <div className="mt-8 flex flex-wrap gap-1.5">
          {events.map((ev, i) => (
            <span
              key={i}
              className={`rounded border px-2 py-1 font-mono text-xs transition-colors ${
                i === current
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              {ev.note ?? "·"}
              {ev.lyric && (
                <span className="ml-1 opacity-70">{ev.lyric}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
