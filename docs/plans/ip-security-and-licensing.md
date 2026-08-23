# Plan: IP, Security & Licensing Due Diligence (repo/legal + data-integrity layer)

**Status:** planning
**Date:** 2026-08-22
**Scope:** The *legal / ownership / security* layer for Instrumaps — protecting
the code, the brand, the account, and the right to monetize as this stops being a
passion project and starts taking real time and money.

> ⚠️ **Not legal advice.** This is an engineering plan to get the basics right
> and to organize the paperwork so a real attorney's time is cheap and focused.
> Trademark registration and copyright registration have real legal
> consequences — have a lawyer review the trademark filing and the license
> choice before you rely on them. The goal here is *diligent groundwork*, not
> DIY lawyering.

---

## How this differs from `contact-and-licensing.md`

There are now **two** licensing concerns; keep them separate but consistent:

| Doc | Layer | Question it answers |
|-----|-------|---------------------|
| `contact-and-licensing.md` | **Product-facing** | "As a *user*, what am I allowed to do with the tools?" (free for students, paid for schools/commercial) — the `/usage` & `/pricing` pages. |
| **this doc** | **Legal / repo / security** | "Who *owns* the code & brand, under what license is the *source* published, who can *access* it, and how is the account/data secured?" |

They must agree: the source-code license chosen here has to *permit* the
business model described there (e.g. don't publish under permissive MIT if you
intend to charge commercial users — see Phase 2).

---

## Current state (verified 2026-08-22)

- **Author:** solo (`webdev-dave`). No outside contributors, no merged external
  PRs → you own **100%** of the copyright. This is the clean, easy case; it gets
  harder the moment someone else commits, so lock the terms *before* inviting
  contributions.
- **License file:** ❌ none. No `LICENSE`, `COPYING`, or `NOTICE`. `package.json`
  has no `"license"` field.
  - Legal effect: "**all rights reserved**" by default. The repo being publicly
    viewable on GitHub only grants (via GitHub's ToS) the right to *view* and
    *fork within GitHub* — **no** right to use, copy, modify, or deploy. So the
    code is *technically* protected today, but the posture is accidental and
    unclear, which is exactly what "serious diligence" fixes.
- **Repo:** `github.com/webdev-dave/build_synth_01` — **currently PUBLIC**. Named
  from the passion-project era; brand is now **Instrumaps** (`instrumaps.com`).
- **Deploy coupling:** Vercel project `instrumaps` is git-connected to this exact
  repo (`webdev-dave/build_synth_01`), `main` production, auto-deploy locked via
  `vercel.json`. See `.cursor/rules/deployment.mdc`. **Any repo move must re-wire
  this.**
- **Secrets:** `.env*`, `*.pem`, `.vercel` are gitignored *now* — good going
  forward, but history from "back in the day" is unverified (see Phase 1).
- **Brand assets that may be protectable:** the name **Instrumaps**, the logo /
  icons (`/apple-icon`, `instrumaps-192/512.png`), and the tagline
  **"Don't study theory. Play with it."**

---

## The public-vs-private question (the honest version)

You want two things that partly pull against each other: **showcase your coding
skills to future employers** and **not hand your work to the whole internet.**
Here's the nuance that decides it:

> **Instrumaps is a static export (`output: "export"`).** The *entire compiled
> app ships to the browser* from `instrumaps.com`. So even a **private** repo does
> **not** hide your app logic — anyone can open DevTools and read the (minified)
> bundle. Making the repo private hides your **readable source, comments, docs,
> git history, and unreleased work** — but not the deployed client logic.

Consequences:

- **Repo privacy is not your real moat — the *license* is.** A determined
  competitor can reconstruct behavior from the shipped bundle regardless of repo
  visibility; what stops them *using* it is the license + your willingness to
  enforce it, not the repo setting.
- **For showcasing, a clean *public* repo is worth a lot** (recruiters can
  actually read your code). Privacy throws that away for only partial protection.

### Options (the happy middle road)

Recommended in **bold**.

1. **Public repo + proprietary/source-available license + security hardening
   (RECOMMENDED).** Keep the showcase value; make the protection *legal* and
   *deliberate* instead of accidental. Recruiters read everything; nobody gets the
   right to reuse/deploy/compete. Pair with Phase 6 hardening (branch protection,
   secret scanning, 2FA) so "public" never means "insecure."
2. **Private repo + curated public showcase (fallback).** Go private if there's
   genuinely sensitive material (a real algorithmic moat, unreleased features,
   business docs you don't want read). Preserve the job-showcase via:
   - the **live site itself** (best demo you have),
   - a short **case-study / architecture writeup** (README or portfolio),
   - **read access on request** — add a recruiter as a repo collaborator (or a
     time-boxed access grant) when they ask, and/or
   - a small **separate public "highlights" repo** with a few representative,
     self-contained pieces.
3. **Split: private core + public demo/subset.** Maximum control, most
   maintenance. Only worth it if a specific part is a true secret. Usually
   overkill for this project.

**Recommendation:** start with **Option 1** — you get to keep the portfolio value,
and the license (Phase 2) plus hardening (Phase 6) is what actually protects you.
Move to Option 2 only if/when the repo starts holding something that genuinely
shouldn't be read (e.g. once auth/DB/business logic land per
`hosting-and-auth-direction.md`). Revisit this at the auth/DB inflection point.

---

## Decisions to lock (before doing the work)

These are the forks in the road. Recommended defaults in **bold**; nothing below
is built until these are chosen.

1. **Who/what owns the IP?** You personally, or an **LLC/entity**?
   - *Default:* start as **you personally** (copyright vests in you automatically
     and for free), and form an LLC only when revenue/liability justifies it —
     then assign the IP to the LLC in one document. Don't let entity formation
     block the licensing work.
2. **Source-code license posture** (the big one — Phase 2 detail):
   - (a) **Proprietary / all-rights-reserved, source-visible** — keep the repo
     public for portfolio/marketing, but nobody may use it. *Simplest, most
     protective.* **Recommended default** given the monetization intent.
   - (b) **Source-available with a written license** (e.g. PolyForm Noncommercial
     / BSL) — people may read and use non-commercially; commercial use requires a
     paid license. Matches the "free for students, paid for schools" model most
     literally, but adds a license you must maintain.
   - (c) **Private repo, closed source** — see the public-vs-private section; note
     it does *not* hide the deployed client bundle.
   - (d) **Permissive OSS (MIT/Apache)** — ❌ **not** recommended; it would let
     anyone (including competitors) ship your tools commercially for free.
3. **Repo visibility** (see section above): **stay public + proprietary license**
   (default), or go **private + curated showcase**.
4. **New repo, or clean up the current one?** (Phase 3.) *Default:* **rename +
   reposture the current repo** unless the secret scan (Phase 1) finds something
   that must be erased from history — a fresh repo is only worth the Vercel/redirect
   re-wiring if there's a concrete reason.
5. **Trademark seriousness level** (Phase 4): use **™ now (free)** and file a
   USPTO registration for the **Instrumaps** word mark when budget allows;
   logo/tagline later. Confirm you want to spend on registration vs. just holding
   common-law ™ rights for now.

---

## Phase 1 — Diligence & hygiene (do first, low cost)

Establishes what you actually own and whether the history is clean. Cheap, and it
de-risks every later decision.

- [ ] **Confirm sole authorship.** `git shortlog -sne` — verify only your
      identities appear; note any stray author emails to consolidate.
- [ ] **Scan full git history for secrets** (the "back in the day" worry, and
      doubly important while the repo is public). Scan *history*, not just the
      working tree:
      - `gitleaks detect --source . --log-opts="--all"` (or `trufflehog git file://.`)
      - If anything real leaks (API keys, tokens), **rotate the secret first**,
        then decide: scrub with `git filter-repo` / BFG, or (cleaner) start the
        fresh repo in Phase 3. A leaked secret in public history is the single
        strongest reason to redeploy to a new repo.
- [ ] **Third-party dependency license audit** (proprietary code must not embed
      copyleft it can't comply with):
      - `npx license-checker --summary` (or `--production`) to list every dep's
        license. Current stack is permissive (Next.js/React/Radix/lucide/motion =
        MIT/ISC; `@tonejs/midi` — confirm each), but
        **flag any GPL/AGPL/LGPL** and remove or isolate it.
      - Produce a `THIRD-PARTY-NOTICES.md` so attributions are satisfied even in a
        proprietary product.
- [ ] **Audit non-code content & data** for third-party rights:
      - Fonts, icons beyond Lucide, any audio samples, and especially the
        **klezmer/Yiddish dataset** (`docs/plans/klezmer-yiddish-dataset.md`) and
        any lesson/melody content — confirm each is your original work, public
        domain, or properly licensed. Melodies and datasets carry their own
        copyright separate from the code.
- [ ] **Verify repo visibility & settings** (once `gh` is available or via the
      web UI): confirm public/private, whether forks exist, and current
      "License: none" state shown by GitHub.

---

## Phase 2 — Choose & apply the source-code license

Turns the accidental "all rights reserved" into a deliberate, documented posture.

- [ ] **Lock decision #2 above.** Then add the corresponding files at repo root:
  - **If (a) proprietary / source-visible:**
    - `LICENSE` — a short proprietary notice: `Copyright (c) 2025–2026 <name>.
      All rights reserved.` plus a plain-language grant of *nothing beyond
      viewing*, and a "contact for licensing" pointer to `/usage`.
    - `package.json` → `"license": "UNLICENSED"` and keep `"private": true`.
  - **If (b) source-available:**
    - `LICENSE` = the chosen text verbatim (e.g. PolyForm Noncommercial 1.0.0, or
      BSL 1.1 with a change date/license). Don't hand-edit these — use the
      canonical text.
    - `package.json` → `"license": "SEE LICENSE IN LICENSE"`.
- [ ] **Add a `NOTICE` / copyright header policy.** At minimum a `NOTICE` file;
      optionally a one-line header on source files (keep it light — a repo-root
      LICENSE + NOTICE is enough for a solo proprietary project).
- [ ] **README license section.** Add an explicit "License & usage" section that
      states the posture and links to `/usage` + `/contact`. Also fix the stale
      README (still says "Build Synth 01", Netlify demo link) so branding and
      license read as intentional — see the rename task in
      `hosting-and-auth-direction.md`.
- [ ] **Consistency check** with `contact-and-licensing.md`: the license text must
      not contradict "free for students / paid for commercial."

---

## Phase 3 — Repo strategy (rename vs. fresh start)

Decision #4. Pick **one** track.

### Track A — Rename & reposture current repo (default)
Keeps history, stars, and the Vercel wiring intact.

- [ ] Rename repo `build_synth_01` → `instrumaps` on GitHub (GitHub auto-redirects
      the old URL, but update anyway):
  - [ ] `git remote set-url origin https://github.com/webdev-dave/instrumaps.git`
  - [ ] Update `README.md`, `package.json` `"name"`, and any hardcoded repo links.
  - [ ] Confirm the **Vercel** git connection still resolves (it follows GitHub's
        rename, but verify in project settings per `deployment.mdc`).
- [ ] Apply Phase 2 license files.
- [ ] Set visibility per decision #3 (stay public, or flip to private).

### Track B — Fresh repo (only if Phase 1 found history to erase, or you want a clean slate)
- [ ] Create new **`instrumaps`** repo (public or private per decision #3).
- [ ] Seed it *without* the old history: copy the working tree into a fresh
      `git init` (this drops any leaked secrets / cruft from the old history).
- [ ] Preserve provenance: keep the old repo archived (read-only) so nothing
      breaks, and note in the new README that it succeeds `build_synth_01`.
- [ ] **Re-wire deployment** (this is the expensive part — budget for it):
      re-connect the new repo in the Vercel `instrumaps` project, re-apply the
      `main` deploy lock (`vercel.json`), re-check the custom domain, and update
      `.cursor/rules/deployment.mdc`.
- [ ] Archive (don't delete) `webdev-dave/build_synth_01` so old links survive.

> Recommendation: **Track A** unless the secret scan forces Track B. The value of
> a fresh repo is mostly "erase history"; if history is clean, the Vercel/redirect
> re-wiring isn't worth it.

---

## Phase 4 — Trademark (the brand: "Instrumaps")

A word mark is usually the highest-value, lowest-cost brand protection. Order of
operations matters — **clear before you spend, and before you print ®**.

- [ ] **Inventory the marks** and prioritize:
      1. **Instrumaps** (word mark) — highest priority.
      2. Logo / icon (design mark) — later.
      3. Tagline "Don't study theory. Play with it." — optional; taglines are
         harder to register.
- [ ] **Clearance search** *before* filing (do this even if you never register):
      - USPTO search (Trademark Search / TESS successor) for "Instrumaps" and
        near-misses in relevant classes.
      - Common-law: plain web search, app stores, `instrumaps` social handles,
        domain variants — confirm nobody senior is already using it.
      - If clear, this alone strengthens your **common-law ™** rights from use.
- [ ] **Use ™ now** (free, immediate) on the wordmark/logo in the UI and README.
      Do **not** use ® until/unless a federal registration issues.
- [ ] **Decide classes** for any filing (typical for this product):
      - **Class 9** — downloadable/SaaS software (the interactive tools).
      - **Class 41** — education / providing online music-education tools.
- [ ] **File the USPTO application** when budget allows (self-serve TEAS is
      possible; a flat-fee trademark attorney reduces refusal risk). Consider
      *intent-to-use* vs *use-in-commerce* basis.
- [ ] **Secure the brand perimeter** (cheap defensive moves, do regardless of
      registration): grab matching social handles, obvious domain variants, and
      keep dated evidence of first use in commerce.
- [ ] **Add a light `TRADEMARK.md`** (usage/brand policy: how others may/may not
      refer to Instrumaps) once the mark posture is set.
- [ ] International (Madrid Protocol) — **defer** until there's real traction.

---

## Phase 5 — Contributor & future-proofing terms

Only needed once you invite others, but decide the policy now so you never have to
chase signatures retroactively.

- [ ] **If you'll ever accept outside PRs**, add a **DCO** (lightweight
      `Signed-off-by`) or a **CLA** so contributions are licensed/assigned to you
      and you retain the right to relicense/commercialize. Without this, a
      contributor co-owns their contribution and can block a license change.
- [ ] `CONTRIBUTING.md` stating the contribution terms (or "not accepting external
      contributions at this time," which is a valid, protective choice).
- [ ] Consider **copyright registration** (e.g. US Copyright Office) once the app
      is a real asset — registration is what unlocks statutory damages/attorney's
      fees in an infringement suit and is inexpensive relative to that benefit.

---

## Phase 6 — Security & data integrity

"Serious" isn't just licensing — a public (or even private) repo tied to a live
domain, a Vercel account, and (soon) auth + a database needs the account and the
data locked down too. Split into what matters **now** vs. **when auth/DB land**.

### 6a. Account & repo security (do now — cheap, high value)

- [ ] **2FA everywhere that can touch prod:** GitHub, Vercel, Cloudflare
      (registrar/DNS), and the domain email. These accounts *are* the product's
      keys; phishing one of them is the real threat, not repo visibility.
- [ ] **GitHub secret scanning + push protection** — enable on the repo (free for
      public repos) so a committed key is caught *before* it lands. Complements
      the one-time history scan in Phase 1.
- [ ] **Branch protection on `main`:** require PRs (even solo, it forces review of
      agent-generated changes), disallow force-push/deletion, and — pairs with the
      existing `vercel.json` deploy lock — keep prod changes deliberate.
- [ ] **Dependency vulnerability monitoring:** enable **Dependabot** alerts +
      security updates; run `npm audit` in CI. Keeps the CVE-bump pain (cf. the
      Next.js CVE-2025-66478 bump in `hosting-and-auth-direction.md`) from
      recurring silently.
- [ ] **Static code scanning:** enable **CodeQL** (GitHub code scanning, free for
      public repos) for a baseline SAST pass on each push.
- [ ] **Least-privilege access:** review Vercel team members and any GitHub
      collaborators; use scoped/expiring tokens for CI, never personal PATs with
      broad scope. If you grant a recruiter read access (Option 2 above),
      time-box it.
- [ ] **Verify no secrets ship to the client.** Static export bundles *everything*
      to the browser — confirm no real secret is referenced in client code and
      that only `NEXT_PUBLIC_*` values (which are intentionally public) are
      exposed. Anything sensitive must live server-side only (which today means
      *not in this static app at all*).

### 6b. Data integrity (activate when auth + DB arrive — Phases 2/3 of the hosting doc)

Placeholder now; promote to its own plan when `output: "export"` is dropped for
auth. Guardrails already chosen in `hosting-and-auth-direction.md` (Postgres +
ORM, AI via provider-agnostic SDK, secrets as env vars) — extend with:

- [ ] **Secrets management:** all keys in Vercel env vars (scoped per
      environment), never in the repo; rotate on exposure; document what each is.
- [ ] **Database backups & recovery:** enable automated backups (Neon/Supabase
      both offer this) and actually test a restore once.
- [ ] **PII / privacy:** once accounts exist, you're handling user data — add a
      **Privacy Policy** and **Terms of Service** (coordinate with the `/usage`
      page), collect the minimum necessary, and know your obligations (GDPR/CCPA
      if applicable).
- [ ] **Integrity in the DB layer:** use migrations (Drizzle/Prisma), constraints/
      foreign keys, and input validation at the boundary; least-privilege DB
      credentials for the app.
- [ ] **Auth hardening:** secure session cookies, rate-limit auth endpoints, and
      lean on the chosen provider's defaults rather than rolling your own.

---

## Suggested file layout (end state)

```
LICENSE                 # proprietary notice OR chosen source-available text
NOTICE                  # copyright line + attributions pointer
THIRD-PARTY-NOTICES.md  # dependency attributions (from license audit)
TRADEMARK.md            # brand-usage policy (Phase 4)
CONTRIBUTING.md         # contribution terms / DCO-CLA (Phase 5)
SECURITY.md             # responsible-disclosure contact (Phase 6)
README.md               # + "License & usage" section, Instrumaps branding
package.json            # "license": "UNLICENSED" | "SEE LICENSE IN LICENSE"
.github/dependabot.yml  # dependency update automation (Phase 6)
```

---

## Fast path (if you want the 80/20 this weekend)

1. Phase 1 secret scan + dependency license audit (a couple commands).
2. Phase 2 with posture (a): add `LICENSE` (all-rights-reserved), `NOTICE`,
   `package.json` license field, README section.
3. Phase 3 Track A: rename repo → `instrumaps`, **keep it public**, verify Vercel
   still deploys.
4. Phase 6a lite: turn on 2FA, secret scanning + push protection, Dependabot,
   and branch protection on `main`. Add `SECURITY.md`.
5. Phase 4 lite: clearance-search "Instrumaps," slap **™** on the brand, grab the
   handles. File the USPTO application later.

That gets you from "accidental protection" to "deliberate, documented, defensible"
— **public for the portfolio, protected by license + hardening** — without a
lawyer bill. Only the trademark filing and (optional) copyright registration are
paid, lawyer-reviewed steps.

---

## Open questions for the user

- Own IP personally, or set up an LLC now?
- License posture: proprietary source-visible (recommended), source-available, or
  private/closed?
- **Repo visibility: stay public + proprietary license (recommended for the
  portfolio), or go private + curated showcase?**
- Rename the current repo (default) or start fresh (only if history is dirty)?
- Budget/appetite for a USPTO trademark filing now vs. holding ™ common-law rights?
- Any content/data (klezmer dataset, lesson melodies, samples) that is *not* 100%
  your original work?
