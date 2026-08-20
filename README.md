# Abhiraj's 21st Birthday — Celebration Website

A premium, responsive birthday event website built with React, Vite, TypeScript, Tailwind CSS,
Framer Motion, and Supabase (Postgres + Auth + Realtime + Storage).

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS (custom midnight/gold/plum theme, see `tailwind.config.js`)
- Framer Motion for animation
- React Router for routing
- Supabase JS client for the database, auth, storage, and realtime
- react-hot-toast for notifications

## 1. Install

```bash
npm install
```

## 2. Create the Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run the migrations in `supabase/migrations/` **in order**:
   - `0001_schema.sql` — tables, indexes, constraints
   - `0002_rls_policies.sql` — Row Level Security policies
   - `0003_storage.sql` — storage buckets + storage policies
   - `0004_seed.sql` — optional demo data (safe to skip in production)
   - `0005_music_and_photos.sql` — background-music columns + `music` storage bucket
3. In **Authentication → Users**, create one admin user (email + password). This
   is the account used to log into `/admin/login`. Supabase Auth handles
   verification server-side — no admin credentials are stored in this codebase.
4. In **Project Settings → API**, copy the **Project URL** and **anon public key**.

## 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Never put the Supabase **service role key** here — it's not needed by the
frontend and must never ship to the browser.

## 4. Run locally

```bash
npm run dev
```

## 5. Replace placeholder content

- **Photos**: go to **Admin Dashboard → Photos** and upload real photos of Abhiraj — they're stored in the Supabase `gallery` storage bucket and automatically replace the placeholder images on the Home slider and the `/gallery` page. No code changes needed.
- **Event date/time/venue/gallery URL**: don't hardcode — set these from the **Admin Dashboard → Event Settings** tab once Supabase is connected, or directly in the `event_settings` table.
- **Branding text** (name, tagline): `src/config/site.ts`.

## 5b. Background music

Go to **Admin Dashboard → Music**, upload an audio file (stored in the Supabase
`music` bucket) and set the volume with the slider, then Save. A small floating
button appears in the bottom-right corner of the public site to play/pause it.

Note: browsers block audio from starting **with sound** before a visitor
interacts with the page — there's no way around this from any website. The
player tries to start on the visitor's first click/keypress on the site, and
the floating button always lets them start it manually.

## 6. Email notifications (optional, post-launch)

`supabase/functions/send-thank-you-email/index.ts` is a Supabase Edge Function
that emails every registered guest a thank-you note with the gallery link,
using [Resend](https://resend.com). It runs server-side so the Resend API key
is never exposed to the browser.

```bash
supabase functions deploy send-thank-you-email
supabase secrets set RESEND_API_KEY=your_resend_key
```

Trigger it manually after the event (e.g. a button in the admin dashboard that
calls the function URL), or schedule it with `pg_cron` + `pg_net` shortly after
`event_settings.event_end_date`.

## 7. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add the same environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
in the Vercel project's **Settings → Environment Variables**, then redeploy.
Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.

## Project structure

```
src/
  components/       Reusable UI (Hero, CountdownTimer, forms, sliders, admin widgets)
  components/admin/ Admin-only components
  pages/            Route-level pages
  pages/admin/      Admin login + dashboard
  layouts/          PublicLayout wraps public pages with Navbar/Footer
  hooks/            useCountdown, useEventStatus, useRealtimeWishes
  lib/supabase.ts   Typed Supabase client
  services/         guestService, wishService, storageService, adminService
  contexts/         AuthContext, EventSettingsContext
  config/           Branding constants + table/bucket name constants
  types/            Shared TypeScript types (mirrors the Supabase schema)
supabase/
  migrations/       SQL schema, RLS policies, storage buckets, seed data
  functions/        Edge Function for post-event thank-you emails
```

## Security model

- The **anon key** is the only Supabase credential in the frontend. All access
  control is enforced by Postgres Row Level Security (see `0002_rls_policies.sql`):
  - Public visitors can **insert** a registration or a wish, and can **read only
    approved wishes** and public event settings. They can never read guest
    emails/WhatsApp numbers, or pending/rejected wishes.
  - Only authenticated Supabase Auth users (admins) can read guest data, moderate
    wishes, and edit event settings.
- The **service role key** and the **Resend API key** live only in the Edge
  Function's server-side environment (`supabase secrets set …`), never in `.env`
  or the React bundle.

## Changing the event date, time, venue, or gallery URL later

Go to **Admin Dashboard → Event Settings** (requires the admin login you created
in step 2.3) and edit the fields — the whole site (hero countdown, Event page,
calendar link, gallery unlock) reads from this one Supabase row, nothing is
hardcoded elsewhere.

## Testing the full flow

1. Register a guest at `/register` → confirm the row appears in Supabase `guests`.
2. Submit a wish at `/wishes` → confirm it lands in `wishes` with `status = pending`.
3. Log into `/admin/login` → **Wishes** tab → approve it.
4. Back on the public site, the **Wishes Wall** should show the new wish without a
   page refresh (Supabase Realtime).
5. Temporarily set `event_end_date` in the past via **Event Settings** → confirm
   the site switches to "Celebration Completed" and the Gallery page shows the
   gallery link (once `gallery_url` is set).
