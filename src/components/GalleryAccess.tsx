import { ImageIcon, ExternalLink } from 'lucide-react'
import { useEventSettings } from '@/contexts/EventSettingsContext'
import { useEventStatus } from '@/hooks/useEventStatus'

export default function GalleryAccess() {
  const { settings } = useEventSettings()
  const status = useEventStatus(settings.event_date, settings.event_end_date)

  if (status !== 'COMPLETED') {
    return (
      <section className="mx-auto max-w-2xl px-5 py-16 text-center">
        <ImageIcon className="mx-auto h-8 w-8 text-gold-500/60" aria-hidden="true" />
        <h2 className="mt-4 font-display text-2xl text-champagne">Photos &amp; Videos</h2>
        <p className="mt-2 text-champagne/60">
          The post-event gallery unlocks once the celebration wraps up. Check back after 20 August 2026.
        </p>
      </section>
    )
  }

  const galleryUrl = settings.gallery_url

  return (
    <section className="mx-auto max-w-2xl px-5 py-16 text-center">
      <p className="section-eyebrow">After the Party</p>
      <h2 className="mt-3 font-display text-3xl text-champagne">Find Your Birthday Photos</h2>
      <p className="mt-3 text-champagne/60">Your memories from the celebration are waiting for you.</p>

      <div className="mt-8">
        {galleryUrl ? (
          <a href={galleryUrl} target="_blank" rel="noreferrer" className="btn-gold">
            Access Photos &amp; Videos <ExternalLink className="h-4 w-4" />
          </a>
        ) : (
          <p className="text-sm text-champagne/40">
            The gallery link hasn't been added yet — check back soon, or ask the host directly.
          </p>
        )}
      </div>
    </section>
  )
}
