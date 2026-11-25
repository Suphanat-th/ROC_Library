-- Messages sent from the Feedback page (/say-something). Run once in the Supabase SQL editor.
-- The site reads and writes with the service key (server-side only), so no public policy is created:
-- with row level security on and no policy, the browser can neither read nor write this table.
create table if not exists public.feedback (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name       text,
  message    text        not null,
  read_at    timestamptz           -- set from the dev Feedback board (/dev/feedback); null = still unread
);

-- For a table created before the dev board existed:
alter table public.feedback add column if not exists read_at timestamptz;

alter table public.feedback enable row level security;
