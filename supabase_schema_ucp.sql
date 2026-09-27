-- Run this in Supabase SQL Editor AFTER supabase_schema.sql (needs the
-- `bookings` table to already exist, since completion writes into it).

create table if not exists checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'incomplete', -- incomplete | ready_for_complete | completed | cancelled
  hotel_name text not null,
  check_in date not null,
  check_out date not null,
  guests int default 1,
  nights int not null,
  unit_price numeric not null,
  amount numeric not null,
  guest_name text,
  email text,
  booking_id uuid references bookings(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table checkout_sessions enable row level security;
-- Same pattern as `bookings`: no public policies. Only the Vercel functions,
-- using the service_role key, ever read or write this table.
