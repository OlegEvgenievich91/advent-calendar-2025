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
      const tg = window.Telegram?.WebApp
      const init = tg?.initData
      if (!init) {
        alert('Ошибка: initData отсутствует. Откройте приложение в Telegram.')
      }
      const sb = await getSupabase()
      if (!sb) {
        alert('Ошибка: Supabase недоступен')
        setLoading(false)
        return
      }
      const { data, error } = await sb.functions.invoke('create-invoice', { body: { telegram_id: userId } })
      if (error) {
        alert('Ошибка создания счета: ' + (error.message || JSON.stringify(error)))
        setLoading(false)
        return
      }
      const link = data?.invoice_link || data?.url || data?.invoice_url
      if (!link) {
        alert('Ошибка: Нет ссылки на оплату')
        setLoading(false)
        return
      }
      if (!tg?.openInvoice) {
        alert('Ошибка: Telegram WebApp недоступен')
        setLoading(false)
        return
      }
      tg.openInvoice(link, async (status) => {
        if (status === 'paid') {
          alert('Успешно!')
          try { await markPaid() } catch (e) { alert('Ошибка обновления статуса оплаты: ' + e.message) }
          onClose?.()
        } else if (status === 'cancelled') {
          alert('Оплата отменена')
        } else if (status === 'failed') {
          alert('Ошибка оплаты')
        }
        setLoading(false)
      })
    } catch (e) {
      alert('Неожиданная ошибка: ' + (e?.message || String(e)))
      setLoading(false)
    }
  }
  return (
    <div className="modal" style={{background:'rgba(0,0,0,0.85)'}}>
      <div className="modal-card" style={{padding:24, background:'#1a2035', boxShadow:'0 20px 40px rgba(0,0,0,0.6)', zIndex:50}}>
        <div className="title" style={{fontSize:26, marginBottom:10}}>Полный доступ</div>
        <div className="subtitle" style={{marginBottom:16}}>Открой дни 2–10 и весь контент</div>
        {error && <div className="info" style={{marginBottom:12, border:'1px solid rgba(239,68,68,.5)', background:'rgba(239,68,68,.15)'}}>{error}</div>}
        <div style={{display:'grid', gap:12}}>
          <button className="btn btn-gold" onClick={buy} disabled={loading}>{loading ? 'Ожидание...' : 'Telegram Stars (250 ⭐️)'}</button>
          <button className="btn btn-secondary" onClick={()=> alert('Оплата картой временно недоступна. Пожалуйста, напишите менеджеру или используйте Telegram Stars.')} style={{background:'#f5f5f7', color:'#111'}}>Карта РФ (500 ₽)</button>
          <button className="btn btn-primary" onClick={()=> { const tg = window.Telegram?.WebApp; if (tg?.openTelegramLink) tg.openTelegramLink('https://t.me/olegevgenievich56'); else window.open('https://t.me/olegevgenievich56','_blank') }}>Через менеджера</button>
        </div>
        <div style={{marginTop:12, textAlign:'center'}}>
          <button onClick={onClose} className="btn btn-secondary">Закрыть</button>
        </div>
      </div>
    </div>
  )
}
