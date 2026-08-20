-- OPTIONAL demo/dev seed data — DEMO DATA, remove before production.
-- Safe to run once against a fresh project for local development.

insert into public.event_settings (event_title, event_description, event_date, event_end_date, venue, address, maps_url, gallery_url)
values (
  'Abhiraj''s 21st Birthday',
  'A private celebration for family and close friends marking a beautiful new chapter.',
  '2026-08-20T18:00:00+05:30',
  '2026-08-20T23:00:00+05:30',
  'The Grand Terrace',
  '221B Celebration Lane, New Delhi',
  'https://maps.google.com/?q=The+Grand+Terrace',
  null
);

-- DEMO DATA
insert into public.guests (full_name, email, whatsapp_number)
values
  ('Rahul Mehta', 'rahul.demo@example.com', '+919876500001'),
  ('Priya Sharma', 'priya.demo@example.com', '+919876500002');

-- DEMO DATA
insert into public.wishes (name, email, message, status)
values
  ('Rahul', 'rahul.demo@example.com', 'Happy Birthday Abhiraj! Wishing you success, happiness and an amazing year ahead.', 'approved'),
  ('Priya', 'priya.demo@example.com', 'Cheers to 21! Can''t wait to celebrate with you tonight.', 'approved'),
  ('Karan', 'karan.demo@example.com', 'Here''s to another year of great stories and better memories.', 'pending');
