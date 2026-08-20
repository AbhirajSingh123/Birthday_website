export type WishStatus = 'pending' | 'approved' | 'rejected'
export type EventStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED'

export interface Guest {
  id: string
  full_name: string
  email: string
  whatsapp_number: string
  profile_image_url: string | null
  registered_at: string
  created_at: string
  updated_at: string
}

export interface GuestInsert {
  full_name: string
  email: string
  whatsapp_number: string
  profile_image_url?: string | null
}

export interface Wish {
  id: string
  guest_id: string | null
  name: string
  email: string
  message: string
  status: WishStatus
  created_at: string
}

export interface WishInsert {
  guest_id?: string | null
  name: string
  email: string
  message: string
}

export interface EventSettings {
  id: string
  event_title: string
  event_description: string | null
  event_date: string
  event_end_date: string
  venue: string | null
  address: string | null
  maps_url: string | null
  gallery_url: string | null
  music_url: string | null
  music_volume: number
  updated_at: string
}

export interface GalleryPhoto {
  name: string
  url: string
  created_at: string
}

// Row-shape used by the typed Supabase client. Kept hand-written (rather
// than generated) to stay dependency-free; swap for
// `supabase gen types typescript` output once the project is linked.
//
// Views/Functions/Enums/CompositeTypes must be present (even empty) —
// supabase-js's generic constraints require the full shape, otherwise
// every table silently types as `never` instead of erroring loudly.
export interface Database {
  public: {
    Tables: {
      guests: { Row: Guest; Insert: GuestInsert; Update: Partial<GuestInsert> }
      wishes: { Row: Wish; Insert: WishInsert; Update: Partial<Pick<Wish, 'status'>> }
      event_settings: {
        Row: EventSettings
        Insert: Partial<EventSettings>
        Update: Partial<EventSettings>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
