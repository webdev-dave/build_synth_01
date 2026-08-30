/* --- Starfield --------------------------------------------------------
   A full-bleed cosmos behind the hero: the map floating in it reads as
   a sky chart — notes as stars, the scale as a constellation. Fields
   are generated once at module load from seeded PRNGs, so server and
   client render the identical sky and nothing re-rolls between renders;
   the seed *is* the design — change it to get a different sky. Shapes
   mix round dots with tiny diamonds and pointed stars so the field
   isn't a grid of perfect circles. The map's opaque surfaces (nodes,
   keyboard) naturally occlude the stars behind them.

   The hero's text block sits in a different place per breakpoint
   (top-left when stacked, left column side-by-side), and no single
   quiet zone fits both — one layout's copy is the other layout's open
   sky. So two fields are generated, each with its own quiet zone, and
   CSS breakpoints show exactly one.

   Twinkle is pure CSS (see hero-star-twinkle in globals.css): each
   star carries its own duration/phase/amplitude as CSS variables, so
   hundreds can breathe with no per-frame JS. No client hooks needed —
   this renders as static markup. */

import { ShootingStars } from "./ShootingStars";

const VIEW = { w: 1000, h: 700 };

type StarKind = "dot" | "diamond" | "spark" | "star5";
type Star = {
  kind: StarKind;
  x: number;
  y: number;
  size: number; // radius for dots; half-size for the pointed shapes
  o: number;
  rot: number;
  halo?: boolean; // the brightest stars get a soft blurred glow
  soft?: boolean; // quiet-zone stars render slightly blurred
  twDur?: number; // twinkle cycle length, seconds
  twPhase?: number; // 0–1 phase offset so the field never syncs up
};

/* mulberry32 — tiny deterministic PRNG. */
const makeRng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const STAR_COUNT = 2600;

/* Near the hero copy and CTAs the sky stays minimal — thinner, softer
   (blurred), no halos, no pointed shapes, no twinkle, capped
   brightness — so nothing competes with reading or the buttons.
   Returns a strength 0–1: 1 in the core over the text, feathering to 0
   so stars bleed into the margins instead of stopping at a wall. The
   breakpoint-aware mask in globals.css handles dimming over the map. */
type QuietZone = (x: number, y: number) => number;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/* Stacked (< lg): text block at the top-left; everything below it —
   including the map's surroundings — is open sky. The right bound
   feathers out so the top-right corner recovers full density.
   The top edge above the text also stays open. */
const QUIET_STACKED: QuietZone = (x, y) =>
  Math.min(
    clamp01((680 - x) / 180),
    clamp01((275 - y) / 80),
    clamp01((y - 20) / 60),
  );

/* Side-by-side (lg+): the quiet core hugs the copy block itself (kicker
   through the buttons) and feathers out on all four sides — the page's
   left margin, the strip above the title, and the band below the
   buttons are open sky. */
const QUIET_WIDE: QuietZone = (x, y) =>
  Math.min(
    clamp01((x - 20) / 90),
    clamp01((480 - x) / 90),
    clamp01((y - 160) / 90),
    clamp01((490 - y) / 90),
  );

/* Behind the instrument map the field is halved — the mask already
   dims what remains, but density itself has to drop too or the map's
   interior reads busy. Per layout: lower-middle when stacked, right
   column when side-by-side. Returns a strength 0–1 rather than a
   boolean so the treatment can feather out instead of stopping at a
   visible line: below the piano the stacked zone fades gradually back
   to open sky, so density and twinkle ramp up rather than jump. */
type MapZone = (x: number, y: number) => number;
const MAP_STACKED: MapZone = (x, y) => {
  /* At piano height the calm zone widens past the map's flanks: small
     screens crop the field toward its center, which would otherwise
     put full-density sky right beside the keys. (Kept narrow enough
     that tablet flanks — outside any phone's crop — stay starry.) */
  const inPianoRow = y > 580 && x > 250 && x < 750;
  if (y < 270) return 0;

  let strength = 1;
  if (y > 660) {
    strength = Math.max(0, 1 - (y - 660) / 130);
  }

  /* Feather the left and right edges so density doesn't jump at a
     hard vertical line when transitioning to the open flanks. */
  if (!inPianoRow) {
    if (x < 305) strength *= Math.max(0, 1 - (305 - x) / 120);
    else if (x > 695) strength *= Math.max(0, 1 - (x - 695) / 120);
  }

  return strength;
};
/* Starts below the strip above the map so the page's top edge keeps
   its stars all the way across. Feathers out on the right edge so the
   far-right margin recovers its density. */
const MAP_WIDE: MapZone = (x, y) => {
  if (x < 570 || y < 125 || y > 690) return 0;
  if (x > 880) return Math.max(0, 1 - (x - 880) / 80);
  return 1;
};

const makeStars = (
  seed: number,
  inQuietZone: QuietZone,
  inMapZone: MapZone,
  /* Extra stars for the field's central band, plus a richer map-zone
     sprinkle — see the phone-crop note below. */
  centerBoost = 0,
  sprinkleCount = 130,
  /* Tight bands hugging the components that get crammed with extra
     stars on top of the uniform field. */
  extraRegions: { n: number; x0: number; x1: number; y0: number; y1: number }[] = [],
  /* Inside this zone stars render only as small plain dots — no halos,
     no pointed or oversized shapes. Used around the piano's step-dot
     row, where a puffy star reads as a phantom sequencer dot. */
  inCalmZone?: QuietZone,
  count = STAR_COUNT,
): Star[] => {
  const rng = makeRng(seed);
  const stars: Star[] = [];
  /* `dust` companions are the faint filler around a cluster's anchor. */
  const push = (x: number, y: number, dust: boolean) => {
    if (x < 3 || x > VIEW.w - 3 || y < 3 || y > VIEW.h - 3) return;
    /* Half density behind the map (applies to dust companions too),
       scaled by the zone's strength so feathered edges thin gradually. */
    const mapStrength = inMapZone(x, y);
    if (rng() < 0.5 * mapStrength) return;
    /* In the quiet zone's feathered margin each star rolls against the
       local strength, so muted "quiet" stars and full-character ones
       mix in proportion — the transition has no visible seam. */
    const quiet = rng() < inQuietZone(x, y);
    const calm = (inCalmZone?.(x, y) ?? 0) > 0;
    const roll = rng();
    const kind: StarKind =
      dust || quiet || calm || roll < 0.78
        ? "dot"
        : roll < 0.88
          ? "diamond"
          : roll < 0.95
            ? "spark"
            : "star5";
    /* Sizes and brightness skew hard toward tiny-and-faint (t compounds
       two rolls) — a sky is mostly dust with a few standouts. Evenly
       sized, evenly bright dots are exactly what reads as polka dots. */
    const t = rng() * rng();
    const pointy = kind === "spark" || kind === "star5";
    const size = dust
      ? 0.2 + t * 0.5
      : kind === "dot"
        ? 0.25 + t * (quiet || calm ? 0.9 : 1.35)
        : kind === "diamond"
          ? 0.7 + t * 1.3
          : kind === "spark"
            ? 1.4 + rng() * 1.9
            : 1.7 + rng() * 2.1;
    const o = dust
      ? 0.05 + rng() * 0.09
      : Math.min((pointy ? 0.14 : 0.06) + t * 0.32, quiet ? 0.2 : 1);
    const star: Star = {
      kind,
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      size: Math.round(size * 100) / 100,
      o: Math.round(o * 100) / 100,
      rot: Math.round(rng() * 90),
    };
    if (quiet) star.soft = true;
    /* Halos are reserved for the rare standouts — too many large soft
       spheres read as noise, especially near the map. */
    if (!dust && !quiet && !calm && (pointy ? size > 2.7 : o > 0.35))
      star.halo = true;
    /* Continuous shimmer, canvas-starfield style: many anchor stars
       breathe at their own speed and phase. An open-sky feature —
       dust, quiet-zone stars, and everything behind the map stay
       still — with the chance ramping back up through the map zone's
       feathered edge so animation returns gradually, not at a line. */
    if (!dust && !quiet && rng() < 0.62 * (1 - mapStrength)) {
      star.twDur = Math.round((3.5 + rng() * 6.5) * 10) / 10;
      star.twPhase = Math.round(rng() * 100) / 100;
    }
    stars.push(star);
  };

  let guard = 0;
  while (stars.length < count && guard++ < 20000) {
    const x = 3 + rng() * (VIEW.w - 6);
    const y = 3 + rng() * (VIEW.h - 6);
    /* Much thinner sky over the text zone — open space carries the
       density, so raising STAR_COUNT enriches the open areas without
       crowding the copy. Scaled by strength: density climbs smoothly
       through the feathered margin. */
    if (rng() < 0.85 * inQuietZone(x, y)) continue;
    push(x, y, false);
    /* Real skies clump: some stars bring a small cluster of faint
       companions, which breaks the even, polka-dot spacing that
       uniform sampling would otherwise produce. */
    if (rng() < 0.35) {
      const n = 1 + Math.floor(rng() * 3);
      for (let i = 0; i < n && stars.length < count; i++) {
        push(x + (rng() - 0.5) * 26, y + (rng() - 0.5) * 26, true);
      }
    }
  }

  /* Phone crop: `slice` scaling means a narrow portrait screen shows
     only the field's central ~46% — the outer columns are cropped away,
     so a uniformly generated sky looks half as dense on a phone as on a
     tablet. The stacked field front-loads extra stars into that
     always-visible central band (quiet zone and map cull still apply,
     so the enrichment lands in the open sky around the map). */
  let boosted = 0;
  guard = 0;
  while (boosted < centerBoost && guard++ < 20000) {
    const x = 360 + rng() * 520;
    const y = 3 + rng() * (VIEW.h - 6);
    if (rng() < 0.85 * inQuietZone(x, y)) continue;
    const before = stars.length;
    push(x, y, false);
    if (stars.length > before) boosted++;
  }

  /* Cram-fill: the requested bands go through the normal push (so the
     usual shape/size/twinkle rolls apply) but at far higher density
     than the uniform field — on phones these slivers beside and below
     the components are most of the visible open sky, so they have to
     carry the cosmos. */
  for (const r of extraRegions) {
    let placed = 0;
    guard = 0;
    while (placed < r.n && guard++ < 10000) {
      const x = r.x0 + rng() * (r.x1 - r.x0);
      const y = r.y0 + rng() * (r.y1 - r.y0);
      if (rng() < inQuietZone(x, y)) continue;
      const before = stars.length;
      push(x, y, false);
      if (stars.length > before) placed++;
    }
  }

  /* A fine sprinkle of tiny stars inside the map zone. The 50% cull
     keeps the big, bright, animated stars out of the artwork, but a
     completely bare interior reads dead — these are dust-sized, still,
     and just bright enough to survive the mask's dimming there. */
  let sprinkled = 0;
  guard = 0;
  while (sprinkled < sprinkleCount && guard++ < 8000) {
    const x = 3 + rng() * (VIEW.w - 6);
    const y = 3 + rng() * (VIEW.h - 6);
    if (inMapZone(x, y) < 0.5 || inQuietZone(x, y) > 0.3) continue;
    stars.push({
      kind: "dot",
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      size: Math.round((0.25 + rng() * 0.55) * 100) / 100,
      o: Math.round((0.1 + rng() * 0.12) * 100) / 100,
      rot: 0,
    });
    sprinkled++;
  }
  return stars;
};

/* Stacked cram bands: columns hugging the map's left and right edges,
   stopping above the piano so its row stays calm. Below the piano
   there's no band — the map zone's feathered bottom edge lets density
   flow back naturally instead. */
/* Piano row and everything beneath it: only small plain dots, so
   nothing mimics the step-sequencer dots under the keys. Width-limited
   to the piano's surroundings so tablet flanks keep full-character
   stars (phones never show past these bounds anyway). The very top
   edge above the text is also calmed so it doesn't distract from the
   header. */
const CALM_STACKED: QuietZone = (x, y) =>
  (y > 580 && x > 250 && x < 750) || y < 60 ? 1 : 0;

/* Phones (< sm) crop the field hard, so this variant front-loads the
   central band and crams the map's flanks — dense on paper, right on
   screen. */
const STARS_PHONE = makeStars(
  20260822,
  QUIET_STACKED,
  MAP_STACKED,
  700,
  210,
  [
    { n: 110, x0: 210, x1: 302, y0: 280, y1: 575 },
    { n: 110, x0: 698, x1: 790, y0: 280, y1: 575 },
    { n: 120, x0: 0, x1: 1000, y0: 0, y1: 70 },
  ],
  CALM_STACKED,
);

/* Tablets (sm–lg) show most of the field, so the phone boosts and
   cram bands just read as clutter. Uses a lighter base count and
   relies on the feathered map zone for smooth transitions. */
const STARS_TABLET = makeStars(
  20260822,
  QUIET_STACKED,
  MAP_STACKED,
  0,
  170,
  [
    { n: 80, x0: 0, x1: 1000, y0: 0, y1: 70 },
    { n: 120, x0: 650, x1: 1000, y0: 70, y1: 270 },
  ],
  CALM_STACKED,
  1800,
);

/* Desktop (lg+): side-by-side layout. The right flank gets a cram band
   of small, calm dots to fill the margin beside the map. */
const STARS_WIDE = makeStars(
  11235813,
  QUIET_WIDE,
  MAP_WIDE,
  0,
  200,
  [{ n: 140, x0: 880, x1: 990, y0: 150, y1: 680 }],
  (x) => (x > 880 ? 1 : 0),
);

/* Five-point star silhouette (borrowed from the classic canvas
   starfield): alternating outer and inner vertices give the pointy,
   concave shape that reads "star" at a glance. Centered on the origin,
   placed via transform. */
const star5Path = (s: number) => {
  const inner = s * 0.42;
  const pts: string[] = [];
  for (let i = 0; i < 5; i++) {
    const ao = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const ai = ao + Math.PI / 5;
    pts.push(
      `${Math.round(Math.cos(ao) * s * 100) / 100} ${Math.round(Math.sin(ao) * s * 100) / 100}`,
      `${Math.round(Math.cos(ai) * inner * 100) / 100} ${Math.round(Math.sin(ai) * inner * 100) / 100}`,
    );
  }
  return `M${pts.join(" L")}Z`;
};

/* Four-point spark — concave quadratic sides give the "jagged" glint;
   drawn centered on the origin and placed via transform. */
const sparkPath = (s: number) => {
  const c = Math.round(s * 22) / 100;
  return `M0 ${-s} Q${c} ${-c} ${s} 0 Q${c} ${c} 0 ${s} Q${-c} ${c} ${-s} 0 Q${-c} ${-c} 0 ${-s}Z`;
};
const diamondPath = (s: number) => `M0 ${-s} L${s} 0 L0 ${s} L${-s} 0Z`;

/* A dot as SVG path commands (two arcs), so hundreds of static dots can
   merge into a single <path> element. */
const dotPath = (x: number, y: number, r: number) =>
  `M${Math.round((x - r) * 10) / 10} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;

function StarLayer({ stars, idPrefix }: { stars: Star[]; idPrefix: string }) {
  const haloId = `${idPrefix}-halo`;
  const softId = `${idPrefix}-soft`;

  /* The bulk of the field is static plain dots. Merging them into a few
     <path> elements (bucketed by opacity, soft vs. crisp) keeps the DOM
     small no matter how dense the sky gets; only twinklers, pointed
     shapes, and halo stars render individually. */
  const mergedDots = new Map<string, string[]>();
  const individual: Star[] = [];
  for (const s of stars) {
    if (s.kind === "dot" && !s.twDur && !s.halo) {
      const bucket = Math.max(0.04, Math.round(s.o / 0.04) * 0.04).toFixed(2);
      const key = `${bucket}|${s.soft ? 1 : 0}`;
      let list = mergedDots.get(key);
      if (!list) mergedDots.set(key, (list = []));
      list.push(dotPath(s.x, s.y, s.size));
    } else {
      individual.push(s);
    }
  }

  return (
    <svg
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
    >
      <defs>
        {/* Softens halo circles into glows */}
        <filter
          id={haloId}
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        {/* Slight defocus for quiet-zone stars near text — they read
          as out-of-focus background rather than crisp specks */}
        <filter
          id={softId}
          x="-150%"
          y="-150%"
          width="400%"
          height="400%"
        >
          <feGaussianBlur stdDeviation="0.45" />
        </filter>
      </defs>

      {/* Static dot field — a handful of merged paths */}
      {[...mergedDots.entries()].map(([key, ds]) => {
        const [o, soft] = key.split("|");
        return (
          <path
            key={`dots-${key}`}
            d={ds.join("")}
            className="fill-muted-foreground"
            opacity={Number(o)}
            filter={soft === "1" ? `url(#${softId})` : undefined}
          />
        );
      })}

      {individual.map((s, i) => {
        const isDot = s.kind === "dot";
        const d = isDot
          ? undefined
          : s.kind === "diamond"
            ? diamondPath(s.size)
            : s.kind === "spark"
              ? sparkPath(s.size)
              : star5Path(s.size);
        const placed = isDot
          ? undefined
          : `translate(${s.x} ${s.y}) rotate(${s.rot})`;
        /* Twinklers rest near max brightness and briefly dim — the dip
           is shallow (not to black) and the peak stays under the
           faint-layer ceiling. The negative delay starts each star
           mid-cycle so the sky never glimmers in sync. */
        const twinkleStyle = s.twDur
          ? ({
              "--tw-min": String(Math.round(s.o * 0.35 * 100) / 100),
              "--tw-max": String(
                Math.round(Math.min(s.o * 1.7 + 0.05, 0.5) * 100) / 100,
              ),
              "--tw-dur": `${s.twDur}s`,
              "--tw-delay": `${-Math.round((s.twPhase ?? 0) * s.twDur * 10) / 10}s`,
            } as React.CSSProperties)
          : undefined;
        const cls = s.twDur
          ? "fill-muted-foreground hero-star-twinkle"
          : "fill-muted-foreground";
        const soft = s.soft ? `url(#${softId})` : undefined;
        return (
          <g key={`star-${i}`}>
            {/* A soft glow behind the brightest stars separates
              "star" from "dot" */}
            {s.halo && (
              <circle
                cx={s.x}
                cy={s.y}
                r={s.size * 1.8 + 0.8}
                className="fill-muted-foreground"
                opacity={0.035}
                filter={`url(#${haloId})`}
              />
            )}
            {isDot ? (
              <circle
                cx={s.x}
                cy={s.y}
                r={s.size}
                className={cls}
                filter={soft}
                opacity={s.o}
                style={twinkleStyle}
              />
            ) : (
              <path
                d={d}
                transform={placed}
                className={cls}
                filter={soft}
                opacity={s.o}
                style={twinkleStyle}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function StarfieldBackground() {
  /* The sky is at full strength in open space and dims into soft holes
     over the overlaid components (hero text and the map) — see
     .hero-star-mask in globals.css, which recenters the holes per
     breakpoint. The layer overhangs the hero's bottom edge so stars
     spill into the gap below and fade out (the mask's bottom fade).
     Three fields: a dense one for hard-cropping phones (< sm), a
     lighter one for tablets (sm–lg), and the side-by-side desktop
     field (lg+).

     The hero sits in a padded, width-capped container, so the layers
     bleed past it — up through the page padding to the nav and out to
     the viewport edges — or the sky would cut off at invisible
     container lines. (The page clips the horizontal overhang.) */
  const bleed =
    "hero-star-mask pointer-events-none absolute -bottom-24 -top-10 left-[calc(50%-50vw)] right-[calc(50%-50vw)] overflow-hidden sm:-top-12";
  return (
    <>
      <div
        aria-hidden
        className={`${bleed} sm:hidden`}
      >
        <StarLayer
          stars={STARS_PHONE}
          idPrefix="sf-phone"
        />
      </div>
      <div
        aria-hidden
        className={`${bleed} hidden sm:block lg:hidden`}
      >
        <StarLayer
          stars={STARS_TABLET}
          idPrefix="sf-tablet"
        />
      </div>
      <div
        aria-hidden
        className={`${bleed} hidden lg:block`}
      >
        <StarLayer
          stars={STARS_WIDE}
          idPrefix="sf-wide"
        />
      </div>
      <ShootingStars />
    </>
  );
}
