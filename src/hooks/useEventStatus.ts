import { useEffect, useState } from 'react'
import type { EventStatus } from '@/types/database'

function computeStatus(startIso: string, endIso: string): EventStatus {
  const now = Date.now()
  const start = new Date(startIso).getTime()
  const end = new Date(endIso).getTime()
  if (now < start) return 'UPCOMING'
  if (now >= start && now <= end) return 'LIVE'
  return 'COMPLETED'
}

/** Derives UPCOMING / LIVE / COMPLETED from start+end timestamps, live. */
export function useEventStatus(startIso: string, endIso: string): EventStatus {
  const [status, setStatus] = useState<EventStatus>(() => computeStatus(startIso, endIso))

  useEffect(() => {
    const tick = () => setStatus(computeStatus(startIso, endIso))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [startIso, endIso])

  return status
}
