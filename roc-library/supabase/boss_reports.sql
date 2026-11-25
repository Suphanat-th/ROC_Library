-- Spawn reports sent from the MVP Hunter (/mvp). Run once in the Supabase SQL editor.
-- The site reads and writes with the service key (server-side only), so no public policy is created:
-- with row level security on and no policy, the browser can neither read nor write this table.
create table if not exists public.boss_reports (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  monster_id   integer     not null,
  monster_name text        not null,
  spawn_map    text        not null,
  listed       text        not null, -- the Respawn window the page showed when the report was sent
  problem      text        not null,
  detail       text        not null,
  name         text,
  fixed_at     timestamptz           -- set from the dev report board (/dev/mvp-reports); null = still open
);

-- For a table created before the dev board existed:
alter table public.boss_reports add column if not exists fixed_at timestamptz;

alter table public.boss_reports enable row level security;
