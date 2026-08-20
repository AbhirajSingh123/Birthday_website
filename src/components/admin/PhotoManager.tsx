import { useRef, useState } from 'react'
import { UploadCloud, Trash2, Loader2, ImageOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useGalleryPhotos } from '@/hooks/useGalleryPhotos'
import { deleteGalleryPhoto, uploadGalleryPhoto } from '@/services/galleryService'
import { isSupabaseConfigured } from '@/lib/supabase'

export default function PhotoManager() {
  const { photos, loading, isDemo, refresh } = useGalleryPhotos()
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    if (!isSupabaseConfigured) {
      toast.error('Connect Supabase to upload photos.')
      return
    }
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        await uploadGalleryPhoto(file)
      }
      toast.success(files.length > 1 ? 'Photos uploaded.' : 'Photo uploaded.')
      await refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed.'
      toast.error(message, { duration: 6000 })
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleDelete(name: string) {
    if (!confirm('Remove this photo from the gallery?')) return
    try {
      await deleteGalleryPhoto(name)
      toast.success('Photo removed.')
      await refresh()
    } catch {
      toast.error('Could not remove photo.')
    }
  }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-champagne">Photos</h3>
          <p className="text-sm text-champagne/50">
            Uploaded photos replace the placeholders on the Home slider and Gallery page.
          </p>
        </div>
        <label className="btn-gold cursor-pointer !px-4 !py-2 text-xs">
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
          {uploading ? 'Uploading…' : 'Upload Photos'}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-gold-500" /></div>
        ) : isDemo ? (
          <div className="rounded-xl border border-dashed border-black/15 py-10 text-center">
            <ImageOff className="mx-auto h-5 w-5 text-champagne/30" />
            <p className="mt-2 text-sm text-champagne/50">
              Showing placeholder photos — upload real ones to replace them.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {photos.map((photo) => (
              <div key={photo.name} className="group relative aspect-square overflow-hidden rounded-xl border border-black/10">
                <img src={photo.url} alt="" className="h-full w-full object-cover" />
                <button
                  onClick={() => handleDelete(photo.name)}
                  aria-label="Delete photo"
                  className="absolute right-1.5 top-1.5 rounded-lg bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
