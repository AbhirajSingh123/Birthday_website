import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Loader2 } from 'lucide-react'
import { useRealtimeWishes } from '@/hooks/useRealtimeWishes'

const AUTOPLAY_MS = 5000

export default function WishSlider() {
  const { wishes, loading } = useRealtimeWishes()
  const [index, setIndex] = useState(0)
  const timerRef = useRef<number>()

  useEffect(() => {
    if (index >= wishes.length) setIndex(0)
  }, [wishes.length, index])

  useEffect(() => {
    if (wishes.length <= 1) return
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % wishes.length)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(timerRef.current)
  }, [wishes.length])

  function go(delta: number) {
    window.clearInterval(timerRef.current)
    setIndex((i) => (i + delta + wishes.length) % wishes.length)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16 text-champagne/40">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (wishes.length === 0) {
    return (
      <div className="glass mx-auto max-w-md rounded-3xl px-8 py-12 text-center">
        <p className="font-display text-lg text-champagne">No wishes yet</p>
        <p className="mt-2 text-sm text-champagne/60">
          Be the first to send Abhiraj a birthday wish — approved wishes appear here live.
        </p>
      </div>
    )
  }

  const current = wishes[index]

  return (
    <div className="relative mx-auto max-w-2xl" role="region" aria-roledescription="carousel" aria-label="Birthday wishes">
      <div className="relative min-h-[220px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
            className="glass rounded-3xl p-8 text-center sm:p-10"
          >
            <Quote className="mx-auto h-6 w-6 text-gold-500/60" aria-hidden="true" />
            <p className="mt-4 text-lg leading-relaxed text-champagne sm:text-xl">{current.message}</p>
            <p className="mt-5 font-display text-gold-500">— {current.name}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {wishes.length > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Previous wish"
            className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 rounded-full bg-black/[0.05] p-2 text-champagne hover:bg-black/10 sm:-translate-x-12"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next wish"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full bg-black/[0.05] p-2 text-champagne hover:bg-black/10 sm:translate-x-12"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-6 flex justify-center gap-1.5" role="tablist" aria-label="Wish slides">
            {wishes.map((w, i) => (
              <button
                key={w.id}
                role="tab"
                aria-selected={i === index}
                aria-label={`Show wish ${i + 1}`}
                onClick={() => {
                  window.clearInterval(timerRef.current)
                  setIndex(i)
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-6 bg-gold-500' : 'w-1.5 bg-black/15'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
