# Supabase setup — owner runbook

> Companion to `music-history-map-and-contributions.md` (Part 3). All the
> **code is already in the repo and dormant**: until the two env vars below
> exist, every "Suggest an improvement" affordance falls back to the /contact
> link and nothing touches Supabase. Completing this runbook flips it live.
> Expected time: ~20 minutes, all free tier.

## What's already built (no action needed)

| Piece | Where |
|---|---|
| Browser client (env-driven, null until configured) | `src/lib/supabase/client.ts` |
| Auth context: Google SSO + email magic link, no passwords | `src/components/auth/AuthProvider.tsx` (mounted in `src/app/layout.tsx`) |
| Suggestion flow: sign-in gate → form → insert | `src/components/feedback/FeedbackButton.tsx` |
| Footers on articles + every map panel | `src/components/content/FeedbackInvite.tsx`, `src/components/map/MapPanel.tsx` |
| DB schema + RLS policies + keepalive view | `supabase/migrations/0001_submissions.sql` |
| Weekly keep-alive ping (skips until secrets set) | `.github/workflows/supabase-keepalive.yml` |

## Step 1 — Create the Supabase project

1. Sign up / sign in at [supabase.com](https://supabase.com) (GitHub login is fine).
2. **New project** → org: personal; name: `instrumaps`; region: pick close to
   your users (e.g. `us-east-1`); generate a strong DB password and store it
   in your password manager (you rarely need it — the dashboard does most work).
3. Wait ~2 min for provisioning. Then from **Project Settings → API** copy:
   - **Project URL** (`https://<ref>.supabase.co`)
   - **anon / public key** (the long JWT under "Project API keys")

   The anon key is *meant* to be public — Row-Level Security is the actual
   security layer. Never copy the `service_role` key into the app.

## Step 2 — Run the migration

1. Dashboard → **SQL Editor** → New query.
2. Paste the entire contents of `supabase/migrations/0001_submissions.sql`
   and **Run**. It's idempotent (safe to re-run).
3. Verify: **Table Editor** should now show `submissions` with RLS enabled.

## Step 3 — Auth providers

### Email magic link (2 clicks)

Dashboard → **Authentication → Sign In / Up → Email**: leave **Email** enabled,
and you can disable "Enable password sign-ups" if offered — the app only ever
sends magic links (`signInWithOtp`).

### Google SSO (the one fiddly part)

1. [Google Cloud console](https://console.cloud.google.com) → create a project
   (e.g. `instrumaps-auth`) → **APIs & Services → OAuth consent screen**:
   - User type: **External**; app name `Instrumaps`; your support email;
     scopes: just the default (email/profile). Publish the app.
2. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Type: **Web application**, name `Supabase`.
   - **Authorized redirect URI** — exactly one, from Supabase:
     `https://<ref>.supabase.co/auth/v1/callback`
     (shown verbatim in Supabase → Authentication → Sign In / Up → Google).
3. Copy the **Client ID** and **Client secret** into Supabase →
   **Authentication → Sign In / Up → Google** → enable → save.

### Redirect URLs (so users land back on the page they left)

Dashboard → **Authentication → URL Configuration**:
- **Site URL**: `https://instrumaps.com`
- **Additional redirect URLs**:
  - `http://localhost:3000/**`
  - `https://instrumaps.com/**`
  - `https://www.instrumaps.com/**`
  - (optional) `https://*-elidovrichcoding-7145s-projects.vercel.app/**` for previews

## Step 4 — Env vars

The app reads two public env vars **at build time** (static export bakes them
into the JS):

```
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

- **Local:** create `.env.local` in the repo root with those two lines
  (`.env*` is gitignored), then restart `npm run dev`.
- **Vercel:** Project `instrumaps` → Settings → Environment Variables → add
  both for Production + Preview. They take effect on the **next deploy** —
  remember production deploys are manual
  (`vercel --prod --scope elidovrichcoding-7145s-projects`).

## Step 5 — Keep-alive secrets (free-tier anti-pause)

GitHub repo `webdev-dave/build_synth_01` → Settings → Secrets and variables →
Actions → add:
- `SUPABASE_URL` — same project URL
- `SUPABASE_ANON_KEY` — same anon key

The workflow pings twice a week; you can test it immediately via
Actions → "Supabase keep-alive" → Run workflow.

## Step 6 — Verify end-to-end

1. `npm run dev` with `.env.local` in place → open `/history/klezmer` →
   "Suggest an improvement" should now open the **modal** (not /contact).
2. Sign in with the email magic link (arrives from `noreply@mail.app.supabase.io`).
3. Send a test suggestion → dashboard → Table Editor → `submissions` →
   the row should be there with your `user_id`.
4. Repeat once with Google sign-in.
5. Sanity-check RLS from an incognito window: the table is invisible without
   sign-in, and another account can't read your row.

## Moderation (for now)

Read and triage rows in the Supabase dashboard (Table Editor → `submissions`,
filter `status = new`; set `status` / `editor_note` by hand). Accepted items
get folded into the git registries as usual — git remains the source of
truth. A tiny private `/admin` page is Phase 5, when volume justifies it.

## Later niceties (not now)

- Custom auth domain `auth.instrumaps.com` so Google's consent screen shows
  our name instead of `<ref>.supabase.co` (needs Supabase Pro).
- Email templates branded to Instrumaps (Authentication → Emails).
