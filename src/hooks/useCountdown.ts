import { useEffect, useState } from 'react'

export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalMs: number
  isPast: boolean
}

function diffToCountdown(targetMs: number): Countdown {
  const totalMs = targetMs - Date.now()
  const isPast = totalMs <= 0
  const clamped = Math.max(totalMs, 0)
  const days = Math.floor(clamped / (1000 * 60 * 60 * 24))
  const hours = Math.floor((clamped / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((clamped / (1000 * 60)) % 60)
  const seconds = Math.floor((clamped / 1000) % 60)
  return { days, hours, minutes, seconds, totalMs, isPast }
}

/** Live countdown to an ISO timestamp, recalculated every second. */
export function useCountdown(targetIso: string): Countdown {
  const targetMs = new Date(targetIso).getTime()
  const [countdown, setCountdown] = useState<Countdown>(() => diffToCountdown(targetMs))

  useEffect(() => {
    const tick = () => setCountdown(diffToCountdown(targetMs))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [targetMs])

  return countdown
}
