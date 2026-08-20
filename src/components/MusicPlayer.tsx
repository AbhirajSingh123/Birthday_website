import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEventSettings } from '@/contexts/EventSettingsContext'

/**
 * Site-wide background music. Browsers allow autoplay only when muted, so
 * this starts the track muted the instant the page loads (true autoplay,
 * no visible gap), then unmutes automatically the moment the visitor
 * interacts with the page in any way (click, tap, key press) — which is
 * as close to "plays on open" as any website can get. The floating button
 * is a manual override: it always reflects the real state and lets the
 * visitor stop (or restart) the music at will.
 */
export default function MusicPlayer() {
  const { settings } = useEventSettings()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = settings.music_volume ?? 0.5
  }, [settings.music_volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !settings.music_url) return

    audio.muted = true
    audio.play().catch(() => {})

    function unmuteOnFirstInteraction() {
      if (!audio) return
      audio.muted = false
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }

    window.addEventListener('click', unmuteOnFirstInteraction, { once: true })
    window.addEventListener('keydown', unmuteOnFirstInteraction, { once: true })
    window.addEventListener('touchstart', unmuteOnFirstInteraction, { once: true })
    return () => {
      window.removeEventListener('click', unmuteOnFirstInteraction)
      window.removeEventListener('keydown', unmuteOnFirstInteraction)
      window.removeEventListener('touchstart', unmuteOnFirstInteraction)
    }
  }, [settings.music_url])

  if (!settings.music_url) return null

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.muted = false
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  return (
    <>
      <audio ref={audioRef} src={settings.music_url} loop preload="auto" />
      <motion.button
        onClick={toggle}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        aria-label={playing ? 'Stop background music' : 'Play background music'}
        aria-pressed={playing}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-white/90 px-4 py-3 text-sm font-medium text-champagne shadow-[0_10px_30px_rgba(60,45,20,0.2)] backdrop-blur transition-transform hover:scale-105"
      >
        {playing ? (
          <Volume2 className="h-4 w-4 animate-flicker text-gold-600" />
        ) : (
          <VolumeX className="h-4 w-4 text-champagne/50" />
        )}
        {playing ? 'Music' : 'Play Music'}
      </motion.button>
    </>
  )
}
