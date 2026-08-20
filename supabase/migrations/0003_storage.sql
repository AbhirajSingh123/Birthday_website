-- Storage buckets: public profile photos (guest-uploaded) and gallery assets.
-- Run this after 0001/0002. Requires the storage extension (enabled by default on Supabase).

insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- Anyone can upload a profile photo during registration (write-only from
-- the public's perspective — they can't list/delete others' files).
drop policy if exists "public can upload profile photos" on storage.objects;
create policy "public can upload profile photos"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'profile-photos');

-- Public read for both buckets (photos are meant to be displayed on the site).
drop policy if exists "public can view profile photos" on storage.objects;
create policy "public can view profile photos"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'profile-photos');

drop policy if exists "public can view gallery" on storage.objects;
create policy "public can view gallery"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'gallery');

-- Only admins can manage gallery assets and delete any storage object.
drop policy if exists "admin can manage gallery" on storage.objects;
create policy "admin can manage gallery"
  on storage.objects
  for all
  to authenticated
  using (bucket_id in ('gallery', 'profile-photos'))
  with check (bucket_id in ('gallery', 'profile-photos'));
