import { useEffect, useState } from 'react'

const getTelegram = () => {
  try {
    return window.Telegram?.WebApp || null
  } catch {
    return null
  }
}

const readSafeUser = () => {
  const tg = getTelegram()
  if (!tg) return null
  const initData = tg.initData
  const unsafe = tg.initDataUnsafe
  if (!initData || typeof initData !== 'string' || initData.length === 0) return null
  const user = unsafe?.user || null
  if (!user) return null
  if (typeof user.id !== 'number' || !Number.isFinite(user.id)) return null
  return user
}

export const useTelegram = () => {
  const [tg, setTg] = useState(null)
  const [tgUser, setTgUser] = useState(null)
  const [colorScheme, setColorScheme] = useState('light')
  const isLocal = typeof window !== 'undefined' && ['localhost','127.0.0.1'].includes(window.location.hostname)

  useEffect(() => {
    const webApp = getTelegram()
    setTg(webApp)
    if (webApp) {
      try { webApp.ready() } catch {}
      try { webApp.expand() } catch {}
      setColorScheme(webApp.colorScheme || 'light')
      const realUser = readSafeUser()
      if (realUser) {
        setTgUser(realUser)
      } else if ((import.meta.env.DEV || isLocal) && import.meta.env.VITE_TG_MOCK_ID) {
        const idNum = Number(import.meta.env.VITE_TG_MOCK_ID)
        if (Number.isFinite(idNum)) setTgUser({ id: idNum, first_name: import.meta.env.VITE_TG_MOCK_NAME || 'DevUser' })
        else setTgUser(null)
      } else {
        setTgUser(null)
      }
    } else {
      if ((import.meta.env.DEV || isLocal) && import.meta.env.VITE_TG_MOCK_ID) {
        const idNum = Number(import.meta.env.VITE_TG_MOCK_ID)
        if (Number.isFinite(idNum)) {
          setTgUser({ id: idNum, first_name: import.meta.env.VITE_TG_MOCK_NAME || 'DevUser' })
        } else {
          setTgUser(null)
        }
      } else {
        setTgUser(null)
      }
    }
  }, [])

  const isTelegramWebApp = Boolean(tg) || ((import.meta.env.DEV || isLocal) && Boolean(import.meta.env.VITE_TG_MOCK_ID))
  const safeUserId = tgUser ? String(tgUser.id) : null

  return {
    tg,
    tgUser,
    isTelegramWebApp,
    colorScheme,
    safeUserId,
    ready: () => { const t = getTelegram(); if (t) t.ready() },
    expand: () => { const t = getTelegram(); if (t) t.expand() }
  }
}
