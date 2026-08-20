-- Adds background-music support to event_settings and a `music` storage
-- bucket. Run after 0001-0004. The `gallery` bucket (created in
-- 0003_storage.sql) already doubles as the photo-upload destination for
-- the admin Photos tab — no separate photos table needed, the bucket
-- listing is the source of truth (see src/services/galleryService.ts).

alter table public.event_settings
  add column if not exists music_url text,
  add column if not exists music_volume numeric(3, 2) not null default 0.5
    check (music_volume >= 0 and music_volume <= 1);

insert into storage.buckets (id, name, public)
values ('music', 'music', true)
on conflict (id) do nothing;

-- Public read so the site can stream the track without authentication.
drop policy if exists "public can listen to music" on storage.objects;
create policy "public can listen to music"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'music');

-- Only admins can upload/replace/delete music tracks.
drop policy if exists "admin can manage music" on storage.objects;
create policy "admin can manage music"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'music')
  with check (bucket_id = 'music');

-- The existing "admin can manage gallery" policy from 0003_storage.sql
-- already covers admin uploads to the `gallery` bucket used by the
-- Photos tab, so nothing further is needed there.
