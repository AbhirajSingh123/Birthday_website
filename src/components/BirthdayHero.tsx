import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircleHeart, CalendarHeart } from 'lucide-react'
import CountdownTimer from './CountdownTimer'
import EventStatusBadge from './EventStatusBadge'
import FloatingCandles from './FloatingCandles'
import { useEventSettings } from '@/contexts/EventSettingsContext'
import { useEventStatus } from '@/hooks/useEventStatus'
import { SITE } from '@/config/site'

export default function BirthdayHero() {
  const { settings } = useEventSettings()
  const status = useEventStatus(settings.event_date, settings.event_end_date)
  const eventDateLabel = new Date(settings.event_date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-16 sm:pt-24">
      <FloatingCandles />

      {/* Oversized "21" watermark — the signature element the rest of the
          page's numerals and rules echo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 select-none font-display text-[280px] font-light leading-none text-gold-500/[0.06] sm:text-[420px]"
      >
        21
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="section-eyebrow"
        >
          {eventDateLabel} · Private Celebration
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 text-4xl font-semibold leading-[1.1] text-champagne sm:text-6xl"
        >
          Welcome to {SITE.guestOfHonor.split(' ')[0]}'s{' '}
          <span className="bg-gold-foil bg-clip-text text-transparent">21st Birthday</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-5 max-w-xl text-base text-champagne/70 sm:text-lg"
        >
          {SITE.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 flex justify-center"
        >
          <EventStatusBadge status={status} />
        </motion.div>

        {status !== 'COMPLETED' && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mx-auto mt-10 max-w-lg"
          >
            <CountdownTimer targetIso={settings.event_date} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/register" className="btn-gold">
            Register for the Celebration <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/wishes" className="btn-outline">
            <MessageCircleHeart className="h-4 w-4" /> Send Birthday Wish
          </Link>
          <Link to="/event" className="btn-outline">
            <CalendarHeart className="h-4 w-4" /> View Event Details
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
