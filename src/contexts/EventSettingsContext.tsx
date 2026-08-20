import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { TABLES } from '@/config/supabaseTables'
import type { EventSettings } from '@/types/database'
import { SITE } from '@/config/site'

// Fallback used only when Supabase isn't connected yet, so the site still
// renders a coherent preview instead of a blank/broken page.
const FALLBACK_SETTINGS: EventSettings = {
  id: 'demo',
  event_title: SITE.defaultTitle,
  event_description:
    'A private celebration for family and close friends marking a beautiful new chapter.',
  event_date: '2026-08-20T18:00:00+05:30',
  event_end_date: '2026-08-20T23:00:00+05:30',
  venue: 'To be announced',
  address: 'To be announced',
  maps_url: null,
  gallery_url: null,
  music_url: null,
  music_volume: 0.5,
  updated_at: new Date().toISOString(),
}

interface EventSettingsContextValue {
  settings: EventSettings
  loading: boolean
  isDemo: boolean
  refresh: () => Promise<void>
}

const EventSettingsContext = createContext<EventSettingsContextValue | undefined>(undefined)

export function EventSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<EventSettings>(FALLBACK_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(true)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setSettings(FALLBACK_SETTINGS)
      setIsDemo(true)
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from(TABLES.eventSettings)
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error || !data) {
      setSettings(FALLBACK_SETTINGS)
      setIsDemo(true)
    } else {
      setSettings(data)
      setIsDemo(false)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <EventSettingsContext.Provider value={{ settings, loading, isDemo, refresh }}>
      {children}
    </EventSettingsContext.Provider>
  )
}

export function useEventSettings() {
  const ctx = useContext(EventSettingsContext)
  if (!ctx) throw new Error('useEventSettings must be used within EventSettingsProvider')
  return ctx
}
