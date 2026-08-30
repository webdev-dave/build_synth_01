import {
  Home,
  Piano,
  Music,
  createLucideIcon,
  type LucideIcon,
} from "lucide-react";

/**
 * Custom harmonica icon, built with Lucide's factory so it matches Lucide's
 * stroke style/sizing. Lucide (and Unicode emoji) ship no harmonica glyph.
 * Depicts a diatonic harp: cover-plate body with a row of hole slots.
 */
const Harmonica: LucideIcon = createLucideIcon("Harmonica", [
  ["rect", { x: "2", y: "8", width: "20", height: "8", rx: "2", key: "body" }],
  ["path", { d: "M2 11h20", key: "seam" }],
  ["path", { d: "M5.5 12.5v2", key: "h1" }],
  ["path", { d: "M8.2 12.5v2", key: "h2" }],
  ["path", { d: "M10.9 12.5v2", key: "h3" }],
  ["path", { d: "M13.6 12.5v2", key: "h4" }],
  ["path", { d: "M16.3 12.5v2", key: "h5" }],
  ["path", { d: "M19 12.5v2", key: "h6" }],
]);

/**
 * Custom drum-machine icon in Lucide's style. Depicts a modern groovebox /
 * MPC-style unit: a landscape body with two control knobs and a small display
 * along the top, and a row of four velocity-sensitive trigger pads below —
 * deliberately NOT an acoustic drum kit.
 */
const DrumMachine: LucideIcon = createLucideIcon("DrumMachine", [
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "body" }],
  ["circle", { cx: "6", cy: "8", r: "1.25", key: "knob1" }],
  ["circle", { cx: "10", cy: "8", r: "1.25", key: "knob2" }],
  ["rect", { x: "13.5", y: "6.5", width: "6", height: "3", rx: "0.5", key: "display" }],
  ["rect", { x: "4", y: "12.5", width: "3", height: "4", rx: "0.6", key: "pad1" }],
  ["rect", { x: "8", y: "12.5", width: "3", height: "4", rx: "0.6", key: "pad2" }],
  ["rect", { x: "12", y: "12.5", width: "3", height: "4", rx: "0.6", key: "pad3" }],
  ["rect", { x: "16", y: "12.5", width: "3", height: "4", rx: "0.6", key: "pad4" }],
]);

/**
 * Custom piano-roll icon: a landscape editor with a keyboard strip on the
 * left and note bars on the right. Distinct from the synth's `Piano` glyph.
 */
const PianoRoll: LucideIcon = createLucideIcon("PianoRoll", [
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "body" }],
  ["path", { d: "M8 4v16", key: "divider" }],
  ["path", { d: "M2 8h6", key: "key1" }],
  ["path", { d: "M2 12h6", key: "key2" }],
  ["path", { d: "M2 16h6", key: "key3" }],
  ["rect", { x: "10", y: "6.5", width: "6", height: "2", rx: "0.5", key: "note1" }],
  ["rect", { x: "13", y: "11", width: "7", height: "2", rx: "0.5", key: "note2" }],
  ["rect", { x: "10", y: "15.5", width: "5", height: "2", rx: "0.5", key: "note3" }],
]);

/**
 * Maps a nav/app id (see NAV_ITEMS in navigation.ts) to a Lucide icon.
 * Shared by the global nav and the homepage app grid so icons stay consistent.
 */
export const APP_ICONS: Record<string, LucideIcon> = {
  home: Home,
  synth: Piano,
  "harmonica-lab": Harmonica,
  "piano-roll": PianoRoll,
  "drum-machine": DrumMachine,
};

export function getAppIcon(id: string): LucideIcon {
  return APP_ICONS[id] ?? Music;
}
