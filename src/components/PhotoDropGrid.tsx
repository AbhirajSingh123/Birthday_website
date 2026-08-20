import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, ImageOff } from 'lucide-react'
import { useGalleryPhotos } from '@/hooks/useGalleryPhotos'

/**
 * Gallery-page photo grid: each image "drops" into place on load/scroll
 * (see the `dropIn` keyframes in tailwind.config.js), then gets a playful
 * hover lift + tilt as a second, independent motion layer. Click opens a
 * spring-animated lightbox.
 */
export default function PhotoDropGrid() {
  const { photos, loading } = useGalleryPhotos()
  const [active, setActive] = useState<number | null>(null)

  if (loading) {
    return (
      <div className="flex justify-center py-16 text-champagne/40">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="glass mx-auto max-w-md rounded-3xl px-8 py-12 text-center">
        <ImageOff className="mx-auto h-6 w-6 text-champagne/30" />
        <p className="mt-3 text-sm text-champagne/60">No photos uploaded yet.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((photo, i) => (
          <motion.button
            key={photo.name}
            onClick={() => setActive(i)}
            initial={{ opacity: 0, y: -60, rotate: -3 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: 0.7,
              delay: (i % 8) * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -6, rotate: i % 2 === 0 ? -1.5 : 1.5, scale: 1.03 }}
            className="group aspect-square overflow-hidden rounded-2xl border border-black/[0.06] shadow-[0_10px_30px_rgba(60,45,20,0.12)]"
          >
            <img
              src={photo.url}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/90 p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            onClick={() => setActive(null)}
          >
            <button
              className="absolute right-5 top-5 rounded-full bg-white/15 p-2 text-white"
              onClick={() => setActive(null)}
              aria-label="Close photo viewer"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              initial={{ scale: 0.85, opacity: 0, y: -30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              src={photos[active].url}
              alt=""
              className="max-h-[85vh] max-w-full rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
