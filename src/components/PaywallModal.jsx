import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getSupabase } from '../lib/supabaseClient'

export default function PaywallModal({ onClose }) {
  const { markPaid, userId } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const buy = async () => {
    setError('')
    setLoading(true)
    try {
      const sb = await getSupabase()
      const { data } = await sb.functions.invoke('create-invoice', { body: { telegram_id: userId } })
      const url = data?.url || data?.invoice_url
      const tg = window.Telegram?.WebApp
      if (!tg || !url) throw new Error('invoice_unavailable')
      tg.openInvoice(url, async (status) => {
        if (status === 'paid') {
          try { await markPaid() } catch {}
          onClose?.()
        } else if (status === 'cancelled') {
          setError('Оплата отменена')
        } else if (status === 'failed') {
          setError('Ошибка оплаты')
        }
        setLoading(false)
      })
    } catch (e) {
      setError(e?.message || 'Ошибка выставления счёта')
      setLoading(false)
    }
  }
  return (
    <div className="modal">
      <div className="modal-card">
        <div className="title" style={{fontSize:22}}>Доступ к платным дням</div>
        <div className="subtitle" style={{marginBottom:16}}>Чтобы открыть дни 2–10, оплати доступ в Telegram Stars.</div>
        {error && <div className="info" style={{marginBottom:12, border:'1px solid rgba(239,68,68,.5)', background:'rgba(239,68,68,.15)'}}>{error}</div>}
        <div style={{display:'flex', gap:12, justifyContent:'center'}}>
          <button onClick={onClose} className="btn btn-secondary">Закрыть</button>
          <button onClick={buy} className="btn btn-primary" disabled={loading}>{loading ? 'Ожидание...' : 'Купить за Stars'}</button>
        </div>
      </div>
    </div>
  )
}
