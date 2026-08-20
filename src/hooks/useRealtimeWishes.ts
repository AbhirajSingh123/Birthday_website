import { useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { TABLES } from '@/config/supabaseTables'
import type { Wish } from '@/types/database'

const DEMO_WISHES: Wish[] = [
  {
    id: 'demo-1',
    guest_id: null,
    name: 'Rahul',
    email: '',
    message: 'Happy Birthday Abhiraj! Wishing you success, happiness and an amazing year ahead.',
    status: 'approved',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    guest_id: null,
    name: 'Priya',
    email: '',
    message: 'Cheers to 21! Can’t wait to celebrate with you tonight 🎉',
    status: 'approved',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    guest_id: null,
    name: 'Karan',
    email: '',
    message: 'Here’s to another year of great stories and better memories. Happy birthday!',
    status: 'approved',
    created_at: new Date().toISOString(),
  },
]

/**
 * Live-updating feed of approved wishes. Subscribes to Supabase Realtime
 * for INSERT/UPDATE events on `wishes` and keeps only approved rows, so
 * newly-approved wishes appear without a page refresh. Cleans up the
 * channel subscription on unmount.
 */
export function useRealtimeWishes() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(true)

  const loadInitial = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setWishes(DEMO_WISHES)
      setIsDemo(true)
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from(TABLES.wishes)
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (error) {
      setWishes(DEMO_WISHES)
      setIsDemo(true)
    } else {
      setWishes(data ?? [])
      setIsDemo(false)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadInitial()
    if (!isSupabaseConfigured) return

    const channel = supabase
      .channel('public:wishes:approved')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLES.wishes },
        (payload) => {
          const row = (payload.new ?? payload.old) as Wish | undefined
          if (!row) return

          setWishes((current) => {
            const withoutRow = current.filter((w) => w.id !== row.id)
            const newRow = payload.new as Wish | undefined
            if (payload.eventType === 'DELETE' || !newRow || newRow.status !== 'approved') {
              return withoutRow
            }
            return [newRow, ...withoutRow].sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            )
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadInitial])

  return { wishes, loading, isDemo, refresh: loadInitial }
}
