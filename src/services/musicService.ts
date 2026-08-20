import { supabase } from '@/lib/supabase'
import { STORAGE_BUCKETS } from '@/config/supabaseTables'

/** Uploads a background-music track to the `music` bucket and returns its public URL. */
export async function uploadMusicTrack(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'mp3'
  const path = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.music)
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type || 'audio/mpeg' })
  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from(STORAGE_BUCKETS.music).getPublicUrl(path)
  return data.publicUrl
}
