import { supabase } from '@/lib/supabase'
import { TABLES } from '@/config/supabaseTables'
import type { EventSettings, Guest, Wish, WishStatus } from '@/types/database'

// Every call here runs under the signed-in admin's session, gated by the
// RLS policies in supabase/migrations — there is no service-role key or
// admin secret anywhere in this frontend bundle.

export async function fetchGuests(): Promise<Guest[]> {
  const { data, error } = await supabase
    .from(TABLES.guests)
    .select('*')
    .order('registered_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function deleteGuest(id: string): Promise<void> {
  const { error } = await supabase.from(TABLES.guests).delete().eq('id', id)
  if (error) throw error
}

export function guestsToCsv(guests: Guest[]): string {
  const header = ['Full Name', 'Email', 'WhatsApp', 'Registered At']
  const rows = guests.map((g) => [g.full_name, g.email, g.whatsapp_number, g.registered_at])
  return [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')
}

export async function fetchWishes(): Promise<Wish[]> {
  const { data, error } = await supabase
    .from(TABLES.wishes)
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function setWishStatus(id: string, status: WishStatus): Promise<void> {
  const { error } = await supabase.from(TABLES.wishes).update({ status }).eq('id', id)
  if (error) throw error
}

export async function deleteWish(id: string): Promise<void> {
  const { error } = await supabase.from(TABLES.wishes).delete().eq('id', id)
  if (error) throw error
}

export async function updateEventSettings(
  id: string,
  patch: Partial<EventSettings>,
): Promise<void> {
  const { error } = await supabase
    .from(TABLES.eventSettings)
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
