-- Run this in Supabase: Project → SQL Editor → New query → Run

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  email text not null,
  hotel_name text not null,
  check_in date not null,
  check_out date not null,
  guests int default 1,
  amount numeric default 0,
  created_at timestamptz default now()
);

-- Row Level Security stays ON by default in Supabase.
-- We don't add any public policies here on purpose: the app only ever
-- talks to this table through the Vercel serverless functions, which use
-- the service_role key (server-side only, bypasses RLS). No one can read
-- or write this table directly from a browser.
alter table bookings enable row level security;
