import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Loader2, ImageOff } from 'lucide-react'
import { useGalleryPhotos } from '@/hooks/useGalleryPhotos'

const AUTOPLAY_MS = 4500

export default function PhotoCarousel() {
  const { photos, loading } = useGalleryPhotos()
  const [index, setIndex] = useState(0)
  const timerRef = useRef<number>()

  useEffect(() => {
    if (index >= photos.length) setIndex(0)
  }, [photos.length, index])

  useEffect(() => {
    if (photos.length <= 1) return
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % photos.length)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(timerRef.current)
  }, [photos.length])

  function go(delta: number) {
    window.clearInterval(timerRef.current)
    setIndex((i) => (i + delta + photos.length) % photos.length)
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="text-center">
        <p className="section-eyebrow">In Frame</p>
        <h2 className="mt-3 text-3xl font-semibold text-champagne sm:text-4xl">Abhiraj's Photos</h2>
      </div>

      <div className="relative mx-auto mt-10 max-w-xl">
        {loading ? (
          <div className="flex justify-center py-16 text-champagne/40">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : photos.length === 0 ? (
          <div className="glass mx-auto max-w-md rounded-3xl px-8 py-12 text-center">
            <ImageOff className="mx-auto h-6 w-6 text-champagne/30" />
            <p className="mt-3 text-sm text-champagne/60">No photos uploaded yet.</p>
          </div>
        ) : (
          <>
            {/* Polaroid-style frame: fixed aspect ratio + object-cover keeps every
                photo (portrait, landscape, whatever the admin uploads) filling
                the frame cleanly with no distortion or letterboxing. */}
            <div className="rounded-[28px] bg-white p-3 shadow-[0_20px_50px_rgba(60,45,20,0.18)] sm:p-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-midnight-800">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={photos[index].name + index}
                    src={photos[index].url}
                    alt=""
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
              </div>
            </div>

            {photos.length > 1 && (
              <>
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-champagne shadow-md backdrop-blur hover:bg-white sm:-left-5"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/90 p-2.5 text-champagne shadow-md backdrop-blur hover:bg-white sm:-right-5"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="mt-6 flex justify-center gap-1.5">
                  {photos.map((p, i) => (
                    <button
                      key={p.name}
                      aria-label={`Show photo ${i + 1}`}
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
          </>
        )}
      </div>
    </section>
  )
}
