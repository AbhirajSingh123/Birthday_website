import { useCallback, useEffect, useState } from 'react'
import { listGalleryPhotos } from '@/services/galleryService'
import { isSupabaseConfigured } from '@/lib/supabase'
import type { GalleryPhoto } from '@/types/database'

// Placeholder photos shown until the admin uploads real ones (or while
// Supabase isn't connected yet), so the page never looks broken/empty.
const DEMO_PHOTOS: GalleryPhoto[] = [
  { name: 'demo-1', url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80', created_at: '' },
  { name: 'demo-2', url: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800&q=80', created_at: '' },
  { name: 'demo-3', url: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&q=80', created_at: '' },
  { name: 'demo-4', url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80', created_at: '' },
  { name: 'demo-5', url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80', created_at: '' },
  { name: 'demo-6', url: 'https://images.unsplash.com/photo-1541676820604-9e9b5ee2f8b3?w=800&q=80', created_at: '' },
]

export function useGalleryPhotos() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    if (!isSupabaseConfigured) {
      setPhotos(DEMO_PHOTOS)
      setIsDemo(true)
      setLoading(false)
      return
    }
    const uploaded = await listGalleryPhotos()
    if (uploaded.length === 0) {
      setPhotos(DEMO_PHOTOS)
      setIsDemo(true)
    } else {
      setPhotos(uploaded)
      setIsDemo(false)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { photos, loading, isDemo, refresh }
}
