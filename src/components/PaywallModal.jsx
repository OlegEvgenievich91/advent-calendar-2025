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
    <div className="modal" style={{background:'rgba(0,0,0,0.95)'}}>
      <div className="modal-card" style={{padding:24}}>
        <div className="title" style={{fontSize:26, marginBottom:10}}>Полный доступ</div>
        <div className="subtitle" style={{marginBottom:16}}>Открой дни 2–10 и весь контент</div>
        {error && <div className="info" style={{marginBottom:12, border:'1px solid rgba(239,68,68,.5)', background:'rgba(239,68,68,.15)'}}>{error}</div>}
        <div style={{display:'grid', gap:12}}>
          <button className="btn btn-gold" onClick={buy} disabled={loading}>{loading ? 'Ожидание...' : 'Telegram Stars (250 ⭐️)'}</button>
          <button className="btn btn-secondary" onClick={()=> alert('Для оплаты картой напишите менеджеру')} style={{background:'rgba(255,255,255,0.9)', color:'#111'}}>Карта РФ (500 ₽)</button>
          <button className="btn btn-primary" onClick={()=> window.location.href = 'tg://resolve?domain=olegevgenievich56'}>Через менеджера</button>
        </div>
        <div style={{marginTop:12, textAlign:'center'}}>
          <button onClick={onClose} className="btn btn-secondary">Закрыть</button>
        </div>
      </div>
    </div>
  )
}
