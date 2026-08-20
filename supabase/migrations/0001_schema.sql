-- Abhiraj's 21st Birthday — core schema
-- Run in order: 0001_schema.sql, 0002_rls_policies.sql, 0003_storage.sql, then optionally 0004_seed.sql

create extension if not exists "pgcrypto";

-- ============================================================
-- guests
-- ============================================================
create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 80),
  email text not null,
  whatsapp_number text not null,
  profile_image_url text,
  registered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint guests_email_key unique (email)
);

create index if not exists guests_email_idx on public.guests (email);
create index if not exists guests_registered_at_idx on public.guests (registered_at desc);

-- ============================================================
-- wishes
-- ============================================================
create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid references public.guests (id) on delete set null,
  name text not null check (char_length(trim(name)) between 2 and 80),
  email text not null,
  message text not null check (char_length(trim(message)) between 5 and 500),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists wishes_status_idx on public.wishes (status);
create index if not exists wishes_created_at_idx on public.wishes (created_at desc);
create index if not exists wishes_guest_id_idx on public.wishes (guest_id);

-- ============================================================
-- event_settings (single-row-ish config table the admin edits)
-- ============================================================
create table if not exists public.event_settings (
  id uuid primary key default gen_random_uuid(),
  event_title text not null default 'Abhiraj''s 21st Birthday',
  event_description text,
  event_date timestamptz not null,
  event_end_date timestamptz not null,
  venue text,
  address text,
  maps_url text,
  gallery_url text,
  updated_at timestamptz not null default now(),
  constraint event_settings_dates_check check (event_end_date > event_date)
);

-- ============================================================
-- updated_at maintenance
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists guests_set_updated_at on public.guests;
create trigger guests_set_updated_at
  before update on public.guests
  for each row execute function public.set_updated_at();

drop trigger if exists event_settings_set_updated_at on public.event_settings;
create trigger event_settings_set_updated_at
  before update on public.event_settings
  for each row execute function public.set_updated_at();
