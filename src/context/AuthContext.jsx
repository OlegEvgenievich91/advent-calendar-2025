import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useTelegram } from '../hooks/useTelegram'
import { getSupabase, isSupabaseConfigured } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const { tgUser, isTelegramWebApp, safeUserId } = useTelegram()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    let active = true
    const run = async () => {
      if (!safeUserId) {
        setError('Приложение должно быть открыто в Telegram')
        setLoading(false)
        return
      }
      setError(null)
      if (!isSupabaseConfigured()) {
        setError('Переменные окружения Supabase не настроены')
        setLoading(false)
        return
      }
      const sb = await getSupabase()
      if (!sb) {
        setError('Клиент Supabase недоступен')
        setLoading(false)
        return
      }
      const { data, error: dbError } = await sb
        .from('users')
        .select('telegram_id,name,current_day,is_paid')
        .eq('telegram_id', safeUserId)
        .limit(1)
        .maybeSingle()
      if (!active) return
      if (dbError) {
        setError('Ошибка загрузки профиля')
        setLoading(false)
        return
      }
      setProfile(data || null)
      setLoading(false)
    }
    run()
    return () => { active = false }
  }, [isTelegramWebApp, tgUser, safeUserId])

  const reloadProfile = async () => {
    if (!isTelegramWebApp || !safeUserId) return null
    const sb = await getSupabase()
    if (!sb) return null
    const { data } = await sb
      .from('users')
      .select('telegram_id,name,current_day,is_paid,gender,city,hobby')
      .eq('telegram_id', safeUserId)
      .limit(1)
      .maybeSingle()
    setProfile(data || null)
    return data || null
  }

  const createUser = async ({ name, gender, city, hobby }) => {
    if (!isTelegramWebApp || !safeUserId) throw new Error('not_telegram')
    const sb = await getSupabase()
    if (!sb) throw new Error('supabase_unavailable')
    const insertRow = {
      telegram_id: safeUserId,
      name,
      gender,
      city,
      hobby,
      current_day: 1,
      is_paid: false
    }
    const { error: insertError } = await sb
      .from('users')
      .upsert(insertRow, { onConflict: 'telegram_id' })
    if (insertError) throw insertError
    return await reloadProfile()
  }

  const completeDay = async (dayId, storyPayload) => {
    if (!safeUserId) throw new Error('no_user')
    const sb = await getSupabase()
    if (!sb) throw new Error('supabase_unavailable')
    const { data: row } = await sb
      .from('users')
      .select('generated_stories,current_day')
      .eq('telegram_id', safeUserId)
      .limit(1)
      .maybeSingle()
    const existingStories = row?.generated_stories || {}
    const nextStories = { ...existingStories, [String(dayId)]: storyPayload }
    const nextDay = Math.min(10, (row?.current_day || profile?.current_day || 1) + 1)
    const { error: upErr } = await sb
      .from('users')
      .update({ generated_stories: nextStories, current_day: nextDay })
      .eq('telegram_id', safeUserId)
    if (upErr) throw upErr
    setProfile(p => ({ ...(p || {}), generated_stories: nextStories, current_day: nextDay }))
    return { stories: nextStories, current_day: nextDay }
  }

  const markPaid = async () => {
    if (!safeUserId) throw new Error('no_user')
    const sb = await getSupabase()
    if (!sb) throw new Error('supabase_unavailable')
    const { error: upErr } = await sb
      .from('users')
      .update({ is_paid: true })
      .eq('telegram_id', safeUserId)
    if (upErr) throw upErr
    setProfile(p => ({ ...(p || {}), is_paid: true }))
    return true
  }
  const resetProgress = async () => {
    if (!safeUserId) throw new Error('no_user')
    const sb = await getSupabase()
    if (!sb) throw new Error('supabase_unavailable')
    const { error: delErr } = await sb.from('users').delete().eq('telegram_id', safeUserId)
    if (delErr) throw delErr
    setProfile(null)
    return true
  }

  const userView = profile ? {
    id: safeUserId,
    name: profile.name || '',
    gender: profile.gender || '',
    city: profile.city || '',
    hobby: profile.hobby || '',
    isPaid: Boolean(profile.is_paid),
    currentDay: profile.current_day || 1
  } : null

  const value = useMemo(() => ({
    tgUser,
    userId: safeUserId,
    profile,
    user: userView,
    loading,
    error,
    hasProfile: Boolean(profile),
    isPaid: Boolean(profile?.is_paid),
    currentDay: profile?.current_day || 1,
    name: profile?.name || '',
    reloadProfile,
    createUser,
    completeDay,
    resetProgress,
    markPaid
  }), [tgUser, safeUserId, profile, loading, error])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
