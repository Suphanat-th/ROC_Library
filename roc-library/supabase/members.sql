-- Usernames of the site's Members (Member sign-in, /member/login). Run once in the Supabase SQL editor.
-- A Member is a Supabase Auth user the owner invited (turn "Allow new users to sign up" OFF in
-- Authentication > Sign In / Providers). This table only holds the username chosen when the Invite is
-- finished. The Worker reads and writes it with the service key, so no public policy is created:
-- with row level security on and no policy, the browser can neither read nor write it.
create table if not exists public.members (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  username   text        not null check (username ~ '^[a-z0-9_]{3,20}$'),
  created_at timestamptz not null default now()
);

create unique index if not exists members_username_key on public.members (username);

alter table public.members enable row level security;
