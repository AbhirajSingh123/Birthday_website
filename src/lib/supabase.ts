import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

if (!isSupabaseConfigured) {
  // Loud in dev, harmless in prod builds — the app still renders with
  // clear "not connected" states instead of crashing.
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. ' +
      'Copy .env.example to .env and fill in your project credentials.',
  )
}

// Intentionally NOT parametrized with the Database generic. supabase-js's
// generic table-lookup typing is strict about the exact shape it expects
// (Views/Functions/Enums/CompositeTypes/Relationships all required) and a
// hand-written type that misses any of it silently collapses every query
// to `never`, breaking the build. Our own Guest/Wish/EventSettings types
// (src/types/database.ts) are used directly in every service function's
// signature instead, so callers still get full autocomplete/type-checking
// on the data they actually work with — just not on the raw query builder.
//
// Fallback values let createClient construct without throwing when env
// vars are missing during local scaffolding; isSupabaseConfigured is what
// the rest of the app checks before actually calling anything.
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
)
