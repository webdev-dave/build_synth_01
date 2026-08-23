import { ImageResponse } from "next/og";

// Shared social-preview card (Open Graph + Twitter). Rendered to a static PNG
// at build time so it ships with the static export. Mirrors the brand mark:
// the Lucide `AudioLines` waveform + "Instrumaps" wordmark on near-black.
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_ALT = "Instrumaps — interactive music-theory tools";

// The nav/favicon brand mark, inlined as an SVG data URI so the static build
// needs no network fetch.
const WAVEFORM = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fafafa" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg>`,
)}`;

// Square brand icon (dark background + centered waveform) used for the PWA
// manifest icons. Rendered to static PNGs at build time.
export function brandSquareIcon(px: number): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={WAVEFORM} width={Math.round(px * 0.66)} height={Math.round(px * 0.66)} alt="" />
      </div>
    ),
    { width: px, height: px },
  );
}

export function brandOgImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          background: "#0a0a0a",
          color: "#fafafa",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={WAVEFORM} width={132} height={132} alt="" />
          <div style={{ fontSize: 116, fontWeight: 700, letterSpacing: -2 }}>
            Instrumaps
          </div>
        </div>
        <div style={{ fontSize: 40, color: "#a1a1aa" }}>
          Don&rsquo;t study theory. Play with it.
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
