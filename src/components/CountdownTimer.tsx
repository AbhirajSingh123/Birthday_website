import { motion } from 'framer-motion'
import { useCountdown } from '@/hooks/useCountdown'

interface Props {
  targetIso: string
  compact?: boolean
}

const UNITS: Array<{ key: 'days' | 'hours' | 'minutes' | 'seconds'; label: string }> = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
]

export default function CountdownTimer({ targetIso, compact = false }: Props) {
  const countdown = useCountdown(targetIso)

  if (countdown.isPast) return null

  return (
    <div
      className={`grid grid-cols-4 ${compact ? 'gap-2' : 'gap-3 sm:gap-4'}`}
      role="timer"
      aria-live="polite"
      aria-label="Countdown to the celebration"
    >
      {UNITS.map((unit) => (
        <div
          key={unit.key}
          className={`glass rounded-2xl text-center ${compact ? 'px-2 py-3' : 'px-3 py-5 sm:px-5 sm:py-6'}`}
        >
          <motion.span
            key={`${unit.key}-${countdown[unit.key]}`}
            initial={{ opacity: 0.4, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`block font-display font-semibold text-gold-500 ${
              compact ? 'text-xl' : 'text-3xl sm:text-4xl'
            }`}
          >
            {String(countdown[unit.key]).padStart(2, '0')}
          </motion.span>
          <span className={`mt-1 block uppercase tracking-[0.2em] text-champagne/50 ${compact ? 'text-[10px]' : 'text-xs'}`}>
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  )
}
