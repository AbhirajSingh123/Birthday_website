import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { TABLES } from '@/config/supabaseTables'
import type { WishInsert } from '@/types/database'
import { findGuestIdByEmail } from './guestService'

export interface SubmitWishResult {
  success: boolean
  error?: string
}

/**
 * Submits a wish as `pending`. If the submitter's email matches an
 * existing registration, the wish is linked via `guest_id`. Whether an
 * unregistered guest may still submit a wish is controlled by
 * REQUIRE_REGISTRATION_FOR_WISH below — flip it to require registration
 * first, per the "keep this behavior configurable" requirement.
 */
export const REQUIRE_REGISTRATION_FOR_WISH = false

export async function submitWish(input: WishInsert): Promise<SubmitWishResult> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase is not connected yet. Add your project credentials to .env.' }
  }

  const guestId = await findGuestIdByEmail(input.email)

  if (REQUIRE_REGISTRATION_FOR_WISH && !guestId) {
    return { success: false, error: 'Please register for the celebration before sending a wish.' }
  }

  const { error } = await supabase.from(TABLES.wishes).insert({
    guest_id: guestId,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    message: input.message.trim(),
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}
