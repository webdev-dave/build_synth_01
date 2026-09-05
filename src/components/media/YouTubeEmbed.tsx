"use client";

/**
 * Reusable inline YouTube player — keeps the user on our page instead of
 * bouncing them to youtube.com. Drop it anywhere a video should play in place
 * (history articles, lessons, genre pages, …).
 *
 * Uses the IFrame Player API (privacy-friendly `youtube-nocookie` host) rather
 * than a bare autoplay iframe, so players can cooperate: see
 * `youtubeConductor.ts`. The rule is "one song at a time" —
 *
 *   • On open, a player autoplays only if nothing else is already playing;
 *     otherwise it loads paused so two songs never start at once.
 *   • When it actually starts playing, it pauses whatever else was sounding —
 *     honoring the user's deliberate choice to hear this one.
 *
 * The container is a block-level <span>, not a <div>, so it stays valid
 * phrasing content when embedded inside a paragraph (e.g. an inline song menu).
 */
import { useEffect, useRef } from "react";

import {
  anyPlaying,
  pauseOthers,
  registerPlayer,
  type ManagedPlayer,
} from "./youtubeConductor";

/** Minimal shape of the bits of the IFrame API we touch (no @types dep). */
interface YTPlayer {
  pauseVideo: () => void;
  playVideo: () => void;
  stopVideo: () => void;
  destroy: () => void;
  getIframe: () => HTMLIFrameElement;
}
type YTNamespace = {
  Player: new (el: Element, opts: unknown) => YTPlayer;
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
};

// Load the IFrame API script exactly once per page, shared by every embed.
let apiPromise: Promise<YTNamespace> | null = null;
function loadYouTubeApi(): Promise<YTNamespace> {
  const w = window as unknown as {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  };
  if (w.YT?.Player) return Promise.resolve(w.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<YTNamespace>((resolve) => {
    const prev = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(w.YT as YTNamespace);
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiPromise;
}

export function YouTubeEmbed({
  videoId,
  title,
  autoplay = false,
}: {
  videoId: string;
  /** Accessible title for the player iframe. */
  title?: string;
  /**
   * Request playback on open. Honored only if no other player is currently
   * playing — see the conductor. Pass this only in response to a user click.
   */
  autoplay?: boolean;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let player: YTPlayer | null = null;
    let iframe: HTMLIFrameElement | null = null;
    let cancelled = false;

    // Tracked by the conductor; `playing` is kept current by state events and
    // `pause` lets other players silence us when they take the stage.
    const managed: ManagedPlayer = {
      playing: false,
      pause: () => player?.pauseVideo(),
    };
    const unregister = registerPlayer(managed);

    // YT replaces its target element with the <iframe>. Build that target
    // imperatively so React never tries to reconcile a node YT has swapped.
    const target = document.createElement("span");
    container.appendChild(target);

    loadYouTubeApi().then((YT) => {
      if (cancelled) return;

      // Decide autoplay *now*, when the conductor's state is known: only start
      // on our own if the stage is quiet.
      const shouldAutoplay = autoplay && !anyPlaying(managed);

      player = new YT.Player(target, {
        host: "https://www.youtube-nocookie.com",
        videoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          autoplay: shouldAutoplay ? 1 : 0,
        },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            iframe = e.target.getIframe();
            iframe.title = title ?? "YouTube video player";
            iframe.allow =
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
          },
          onStateChange: (e: { data: number }) => {
            if (e.data === YT.PlayerState.PLAYING) {
              managed.playing = true;
              // The user chose to hear this one — quiet everything else.
              pauseOthers(managed);
            } else if (
              e.data === YT.PlayerState.PAUSED ||
              e.data === YT.PlayerState.ENDED
            ) {
              managed.playing = false;
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      unregister();
      // Deliberately DON'T call player.destroy(): the IFrame API's destroy()
      // clears the *shared* global message handlers, which silences and freezes
      // any OTHER player still playing on the page (closing one song's panel
      // used to break a second song mid-playback). Stopping this player and
      // removing its iframe takes it out of the DOM and kills its audio without
      // that side effect. The orphaned player object is a negligible leak.
      try {
        player?.stopVideo();
      } catch {
        // player may not be ready yet — nothing to stop.
      }
      // Remove whichever node is live: the API-swapped iframe, else our target.
      (iframe ?? target).remove();
    };
  }, [videoId, autoplay, title]);

  return (
    <span
      ref={containerRef}
      className="relative block aspect-video w-full overflow-hidden rounded-md border bg-black [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full"
    />
  );
}
