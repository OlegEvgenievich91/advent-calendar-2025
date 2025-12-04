import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
export const isSupabaseConfigured = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

let client = null

export const getSupabase = async () => {
  if (client) return client
  if (!isSupabaseConfigured()) return null
  try {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    return client
  } catch {
    return null
  }
}
