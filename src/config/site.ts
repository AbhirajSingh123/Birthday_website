// Static identity/branding constants that never change per-event.
// Everything an admin can configure lives in Supabase `event_settings`
// instead (see src/hooks/useEventSettings and contexts/EventSettingsContext).
export const SITE = {
  guestOfHonor: 'Abhiraj Singh',
  defaultTitle: "Abhiraj's 21st Birthday",
  tagline: "Let's celebrate another beautiful chapter together.",
  age: 21,
  dob: '2005-08-20',
} as const

export const DEMO_MODE_BANNER =
  'Demo data — connect Supabase and clear the seed data before going live.'
