import { useRef, useState } from 'react'
import { Loader2, Music, Save, UploadCloud, Volume1, Volume2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useEventSettings } from '@/contexts/EventSettingsContext'
import { updateEventSettings } from '@/services/adminService'
import { uploadMusicTrack } from '@/services/musicService'
import { isSupabaseConfigured } from '@/lib/supabase'

export default function MusicSettingsForm() {
  const { settings, refresh, isDemo } = useEventSettings()
  const [musicUrl, setMusicUrl] = useState(settings.music_url ?? '')
  const [volume, setVolume] = useState(Math.round((settings.music_volume ?? 0.5) * 100))
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File | null) {
    if (!file) return
    if (!isSupabaseConfigured) {
      toast.error('Connect Supabase to upload music.')
      return
    }
    setUploading(true)
    try {
      const url = await uploadMusicTrack(file)
      setMusicUrl(url)
      toast.success('Track uploaded — remember to Save.')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed.'
      toast.error(message, { duration: 6000 })
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleSave() {
    if (isDemo) {
      toast.error('Connect Supabase and create an event_settings row before editing.')
      return
    }
    setSaving(true)
    try {
      await updateEventSettings(settings.id, {
        music_url: musicUrl || null,
        music_volume: volume / 100,
      })
      await refresh()
      toast.success('Music settings saved.')
    } catch {
      toast.error('Could not save music settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="glass space-y-5 rounded-2xl p-5">
      <div className="flex items-center gap-2">
        <Music className="h-5 w-5 text-gold-500" />
        <h3 className="font-display text-lg text-champagne">Background Music</h3>
      </div>
      <p className="text-sm text-champagne/50">
        Uploaded music plays for visitors via a floating play button on the site (browsers block
        audio from starting automatically with sound until a visitor interacts with the page).
      </p>

      <div>
        <span className="field-label">Track</span>
        <div className="flex flex-wrap items-center gap-3">
          <label className="btn-outline cursor-pointer !px-4 !py-2 text-xs">
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
            {uploading ? 'Uploading…' : 'Upload Audio'}
            <input
              ref={inputRef}
              type="file"
              accept="audio/*"
              className="sr-only"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              disabled={uploading}
            />
          </label>
          {musicUrl && <audio src={musicUrl} controls className="h-9 max-w-[220px]" />}
        </div>
      </div>

      <div>
        <label htmlFor="music-volume" className="field-label">
          Volume — {volume}%
        </label>
        <div className="flex items-center gap-3">
          <Volume1 className="h-4 w-4 shrink-0 text-champagne/40" />
          <input
            id="music-volume"
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-black/10 accent-gold-500"
          />
          <Volume2 className="h-4 w-4 shrink-0 text-champagne/40" />
        </div>
      </div>

      <button onClick={handleSave} className="btn-gold" disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? 'Saving…' : 'Save Music Settings'}
      </button>
    </div>
  )
}
