-- Row Level Security for Abhiraj's 21st Birthday.
-- Model: anonymous ("public") visitors use the anon key; admins are
-- authenticated Supabase Auth users. There is no service-role key in the
-- frontend, so every one of these policies is what actually protects the data.

alter table public.guests enable row level security;
alter table public.wishes enable row level security;
alter table public.event_settings enable row level security;

-- ------------------------------------------------------------
-- guests
-- ------------------------------------------------------------
-- Public: can INSERT a registration, but can never read guest rows back
-- (no public SELECT policy at all — emails/WhatsApp numbers stay private).
drop policy if exists "public can register" on public.guests;
create policy "public can register"
  on public.guests
  for insert
  to anon, authenticated
  with check (true);

-- Admins (any authenticated Supabase Auth user) can read, update, delete.
drop policy if exists "admin can read guests" on public.guests;
create policy "admin can read guests"
  on public.guests
  for select
  to authenticated
  using (true);

drop policy if exists "admin can update guests" on public.guests;
create policy "admin can update guests"
  on public.guests
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "admin can delete guests" on public.guests;
create policy "admin can delete guests"
  on public.guests
  for delete
  to authenticated
  using (true);

-- ------------------------------------------------------------
-- wishes
-- ------------------------------------------------------------
-- Public: can submit a wish (always lands as 'pending' via the column
-- default — enforced below so a crafted insert can't set another status).
drop policy if exists "public can submit wish" on public.wishes;
create policy "public can submit wish"
  on public.wishes
  for insert
  to anon, authenticated
  with check (status = 'pending');

-- Public: can read ONLY approved wishes (powers the public wishes wall +
-- Realtime subscription; pending/rejected rows never reach the browser).
drop policy if exists "public can read approved wishes" on public.wishes;
create policy "public can read approved wishes"
  on public.wishes
  for select
  to anon, authenticated
  using (status = 'approved');

-- Admins: full read (including pending/rejected) + moderation.
drop policy if exists "admin can read all wishes" on public.wishes;
create policy "admin can read all wishes"
  on public.wishes
  for select
  to authenticated
  using (true);

drop policy if exists "admin can update wishes" on public.wishes;
create policy "admin can update wishes"
  on public.wishes
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "admin can delete wishes" on public.wishes;
create policy "admin can delete wishes"
  on public.wishes
  for delete
  to authenticated
  using (true);

-- ------------------------------------------------------------
-- event_settings
-- ------------------------------------------------------------
-- Public: read-only (countdown, venue, gallery link, etc.).
drop policy if exists "public can read event settings" on public.event_settings;
create policy "public can read event settings"
  on public.event_settings
  for select
  to anon, authenticated
  using (true);

-- Admins: can update settings. Row creation is expected to happen once
-- via the seed script / Supabase dashboard, so no public insert policy.
drop policy if exists "admin can update event settings" on public.event_settings;
create policy "admin can update event settings"
  on public.event_settings
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "admin can insert event settings" on public.event_settings;
create policy "admin can insert event settings"
  on public.event_settings
  for insert
  to authenticated
  with check (true);
