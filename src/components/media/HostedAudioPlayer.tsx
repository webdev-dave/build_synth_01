"use client";

/**
 * Player for an audio file we host ourselves.
 *
 * The click is the consent: nothing loads until Play. While it sounds, the
 * page's one-song rule (`youtubeConductor`) pauses any other player — a
 * YouTube chip or another file — so two recordings never run together.
 *
 * Use this whenever the file is ours (`/audio/…`). A one-shot word clip
 * stays `PronounceButton`; a YouTube recording stays `CollapsibleVideo`.
 */
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  pauseOthers,
  registerPlayer,
  type ManagedPlayer,
} from "./youtubeConductor";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const m = Math.floor(whole / 60);
  const s = whole % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function HostedAudioPlayer({
  src,
  label,
  className,
}: {
  /** Path under `public/`, e.g. `/audio/songs/….mp3`. */
  src: string;
  /** Who is singing, and when — shown beside the control. */
  label: string;
  className?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const managedRef = useRef<ManagedPlayer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const managed: ManagedPlayer = {
      playing: false,
      pause: () => audioRef.current?.pause(),
    };
    managedRef.current = managed;
    const unregister = registerPlayer(managed);
    return () => {
      unregister();
      audioRef.current?.pause();
      audioRef.current = null;
      managedRef.current = null;
    };
  }, []);

  function element(): HTMLAudioElement {
    let el = audioRef.current;
    if (el) return el;
    el = new Audio(src);
    el.preload = "none";
    el.onplay = () => {
      const managed = managedRef.current;
      if (managed) {
        managed.playing = true;
        pauseOthers(managed);
      }
      setPlaying(true);
    };
    el.onpause = () => {
      if (managedRef.current) managedRef.current.playing = false;
      setPlaying(false);
    };
    el.onended = () => {
      if (managedRef.current) managedRef.current.playing = false;
      setPlaying(false);
    };
    el.ontimeupdate = () => setCurrent(el.currentTime);
    el.onloadedmetadata = () => setDuration(el.duration);
    el.onerror = () => setPlaying(false);
    audioRef.current = el;
    return el;
  }

  function toggle() {
    const el = element();
    if (el.paused) void el.play().catch(() => setPlaying(false));
    else el.pause();
  }

  function seek(next: number) {
    const el = element();
    el.currentTime = next;
    setCurrent(next);
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-muted/30 px-3 py-2.5",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? `Pause ${label}` : `Play ${label}`}
          className={cn(
            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-accent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            playing && "text-emerald-600",
          )}
        >
          {playing ? (
            <Pause className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <Play className="h-3.5 w-3.5 translate-x-px" aria-hidden />
          )}
        </button>
        <p className="min-w-0 flex-1 text-base leading-snug text-foreground">
          {label}
        </p>
        <p className="shrink-0 font-mono text-base tabular-nums text-muted-foreground">
          {formatTime(current)}
          <span className="px-1 text-border">/</span>
          {formatTime(duration)}
        </p>
      </div>
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={Math.min(current, duration || 0)}
        aria-label={`Seek ${label}`}
        aria-valuetext={formatTime(current)}
        disabled={!duration}
        onChange={(e) => seek(Number(e.target.value))}
        className="mt-2 h-1 w-full cursor-pointer appearance-none rounded-full bg-border accent-foreground disabled:cursor-default disabled:opacity-50"
      />
    </div>
  );
}
