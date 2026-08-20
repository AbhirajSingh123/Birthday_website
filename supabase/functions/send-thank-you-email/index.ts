// Supabase Edge Function: send-thank-you-email
//
// Sends the post-event "thank you + gallery link" email to registered
// guests. Runs server-side so the Resend API key never touches the
// React frontend bundle.
//
// Deploy:
//   supabase functions deploy send-thank-you-email
//   supabase secrets set RESEND_API_KEY=your_key_here
//
// Trigger options (pick one):
//   1. Manual/admin trigger — call this function from the Admin Dashboard
//      with a service-role-authenticated request once the event ends.
//   2. Scheduled — use Supabase's pg_cron + pg_net (or an external
//      scheduler) to POST here shortly after `event_settings.event_end_date`.
//
// This function itself only ever uses the service-role key *inside* Supabase's
// server environment (via SUPABASE_SERVICE_ROLE_KEY, injected automatically
// for edge functions) — it is never shipped to the browser.

// @ts-expect-error - Deno global is provided by the Supabase Edge Runtime
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
// @ts-expect-error - Deno global is provided by the Supabase Edge Runtime
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
// @ts-expect-error - Deno global is provided by the Supabase Edge Runtime
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

interface Guest {
  id: string
  full_name: string
  email: string
}

interface EventSettings {
  event_title: string
  gallery_url: string | null
}

function buildEmailHtml(guestName: string, eventTitle: string, galleryUrl: string) {
  return `
  <div style="font-family:Georgia,serif;background:#0b0b14;color:#f4ecd8;padding:32px;border-radius:16px;max-width:520px;margin:auto;">
    <p style="color:#c9a24b;letter-spacing:2px;font-size:12px;text-transform:uppercase;">Thank You</p>
    <h1 style="font-size:24px;margin:8px 0 16px;">Thank you for celebrating ${eventTitle}!</h1>
    <p style="line-height:1.6;color:#f4ecd8cc;">
      Hi ${guestName}, it meant so much to have you there. Your photos and videos
      from the celebration are ready whenever you'd like to relive the night.
    </p>
    <a href="${galleryUrl}"
       style="display:inline-block;margin-top:20px;padding:12px 24px;border-radius:999px;background:#c9a24b;color:#0b0b14;text-decoration:none;font-weight:600;">
      Access Photos &amp; Videos
    </a>
  </div>`
}

// @ts-expect-error - Deno.serve is provided by the Supabase Edge Runtime
Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }
  if (!RESEND_API_KEY || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'Missing server configuration' }), { status: 500 })
  }

  const settingsRes = await fetch(
    `${SUPABASE_URL}/rest/v1/event_settings?select=event_title,gallery_url&limit=1`,
    { headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` } },
  )
  const [settings] = (await settingsRes.json()) as EventSettings[]
  if (!settings?.gallery_url) {
    return new Response(JSON.stringify({ error: 'gallery_url not set in event_settings' }), { status: 400 })
  }

  const guestsRes = await fetch(`${SUPABASE_URL}/rest/v1/guests?select=id,full_name,email`, {
    headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
  })
  const guests = (await guestsRes.json()) as Guest[]

  const results = await Promise.allSettled(
    guests.map((guest) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Abhiraj\'s Birthday <celebration@yourdomain.com>',
          to: guest.email,
          subject: `Thank you for celebrating ${settings.event_title}!`,
          html: buildEmailHtml(guest.full_name, settings.event_title, settings.gallery_url as string),
        }),
      }),
    ),
  )

  const sent = results.filter((r) => r.status === 'fulfilled').length
  return new Response(JSON.stringify({ sent, total: guests.length }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
