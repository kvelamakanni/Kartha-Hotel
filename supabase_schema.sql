-- Run this in Supabase: Project → SQL Editor → New query → Run
-- Safe to re-run: uses IF NOT EXISTS everywhere, so it also upgrades an
-- older copy of this table in place (adds the hotel/room columns below)
-- without touching existing rows.

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  booking_ref text unique,
  status text not null default 'confirmed', -- confirmed | cancelled
  guest_name text not null,
  email text not null,
  hotel_id text,
  hotel_name text not null,
  brand text,
  room_id text,
  room_name text,
  check_in date not null,
  check_out date not null,
  guests int default 1,
  nights int,
  unit_price numeric,
  subtotal numeric,
  promo_code text,
  discount_amount numeric default 0,
  amount numeric default 0,
  created_at timestamptz default now()
);

alter table bookings add column if not exists booking_ref text;
alter table bookings add column if not exists status text not null default 'confirmed';
alter table bookings add column if not exists hotel_id text;
alter table bookings add column if not exists brand text;
alter table bookings add column if not exists room_id text;
alter table bookings add column if not exists room_name text;
alter table bookings add column if not exists nights int;
alter table bookings add column if not exists unit_price numeric;
alter table bookings add column if not exists subtotal numeric;
alter table bookings add column if not exists promo_code text;
alter table bookings add column if not exists discount_amount numeric default 0;

create unique index if not exists bookings_booking_ref_key on bookings(booking_ref);

-- Row Level Security stays ON by default in Supabase.
-- We don't add any public policies here on purpose: the app only ever
-- talks to this table through the Vercel serverless functions, which use
-- the service_role key (server-side only, bypasses RLS). No one can read
-- or write this table directly from a browser.
alter table bookings enable row level security;
