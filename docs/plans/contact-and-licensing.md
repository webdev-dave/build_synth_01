# Plan: Contact & Licensing Pages

## Overview

Three new info pages plus footer wiring, so people can reach out and understand
how they're allowed to use the tools:

- **`/contact`** — one page to send: an idea/feedback, a "let's work together"
  note, a "hire me for another project" inquiry, or a "license a tool" request
  (school / teacher / commercial).
- **`/usage`** — plain-language "Rights of Usage": **free for individual
  students & hobbyists**; schools, teachers, and commercial users should reach
  out or see pricing.
- **`/pricing`** — lightweight stub for now: pricing is tailored, reach out.
  Exists so "see pricing" links resolve on the static site.

These are **content/info pages**, not app tools, so they live in the footer
rather than the app-focused top nav.

## ⚠️ Coordinate with the About page (added Aug 2026)

The `/about` page has since grown its own **"Work with me"** section — a
`#reach-out` anchor (linked from below the name and from the accordion story)
with an intro line and a row of channel buttons (Email · GitHub · LinkedIn ·
YouTube · Instagram). That currently *is* the de-facto contact surface.

When we build the real `/contact` page below, treat the two as one system, not
two competing "contact me" spots:

- **Gut the placeholder `/contact`.** The current `src/app/contact/page.tsx` is
  a throwaway stub (single `mailto:` button). Replace it wholesale with the real
  form described below — don't try to preserve it.
- **Then re-think the About page's "Work with me" block.** Once a proper form
  exists, decide the division of labor so we're not saying "reach out" twice:
  - Option A — About keeps the social channels (personal: follow / see other
    work) and points its primary CTA at `/contact` for structured inquiries
    (hire / collaborate / license).
  - Option B — About keeps a light "email me / socials" row and `/contact` owns
    everything with a reason selector.
  - Either way: **one clear primary path per intent**, no duplicated `mailto:`
    entry points drifting out of sync. Re-word the About intro line to match
    whatever split we choose.

## Constraints to respect

- App uses `output: "export"` (static export → Vercel). **There is no server to
  receive a form POST.** The contact form must post to a third-party endpoint or
  fall back to `mailto:`. No SSR/server-only features, no API routes.
- Design system per `AGENTS.md`: shadcn components in `src/components/ui/`,
  Lucide icons (mapped in `src/lib/appIcons.ts`), theme tokens (`bg-background`,
  `text-muted-foreground`, …), mono font for machine-precise text, dark-first.
- Accent discipline: orange = attention, green = affirmation, everything else
  neutral. One accent per view.
- Top nav (`src/lib/navigation.ts`) is reserved for apps/tools — don't add info
  pages there. The footer in `src/app/layout.tsx` is currently just a copyright
  line and is the right home for these links.

---

## Decisions (locked with the user)

1. **Form backend = third-party form service.** At build time, do quick research
   to pick the best-fit tool for a static Vercel export (Formspree vs.
   Web3Forms vs. alternatives), then wire it up. The endpoint/keys go in as a
   clearly-marked placeholder to swap later.
2. **Pricing = lightweight stub.** No invented tiers or numbers; "reach out"
   with a Contact CTA.
3. **Email = placeholder** `hello@instrumaps.com`, used for the `mailto:`
   fallback and any direct-email links, easy to swap later.

---

## Phase 1 — Contact page

- [ ] **Gut the existing `/contact` stub first** — the current single-`mailto:`
      button page is a placeholder; rebuild it from scratch as below.
- [ ] `src/app/contact/page.tsx` — calm single-column layout mirroring
      `src/app/lessons/page.tsx` (max-w container, header with a `Mail` Lucide
      icon, muted intro line).
- [ ] Reason selector (select or segmented control): **Submit an idea · Work
      together · Hire me · License a tool**.
- [ ] Fields: name, email, reason, message — built from existing shadcn
      primitives; add any missing `ui/` primitives (e.g. `input`, `textarea`,
      `select`, `label`) via the established shadcn setup if not already present.
- [ ] Post to the chosen third-party form service (placeholder endpoint) with a
      basic success/error state.
- [ ] `mailto:hello@instrumaps.com` fallback link for anyone who prefers email.

## Phase 2 — Rights of Usage page

- [ ] `src/app/usage/page.tsx` — plain-language terms, not legalese:
  - **Free** for **individual students & hobbyists** (personal learning & play).
  - **Schools / teachers / commercial** → reach out or see pricing.
  - Short note on what "use" covers (the interactive tools) and how licensing
    works.
- [ ] CTAs (shadcn `Button`) linking to `/contact` and `/pricing`.

## Phase 3 — Pricing stub

- [ ] `src/app/pricing/page.tsx` — "Pricing is tailored to your school/studio —
      reach out." Contact CTA. No numbers yet; structured so real tiers can slot
      in later.

## Phase 4 — Wiring & verification

- [ ] Add **Contact · Usage rights · Pricing** links to the footer in
      `src/app/layout.tsx` (keep the top nav app-only).
- [ ] Reuse shadcn `Card` / `Button` / `Badge`; `Mail` from Lucide. No new
      runtime deps unless the form tool requires one.
- [ ] **Re-think the About page's "Work with me" section** (see coordination
      note above): pick Option A or B, wire its CTA accordingly, and re-word the
      intro line so About and `/contact` don't both claim to be the contact spot.
- [ ] `npx tsc --noEmit` for types; lint the touched files.

---

## Placeholders to swap later

| Placeholder | Where | Swap when |
|-------------|-------|-----------|
| Form-service endpoint/keys | `/contact` form action | After picking the tool + signing up |
| `hello@instrumaps.com` | `mailto:` + direct links | When the real address is chosen |
| Pricing details | `/pricing` | When tiers are decided |

## Relevant existing files

| Purpose | Path |
|---------|------|
| Content-page layout precedent | `src/app/lessons/page.tsx` |
| Footer + global chrome | `src/app/layout.tsx` |
| Top-nav config (leave app-only) | `src/lib/navigation.ts` |
| Icon mapping | `src/lib/appIcons.ts` |
| shadcn primitives | `src/components/ui/` |
| `cn()` utility | `src/lib/utils.ts` |
