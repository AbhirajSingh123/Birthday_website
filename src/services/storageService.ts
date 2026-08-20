import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { STORAGE_BUCKETS } from '@/config/supabaseTables'

/** Uploads an optional guest profile photo and returns its public URL. */
export async function uploadProfilePhoto(file: File): Promise<string | null> {
  if (!isSupabaseConfigured) return null

  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.profilePhotos)
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  const { data } = supabase.storage.from(STORAGE_BUCKETS.profilePhotos).getPublicUrl(path)
  return data.publicUrl
}
