# Sketch: Hosting, Domain, and Auth Direction

**Status:** hosting/domain = DONE (live); auth = still a sketch  
**Date:** 2026-08-22 (updated same day)  
**Context:** Domain purchased (`instrumaps.com` via Cloudflare Registrar). Site is a static Next.js export, now live on Vercel at the custom domain. Direction is expanding toward accounts, data, lessons/blog, and possibly a lightweight DAW.

The hosting section below reflects the finished setup. The auth section is still a working note — promote a tightened version to `docs/plans/` when auth decisions harden.

---

## 1. What the product is becoming

Today: a client-side music toy (synth + harmonica lab) on Next.js 15 with `output: "export"`. **Live at https://instrumaps.com** (Vercel). Old `synth-v01.netlify.app` now 301-redirects here.

Near-term / possible directions:

- Custom domain: **instrumaps.com**
- Lesson / theory pages with interactive screens (MDX-style)
- Blog / log pages
- User accounts so people can save work across devices
- A database for presets, sessions, shared projects
- Lightweight DAW / interactive playgrounds
- AI features later (song interpretation, scale recognition, sound design)

Builder profile: solo, weekends, passion project, **AI-agent-first** coding. Optimize for smooth agent DX, but keep cost low and the option to leave a vendor.

---

## 2. Hosting: why Vercel (for now)

### Why the recommendation flipped

For the *current* static site, Cloudflare Pages was the cleaner technical match (domain already at Cloudflare, unlimited free bandwidth, commercial use allowed). That changed once the future included auth, a DB, dynamic pages, and heavy agent coding.

Vercel wins on **this** profile because:

- Next.js + Vercel is the stack agents know best
- Preview deploys per branch/PR — useful for checking agent work on a phone
- Can grow static → auth → DB → AI on one platform without a host rewrite
- AI Gateway is already appealing for later AI features
- Hobby plan is fine while the site stays non-commercial

Cloudflare Pages still wins on: unlimited free bandwidth, cheaper at scale, no Hobby commercial-use restriction, native D1/R2/Workers. Revisit if cost or a viral spike becomes the bottleneck.

Netlify: already worked; keep only as a 301 redirect host for old links.

### Current hosting state (DONE)

| Item | Status |
|------|--------|
| Vercel project `instrumaps` | Live. Linked to `webdev-dave/build_synth_01`. Team scope `elidovrichcoding-7145s-projects`. |
| Next.js | Bumped 15.1.6 → 15.5.23 (Vercel blocked the old version: CVE-2025-66478) |
| Custom domain | `instrumaps.com` live over HTTPS; `www` → apex via 308 redirect (set in Vercel) |
| Cloudflare DNS | `A @ 76.76.21.21` and `A www 76.76.21.21`, both **DNS only (grey cloud)**. Nameservers unchanged (Cloudflare). |
| Old Netlify site | `synth-v01.netlify.app` 301-redirects to instrumaps.com via `netlify.toml`. **Builds stopped** on Netlify (see below). |
| `main` auto-deploy | **Disabled** (locked) via `vercel.json` — see "Deploy control". |

### Domain / DNS (done — reference)

Registrar stays **Cloudflare**; hosting is **Vercel**; nameservers unchanged.

Records that worked (Vercel's card recommended the plain A method):

| Type | Name | Value | Proxy |
|------|------|-------|-------|
| A | `@` | `76.76.21.21` | DNS only (grey) |
| A | `www` | `76.76.21.21` | DNS only (grey) |

Gotcha learned: right after setup, a resolver (phone hotspot) can lag and say
"site can't be reached" while public DNS (1.1.1.1 / 8.8.8.8) already resolves.
Fix = `ipconfig /flushdns` + wait, or temporarily set DNS to 1.1.1.1. Not a
Cloudflare/Vercel problem. Orange-cloud proxy in front of Vercel would break SSL —
keep it grey.

### Deploy control (Option A: locked main + rollback)

`vercel.json` sets `git.deploymentEnabled.main = false`, so **pushing to `main`
does NOT change the live site**. Production is frozen at the last deliberately
shipped build.

- Ship a new version: `vercel --prod --scope elidovrichcoding-7145s-projects`
  (manual CLI deploys ignore the git lock), OR set `deploymentEnabled.main` to
  `true` in `vercel.json` and push.
- Feature branches still auto-build as preview URLs — only `main` is locked.
- Safety net: `vercel rollback <url|id>` / `vercel promote <url|id>`, or Instant
  Rollback in the dashboard.
- Also captured as an always-apply Cursor rule: `.cursor/rules/deployment.mdc`.

### Netlify (redirect only)

Kept solely to forward old `synth-v01.netlify.app` links (only Netlify can
redirect its own subdomain). **Builds are Stopped** (Site config → Build & deploy
→ Stopped builds), so pushes no longer trigger Netlify builds; the last published
deploy keeps serving the 301. Delete the Netlify site later (months out) once old
links have faded — via General → Danger zone.

### Lock-in / leaving Vercel later

Leaving is easy **if** we avoid Vercel-only primitives.

| Tier | Examples | Exit cost |
|------|----------|-----------|
| Trivial | App code, Next.js, static export, AI SDK, Postgres on Neon | Redeploy elsewhere |
| Medium | SSR / Server Components, cron, image opt, Edge Middleware | Adapter or Node host; config work |
| Real lock-in | Vercel Blob, KV, Edge Config, platform-only helpers | Swap service + code |

Escape hatches: `next start` on any Node/Docker host, OpenNext (Cloudflare/AWS), Netlify Next runtime.

**Guardrails:**

- Data in **Postgres + ORM** (Drizzle or Prisma), not Vercel KV
- AI via **Vercel AI SDK** (provider-agnostic)
- Wrap Blob/KV behind a small interface if we ever use them
- Secrets as env vars

Usual reason people leave Vercel is **cost at scale**, not technical lock-in. Stay portable; migrate only if bills dominate.

**Inflection point:** adding auth or a real DB means dropping `output: "export"` and using standard Next.js server rendering on Vercel.

---

## 3. Auth: options and current lean

### Comparison

| Option | Type | DX | Control / portability | Cost | Google login |
|--------|------|----|------------------------|------|--------------|
| **Clerk** | Managed SaaS | Fastest; prebuilt UI; already used on other projects | Users live in Clerk | Free ~10k MAU, then paid | Flip a switch; shared dev creds |
| **Auth.js** (NextAuth v5) | Self-hosted library | Good; most agent training data | Full — our DB | Free (DB + email) | `GoogleProvider` + env vars |
| **Better Auth** | Self-hosted, TS-first | Very good; 2FA/passkeys/orgs built in | Full — our DB | Free | Social provider block |
| **Supabase Auth** | Open-source BaaS | Very good **if** we also use Supabase DB | High; self-hostable | Generous free | Dashboard + `signInWithOAuth` |
| WorkOS AuthKit | Managed / SSO | Good | Medium | Free to high MAU | Supported |

Lucia is retired — do not use.

Google OAuth is easy on all of these. Shared setup: Google Cloud OAuth client, redirect URIs for localhost + `instrumaps.com`, publish the consent screen when leaving testing mode.

### Why Auth.js is the interesting first try

- Never set up auth from scratch — good learning pass
- Already familiar with Clerk; can fall back to Clerk in a weekend if Auth.js is painful
- SQL / own-user-store is appealing (users live in *our* database)
- Agents handle Auth.js plumbing well (lots of examples)
- Matches the “control + cost + leave-Vercel-later” priorities

### Why Supabase stays on the table

If we later want **DB + auth + storage as one stack**, Supabase Auth + Postgres is a coherent alternative to “Auth.js + Neon.” Don’t pick it only for auth. Pick it if we want the whole Supabase product (dashboard, RLS, storage, realtime). Mixing Clerk/Auth.js with Supabase DB is possible but two vendors for one concern.

### Tentative stack (not committed)

```
Next.js on Vercel
  → Auth.js (Google first; email/magic-link later)
  → Drizzle (or Prisma) ORM
  → Neon Postgres
  → Resend for verification / magic-link email
```

Fallback: Clerk, same app, swap the auth layer.

Alt if we go all-in on one BaaS: Supabase Auth + Supabase Postgres.

---

## 4. Phased product path (loose)

Do not over-build. Each phase only when the feature is actually needed.

**Phase 0 — DONE**  
Domain live on Vercel (`instrumaps.com`). Static export kept. Netlify redirect in
place, Netlify builds stopped. `main` locked (manual/rollback deploys).

**Phase 1 — content**  
Blog + lesson pages (MDX + interactive React). Can stay mostly static.

**Phase 2 — auth**  
Auth.js + Google. Drop `output: "export"`. Session-aware UI (save presets later).

**Phase 3 — data**  
Neon + Drizzle: users, saved presets, favorite scales, shared projects.

**Phase 4 — AI / DAW shell**  
Audio stays in the browser (Web Audio). Hosting only owns accounts, save, share, and any server AI. AI Gateway + AI SDK when those features exist.

---

## 5. Open questions

- Confirm Auth.js vs later Clerk fallback vs Supabase-full-stack
- Commercial vs hobby (affects Vercel Hobby vs Pro ~$20/mo)
- Drizzle vs Prisma
- Neon vs Supabase Postgres
- App title still “Synth-v01” — rename when the domain is the brand

Resolved: `www` → apex (308) ✓ · host = Vercel ✓ · deploy control = locked main + rollback ✓

---

## 6. Next actions

Hosting/domain (Phase 0) is complete. Remaining, in rough order:

- [ ] Rename app title "Synth-v01" → Instrumaps; update README live-demo link
- [ ] Start an Auth.js + Google spike on a feature branch (preview URL)
- [ ] Decide Drizzle vs Prisma, Neon vs Supabase Postgres (Phase 3)
- [ ] Months out: delete the Netlify site once old links have faded

Done: Next.js CVE bump, Vercel project + custom domain + HTTPS, `www`→apex,
Cloudflare DNS, Netlify 301 redirect, Netlify builds stopped, `main` deploy lock,
`.cursor/rules/deployment.mdc`.

When auth decisions harden, copy a tightened version into `docs/plans/`.
