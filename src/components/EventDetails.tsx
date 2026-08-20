import { MapPin, Clock, CalendarPlus, ExternalLink } from 'lucide-react'
import { useEventSettings } from '@/contexts/EventSettingsContext'
import { useEventStatus } from '@/hooks/useEventStatus'
import CountdownTimer from './CountdownTimer'
import EventStatusBadge from './EventStatusBadge'

function toGoogleCalendarUrl(title: string, startIso: string, endIso: string, details: string, location: string) {
  const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '')
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${fmt(startIso)}/${fmt(endIso)}`,
    details,
    location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export default function EventDetails() {
  const { settings } = useEventSettings()
  const status = useEventStatus(settings.event_date, settings.event_end_date)

  const dateLabel = new Date(settings.event_date).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const timeLabel = new Date(settings.event_date).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  })

  const calendarUrl = toGoogleCalendarUrl(
    settings.event_title,
    settings.event_date,
    settings.event_end_date,
    settings.event_description ?? '',
    settings.venue ?? '',
  )

  return (
    <section id="event-details" className="mx-auto max-w-3xl px-5 py-16">
      <div className="text-center">
        <p className="section-eyebrow">Event Information</p>
        <h2 className="mt-3 text-3xl font-semibold text-champagne sm:text-4xl">{settings.event_title}</h2>
        {settings.event_description && (
          <p className="mx-auto mt-3 max-w-xl text-champagne/60">{settings.event_description}</p>
        )}
        <div className="mt-4 flex justify-center">
          <EventStatusBadge status={status} />
        </div>
      </div>

      <div className="glass mt-10 grid gap-6 rounded-3xl p-6 sm:grid-cols-2 sm:p-8">
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" aria-hidden="true" />
          <div>
            <p className="text-sm text-champagne/50">Date &amp; Time</p>
            <p className="mt-0.5 font-medium text-champagne">{dateLabel}</p>
            <p className="text-champagne/70">{timeLabel} onwards</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" aria-hidden="true" />
          <div>
            <p className="text-sm text-champagne/50">Venue</p>
            <p className="mt-0.5 font-medium text-champagne">{settings.venue || 'To be announced'}</p>
            <p className="text-champagne/70">{settings.address || ''}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {settings.maps_url && (
          <a href={settings.maps_url} target="_blank" rel="noreferrer" className="btn-outline">
            <MapPin className="h-4 w-4" /> Open in Google Maps <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
        <a href={calendarUrl} target="_blank" rel="noreferrer" className="btn-outline">
          <CalendarPlus className="h-4 w-4" /> Add to Calendar
        </a>
      </div>

      {status === 'UPCOMING' && (
        <div className="mt-12">
          <p className="mb-4 text-center text-sm uppercase tracking-[0.2em] text-champagne/40">Counting down</p>
          <CountdownTimer targetIso={settings.event_date} />
        </div>
      )}
      {status === 'LIVE' && (
        <p className="mt-10 text-center font-display text-2xl text-gold-500">Celebration is Live! 🎉</p>
      )}
      {status === 'COMPLETED' && (
        <p className="mt-10 text-center font-display text-2xl text-champagne/80">
          Thank you for being part of the celebration.
        </p>
      )}
    </section>
  )
}
