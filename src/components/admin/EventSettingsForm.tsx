import { FormEvent, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { useEventSettings } from '@/contexts/EventSettingsContext'
import { updateEventSettings } from '@/services/adminService'

function toLocalInput(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function EventSettingsForm() {
  const { settings, refresh, isDemo } = useEventSettings()
  const [form, setForm] = useState({
    event_title: settings.event_title,
    event_description: settings.event_description ?? '',
    event_date: toLocalInput(settings.event_date),
    event_end_date: toLocalInput(settings.event_end_date),
    venue: settings.venue ?? '',
    address: settings.address ?? '',
    maps_url: settings.maps_url ?? '',
    gallery_url: settings.gallery_url ?? '',
  })
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (isDemo) {
      toast.error('Connect Supabase and create an event_settings row before editing.')
      return
    }
    setSaving(true)
    try {
      await updateEventSettings(settings.id, {
        ...form,
        event_date: new Date(form.event_date).toISOString(),
        event_end_date: new Date(form.event_end_date).toISOString(),
      })
      await refresh()
      toast.success('Event settings saved.')
    } catch {
      toast.error('Could not save settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass space-y-5 rounded-2xl p-5">
      <h3 className="font-display text-lg text-champagne">Event Settings</h3>

      <div>
        <label className="field-label">Birthday Title</label>
        <input
          className="field-input"
          value={form.event_title}
          onChange={(e) => setForm((f) => ({ ...f, event_title: e.target.value }))}
        />
      </div>

      <div>
        <label className="field-label">Event Description</label>
        <textarea
          className="field-input resize-none"
          rows={2}
          value={form.event_description}
          onChange={(e) => setForm((f) => ({ ...f, event_description: e.target.value }))}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Start Date &amp; Time</label>
          <input
            type="datetime-local"
            className="field-input"
            value={form.event_date}
            onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))}
          />
        </div>
        <div>
          <label className="field-label">End Date &amp; Time</label>
          <input
            type="datetime-local"
            className="field-input"
            value={form.event_end_date}
            onChange={(e) => setForm((f) => ({ ...f, event_end_date: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Venue</label>
          <input
            className="field-input"
            value={form.venue}
            onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
          />
        </div>
        <div>
          <label className="field-label">Address</label>
          <input
            className="field-input"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className="field-label">Google Maps URL</label>
        <input
          className="field-input"
          value={form.maps_url}
          onChange={(e) => setForm((f) => ({ ...f, maps_url: e.target.value }))}
        />
      </div>

      <div>
        <label className="field-label">Post-Event Gallery URL</label>
        <input
          className="field-input"
          placeholder="POST_EVENT_GALLERY_URL"
          value={form.gallery_url}
          onChange={(e) => setForm((f) => ({ ...f, gallery_url: e.target.value }))}
        />
      </div>

      <button type="submit" className="btn-gold" disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? 'Saving…' : 'Save Settings'}
      </button>
    </form>
  )
}
