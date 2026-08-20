import type { EventStatus } from '@/types/database'

const COPY: Record<EventStatus, { label: string; dot: string }> = {
  UPCOMING: { label: 'Coming Soon', dot: 'bg-gold-500' },
  LIVE: { label: 'Event is Live', dot: 'bg-emerald-400 animate-pulse' },
  COMPLETED: { label: 'Celebration Completed', dot: 'bg-champagne/35' },
}

export default function EventStatusBadge({ status }: { status: EventStatus }) {
  const { label, dot } = COPY[status]
  return (
    <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-champagne/90">
      <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </span>
  )
}
