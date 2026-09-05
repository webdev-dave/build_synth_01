-- Instrumaps feedback / contributions — universal submissions table.
--
-- Paste this into the Supabase SQL editor (or run via the Supabase CLI) once
-- the project exists. See docs/plans/music-history-map-and-contributions.md,
-- Part 3. Everything the browser does goes through Row-Level Security below;
-- there is no trusted server, so these policies ARE the security model.

-- 1. Enum types -------------------------------------------------------------
do $$ begin
  create type submission_target as enum ('history', 'place', 'song', 'artist', 'genre');
exception when duplicate_object then null; end $$;

do $$ begin
  create type submission_kind as enum ('correction', 'addition', 'source', 'general');
exception when duplicate_object then null; end $$;

do $$ begin
  create type submission_status as enum ('new', 'in-review', 'accepted', 'declined', 'merged');
exception when duplicate_object then null; end $$;

-- 2. Table ------------------------------------------------------------------
create table if not exists public.submissions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  target_type  submission_target not null,
  target_id    text not null,
  kind         submission_kind not null default 'general',
  body         text not null check (char_length(body) between 4 and 8000),
  sources      text[] not null default '{}',
  status       submission_status not null default 'new',
  editor_note  text,
  created_at   timestamptz not null default now()
);

create index if not exists submissions_target_idx
  on public.submissions (target_type, target_id);
create index if not exists submissions_user_idx
  on public.submissions (user_id);
create index if not exists submissions_status_idx
  on public.submissions (status);

-- 3. Row-Level Security -----------------------------------------------------
alter table public.submissions enable row level security;

-- Signed-in users may create rows, but only as themselves.
drop policy if exists "insert own submissions" on public.submissions;
create policy "insert own submissions"
  on public.submissions for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users may read only their own submissions (to show "thanks, received").
drop policy if exists "read own submissions" on public.submissions;
create policy "read own submissions"
  on public.submissions for select
  to authenticated
  using (auth.uid() = user_id);

-- No update/delete policies: contributors cannot edit after sending. The
-- service role (Supabase dashboard / a future private /admin) bypasses RLS
-- entirely, so moderation reads and status changes happen there.

-- 4. Keep-alive target ------------------------------------------------------
-- The free tier pauses a project after 7 days idle. A weekly GitHub Action
-- (.github/workflows/supabase-keepalive.yml) selects from this trivial view
-- to keep the database warm without touching real data.
create or replace view public.keepalive as select now() as pinged_at;
grant select on public.keepalive to anon, authenticated;
