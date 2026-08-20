import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { STORAGE_BUCKETS } from '@/config/supabaseTables'
import type { GalleryPhoto } from '@/types/database'

/**
 * Lists every photo an admin has uploaded to the `gallery` Supabase Storage
 * bucket, newest first. No separate database table — the bucket itself is
 * the source of truth, keeping "photo config" in one place.
 */
export async function listGalleryPhotos(): Promise<GalleryPhoto[]> {
  if (!isSupabaseConfigured) return []

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.gallery)
    .list('', { sortBy: { column: 'created_at', order: 'desc' } })

  if (error || !data) return []

  return data
    .filter((f) => f.name && !f.name.startsWith('.'))
    .map((f) => ({
      name: f.name,
      url: supabase.storage.from(STORAGE_BUCKETS.gallery).getPublicUrl(f.name).data.publicUrl,
      created_at: f.created_at ?? new Date().toISOString(),
    }))
}

export async function uploadGalleryPhoto(file: File): Promise<void> {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.gallery)
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type || 'image/jpeg' })
  if (error) throw new Error(error.message)
}

export async function deleteGalleryPhoto(name: string): Promise<void> {
  const { error } = await supabase.storage.from(STORAGE_BUCKETS.gallery).remove([name])
  if (error) throw error
}
