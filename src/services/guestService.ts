import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { TABLES } from '@/config/supabaseTables'
import type { GuestInsert } from '@/types/database'

export interface RegisterResult {
  success: boolean
  error?: string
  guestId?: string
}

/**
 * Registers a guest. Relies on the `guests_email_key` UNIQUE constraint
 * (see migrations) to prevent duplicate registrations — Postgres error
 * code 23505 is translated into a friendly message here rather than a
 * separate pre-check query (avoids a race between check and insert).
 */
export async function registerGuest(input: GuestInsert): Promise<RegisterResult> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase is not connected yet. Add your project credentials to .env.' }
  }

  const { data, error } = await supabase
    .from(TABLES.guests)
    .insert({
      full_name: input.full_name.trim(),
      email: input.email.trim().toLowerCase(),
      whatsapp_number: input.whatsapp_number.trim(),
      profile_image_url: input.profile_image_url ?? null,
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'This email is already registered for the celebration.' }
    }
    return { success: false, error: error.message }
  }

  return { success: true, guestId: data.id }
}

/** Looks up a guest id by email — used to link a wish to a registration. */
export async function findGuestIdByEmail(email: string): Promise<string | null> {
  if (!isSupabaseConfigured) return null
  const { data } = await supabase
    .from(TABLES.guests)
    .select('id')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle()
  return data?.id ?? null
}
