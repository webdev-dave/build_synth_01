# ToDo — Piano Roll

Local list for `/piano-roll`. Site-wide ranking stays in [ToDo.md](ToDo.md).
Update this file when a roll item ships, blocks, or gets a new next slice.

**Default song:** `yesterday-beatles` (full MIDI arrangement).

---

## Next (immediate)

| # | Item | Status | Next slice |
|---|------|--------|------------|
| 1 | **Transpose updates the scale** | **Doing / just shipped.** | −1 / +1 moves notes *and* the Scale dropdown root (C major → C# major). Mode stays. If scale is `none`, leave it — do not invent a key. |
| 2 | **Pan when the song is bigger than the view** | **Partial.** | Wheel already pans Y. Trackpad swipe pans X. **Shift+wheel** now pans X for mouse users. No classic scrollbars (see below). Follow-up: Space+drag or a “hand” tool if people still get lost. |
| 3 | **Track picker** | Open | Full arrangements dump every pitched track on one roll. Let the user solo melody / hide accompaniment. |
| 4 | **Open a local `.mid`** | Open | In-app file picker → same ingest path (`SongDocument` → roll). Phase 0 of the library plan. |
| 5 | **Meter vs playback honesty** | Open | 3/8 (Bei Mir) and other odd meters: confirm bar lines + clock after the tempo-compensation fix. First tempo only — tempo maps still flatten. |
| 6 | **How-to / learn copy** | Open | Keep the Learn panel honest as gestures change (pan vs zoom vs transpose). |

---

## Overflow: scrollbars or not?

The roll is a **camera** (`xoffset` / `yoffset`) over a virtual grid, not a
tall/wide DOM page. Native overflow bars would not move that camera unless we
faked them.

**What works today**

- **Wheel** — pan up/down through the keyboard
- **Shift+wheel** — pan left/right through time (mouse)
- **Trackpad** — two-finger swipe pans both axes (`deltaX` + `deltaY`)
- **Ctrl/Cmd+wheel** — zoom time
- **+/− zoom buttons** — time and pitch

**Recommendation:** skip visible scrollbar chrome for now. Extra bars fight
the canvas and the playhead. Gestures + the existing zoom buttons are enough
if we tell people Shift+wheel exists. Revisit overlay scrollbars only if
users still cannot reach the end of a long song or the top of the range.

---

## Later

- Undo/redo already exists; confirm it covers transpose + scale changes as one
  gesture or two (notes vs dropdown).
- Loop flags vs full-song length on 80-bar MIDI.
- Export `.mid` back out.
- Next FreeSheetMusic.net pages (Irish, Celtic, …) — see
  `.cursor/rules/midi-ingest.mdc`. Do not re-ingest the klezmer listing.
- Homepage hero still plays Yesterday **v1**; that is [ToDo.md](ToDo.md)
  rank 3, not this file.

---

## Pointers

| What | Where |
|------|--------|
| Editor + wheel/zoom | `src/components/midi/PianoRollEditor.tsx` |
| Lab chrome, scale, transpose | `src/components/midi/MidiLab.tsx` |
| Catalog / default song | `src/lib/songs/library.ts` |
| Ingest | `.cursor/rules/midi-ingest.mdc` |
| Library product plan | `docs/plans/self-hosted-midi-library.md` |
