# Sketch: Hosting, Domain, and Auth Direction

**Status:** sketch — not a committed plan  
**Date:** 2026-08-22  
**Context:** Domain purchased (`instrumaps.com` via Cloudflare Registrar). Site currently a static Next.js export. Direction is expanding toward accounts, data, lessons/blog, and possibly a lightweight DAW.

This is a working note of the conversation so far. Promote to `docs/plans/` only after decisions harden.

---

## 1. What the product is becoming

Today: a client-side music toy (synth + harmonica lab) on Next.js 15 with `output: "export"`. Live demo was `synth-v01.netlify.app`. Now also live on Vercel at `instrumaps-elidovrichcoding-7145s-projects.vercel.app`.

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

### Current hosting state (as of this sketch)

| Item | Status |
|------|--------|
| Vercel project `instrumaps` | Created, linked to `webdev-dave/build_synth_01`, auto-deploy on `main` |
| Next.js | Bumped 15.1.6 → 15.5.23 (Vercel blocked the old version: CVE-2025-66478) |
| Production URL | https://instrumaps-elidovrichcoding-7145s-projects.vercel.app |
| `netlify.toml` redirect to instrumaps.com | Written locally, **not pushed** until the new domain is live |
| Custom domain + Cloudflare DNS | **Still to do in dashboards** |

### Domain / DNS (remaining)

Registrar stays **Cloudflare**. Hosting is **Vercel**. Do not change nameservers.

1. Vercel → `instrumaps` → Settings → Domains → add `instrumaps.com` and `www.instrumaps.com` (www redirects to apex).
2. Cloudflare DNS, **DNS only (grey cloud)** — not proxied:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Use whatever records Vercel shows if they differ. Orange-cloud proxy in front of Vercel often breaks SSL / causes redirect loops.

After `instrumaps.com` is confirmed live: push the staged `netlify.toml` 301 so `synth-v01.netlify.app/*` → `https://instrumaps.com/:splat`.

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

**Phase 0 — now**  
Domain on Vercel. Keep static export. Netlify redirect after DNS works.

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
- Whether `www` is canonical or redirects to apex (lean: apex)
- App title still “Synth-v01” — rename when the domain is the brand

---

## 6. Next actions (operational, not product)

1. Add `instrumaps.com` + `www` in Vercel Domains
2. Add Cloudflare DNS (grey cloud) as above
3. Confirm HTTPS on the custom domain
4. Push `netlify.toml` redirect
5. Only then start an Auth.js spike on a branch

When this sketch is accepted as the working plan, copy or move a tightened version into `docs/plans/`.
