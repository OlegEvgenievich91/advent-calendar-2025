import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getSupabase } from '../lib/supabaseClient'

export default function AccessModal({ onClose }) {
  const { markPaid, userId } = useAuth()
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')

  const buyStars = async () => {
    setError(''); setLoading('stars')
    try {
      const sb = await getSupabase()
      const { data } = await sb.functions.invoke('create-invoice', { body: { telegram_id: userId } })
      const url = data?.url || data?.invoice_url
      const tg = window.Telegram?.WebApp
      if (!tg || !url) throw new Error('invoice_unavailable')
      tg.openInvoice(url, async (status) => {
        if (status === 'paid') { try { await markPaid() } catch {}; onClose?.() }
        else if (status === 'cancelled') setError('Оплата отменена')
        else if (status === 'failed') setError('Ошибка оплаты')
        setLoading('')
      })
    } catch (e) { setError(e?.message || 'Ошибка выставления счёта'); setLoading('') }
  }

  const payCard = () => {
    setError(''); setLoading('card')
    const url = import.meta.env.VITE_CARD_PAYMENT_URL || '/offer'
    try { window.location.href = url } catch { setError('Не удалось открыть оплату картой') } finally { setLoading('') }
  }

  const contactManager = () => {
    setError('')
    const url = import.meta.env.VITE_MANAGER_URL || 'https://t.me/olegevgenievich56'
    try { window.open(url, '_blank') } catch { setError('Не удалось открыть чат') }
  }

  return (
    <div className="modal">
      <div className="modal-card">
        <div className="title" style={{fontSize:24}}>Полный доступ</div>
        <div className="subtitle" style={{marginBottom:16}}>Открой дни 2–10 и весь контент</div>
        {error && <div className="info" style={{marginBottom:12, border:'1px solid rgba(239,68,68,.5)', background:'rgba(239,68,68,.15)'}}>{error}</div>}
        <div style={{display:'grid', gap:10}}>
          <button className="btn btn-primary" onClick={buyStars} disabled={loading==='stars'}>{loading==='stars' ? 'Ожидание...' : 'Купить за Telegram Stars (250)'}</button>
          <button className="btn btn-secondary" onClick={payCard} disabled={loading==='card'}>Оплата картой (500)</button>
          <button className="btn btn-secondary" onClick={contactManager}>Оплатить через менеджера</button>
        </div>
        <div style={{marginTop:12, textAlign:'center'}}>
          <button className="btn btn-secondary" onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  )
}
