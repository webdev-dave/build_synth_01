# Plan: Buy Me a Coffee (tips)

## Overview

Add a quiet way for people to tip the builder. A **Buy me a coffee** control
lives in two places:

- the global **footer** (next to *About the developer*)
- the **`/about`** page (alongside GitHub and LinkedIn)

Payments themselves stay off-site. We do **not** take cards, run Stripe, or add
API routes. The control is a link to a [Buy Me a Coffee](https://www.buymeacoffee.com)
creator page. BMC handles checkout (Stripe/PayPal under the hood), payouts, and
receipts.

This is **tips / "keep the lights on"**, not product pricing. School / teacher /
commercial licensing stays on the separate [contact & licensing](./contact-and-licensing.md)
track (`/usage`, `/pricing`, `/contact`).

**Do not build this yet.** Account setup + the URL have to exist first; this
doc is the build spec for when we do.

---

## Why a link, not a payment stack

The site is a static export (`output: "export"` on Vercel). There is no server
to take a POST, no webhook endpoint, and no reason to add one for a tip jar.

| Approach | Fit |
|----------|-----|
| **Outbound BMC link** (recommended) | Zero backend, works with static export, one URL in `src/lib/author.ts`. Checkout happens on BMC in a real browser. |
| BMC website widget / embed script | Lets people tip without leaving the page, but injects third-party JS, BMC's yellow coffee chrome, and iframe checkout. Clashes with `AGENTS.md` (quiet chrome, no extra hues, wow through meaning). Skip. |
| BMC generated button snippet | Same branding problem. We can match the *idea* with our own `Button` + Lucide `Coffee`. |
| Stripe / PayPal on our domain | Needs server routes, webhooks, dropping static export, tax/compliance work. Wrong size for a tip jar. Revisit only if licensing checkout becomes real. |
| GitHub Sponsors only | Fine as a later extra on `/about`; BMC is the friendlier non-dev tip path. |

Linking out also keeps Vercel Hobby out of the payment path. The site is not
processing money — it's pointing at BMC.

---

## Constraints to respect

- Static export: no API routes, no server actions, no Stripe SDK.
- Design: theme tokens, Lucide icons, shadcn `Button`. No BMC yellow widget,
  no extra accent color. Coffee is an invitation, not a spotlight — don't
  orange-pulse it.
- Footer is already the home for info links; top nav stays app/tools only
  (`src/lib/navigation.ts`).
- Footer will also grow Contact / Usage / Pricing from the licensing plan.
  Keep this one quiet so the bar doesn't become a marketplace.
- Sound-consent / audio rules are irrelevant here. Prefer `target="_blank"`
  + `rel="noopener noreferrer"` so leaving for checkout doesn't kill an
  in-progress AudioContext session.

---

## Decisions (proposed — veto before build)

1. **Provider = Buy Me a Coffee.** One creator page, default "buy a coffee"
   amounts + optional one-off custom amount. Memberships / extras are out of
   scope for v1.
2. **Implementation = our link/button, their hosted page.** No embed script.
3. **Copy = "Buy me a coffee"** on both surfaces. Plain, matches the product
   voice. Not "Donate" or "Support Instrumaps" (those sound like a nonprofit
   or a product SKU).
4. **URL lives on `AUTHOR`** in `src/lib/author.ts`, same pattern as GitHub
   and LinkedIn. Placeholder until the BMC slug exists.
5. **One shared control**, used in the footer (text-link treatment) and on
   `/about` (outline `Button` like the other two). Don't fork the href.

---

## Off-site setup (you, before any code)

BMC has to exist before the button can do anything.

1. Create a Buy Me a Coffee account (the public slug will be something like
   `https://buymeacoffee.com/<slug>`).
2. Connect payouts (PayPal and/or Stripe — BMC's flow).
3. Pick a page title / coffee price / thank-you note. Keep it short; the site
   already explains who you are.
4. Make a **$1 test tip** from another browser/profile and confirm the payout
   method actually receives it.
5. Drop the live URL into the placeholder in `src/lib/author.ts`.

Until step 5, do not ship the control to production (a dead link is worse than
no link). Fine to wire it on a preview branch with the placeholder.

---

## Phase 1 — Data + shared control

- [ ] Add `coffee` (label + href) to `AUTHOR` in `src/lib/author.ts`.
      Placeholder href until the BMC page is live, clearly marked.
- [ ] Small shared control (name TBD: `CoffeeLink` / `BuyMeACoffeeLink`) that
      takes a `variant`: `footer` (mono text link, matches the existing
      footer) vs `button` (shadcn outline + Lucide `Coffee`).
- [ ] Always: `target="_blank"`, `rel="noopener noreferrer"`.

## Phase 2 — Placement

- [ ] **Footer** (`src/app/layout.tsx`): add the footer-variant control next
      to *About the developer*. Suggested line:
      `© 2026 Instrumaps · About the developer · Buy me a coffee`
      When Contact / Usage / Pricing land, keep coffee as one quiet item —
      don't promote it above those.
- [ ] **`/about`**: add the button-variant control in the existing GitHub /
      LinkedIn row (third button). Optional one muted sentence above it
      ("If the tools are useful, you can buy me a coffee") — only if the
      row feels abrupt without it. No extra section, no widget, no supporter
      count.

## Phase 3 — Verify (when we build)

- [ ] `npx tsc --noEmit`; lint touched files.
- [ ] Click footer link from home + a tool page (synth / harmonica) and
      confirm BMC opens in a new tab.
- [ ] Click the about-page button; same destination.
- [ ] Reduced-motion / keyboard: the control is a real `<a>`, so it should
      just work. Check focus ring on both variants.

---

## Explicitly out of scope (v1)

- BMC embed widget, floating coffee button, or their supporter-count badge
- Memberships, extras, or "buy me a synth preset" shop items
- In-app thank-you state or webhook-driven "thanks" banner
- GitHub Sponsors (easy later add on `/about` if wanted)
- Wiring coffee into `/pricing` — that page is for licensing, not tips
- Taking payments on instrumaps.com

---

## Placeholders to swap later

| Placeholder | Where | Swap when |
|-------------|-------|-----------|
| BMC page URL | `AUTHOR.coffee.href` in `src/lib/author.ts` | After the creator page exists and a test tip lands |

## Relevant existing files

| Purpose | Path |
|---------|------|
| Author + social URLs | `src/lib/author.ts` |
| About page | `src/app/about/page.tsx` |
| Footer | `src/app/layout.tsx` |
| Licensing / other footer links (don't collide) | `docs/plans/contact-and-licensing.md` |
| Hosting / static-export constraint | `docs/sketches/hosting-and-auth-direction.md` |
