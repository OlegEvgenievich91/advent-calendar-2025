import { useAuth } from '../context/AuthContext'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PaywallModal from '../components/PaywallModal.jsx'
import AccessModal from '../components/AccessModal.jsx'

const statusForDay = (day, currentDay, isPaid) => {
  if (day < currentDay) return 'done'
  if (day === currentDay) return 'active'
  if (day > 1 && !isPaid) return 'locked_paid'
  return 'locked'
}

const DayCard = ({ day, status, onClick }) => {
  const colors = {
    done: 'day day-done',
    active: 'day day-active',
    locked_paid: 'day day-paid',
    locked: 'day day-locked'
  }
  const label = {
    done: '✅',
    active: '▶️',
    locked_paid: '💎',
    locked: '🔒'
  }[status]
  return (
    <button onClick={onClick} className={colors[status]}>
      <div style={{fontSize:24, fontWeight:800}}>{day}</div>
      <div style={{opacity:.8, fontSize:13, marginTop:4}}>{label}</div>
    </button>
  )
}

const Calendar = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showPaywall, setShowPaywall] = useState(false)
  const [showAccess, setShowAccess] = useState(false)
  const days = useMemo(() => Array.from({ length: 10 }, (_, i) => i + 1), [])
  const currentDay = user?.currentDay || 1
  const isPaid = Boolean(user?.isPaid)
  const { resetProgress } = useAuth()

  const handleClick = (day, status) => {
    if (status === 'active' || status === 'done') {
      navigate(`/day/${day}`)
      return
    }
    if (status === 'locked_paid') {
      setShowPaywall(true)
      return
    }
  }

  return (
    <div className="container-center">
      <div className="card">
        {!isPaid && (
          <div style={{textAlign:'center', marginBottom:12}}>
            <button className="btn btn-gold" style={{padding:'18px 22px', borderRadius:18}} onClick={()=> setShowAccess(true)}>Получить полный доступ</button>
          </div>
        )}
        <div className="heading-row">
          <span style={{fontSize:28}}>⛄</span>
          <div>
            <div className="title">10 дней до Чуда!</div>
            <div className="subtitle">Пройди 10 испытаний и получи диплом волшебника!</div>
          </div>
          <span style={{fontSize:28}}>🎄</span>
        </div>
        <div className="days-list">
          {days.map((day) => {
            const status = statusForDay(day, currentDay, isPaid)
            return (
              <DayCard
                key={day}
                day={day}
                status={status}
                onClick={() => handleClick(day, status)}
              />
            )
          })}
        </div>

        <div className="info" style={{textAlign:'center'}}>
          <div>📅 Текущий день: <b>{currentDay}</b></div>
          <div>💎 Статус оплаты: {isPaid ? '✅ Оплачено' : '⏳ Не оплачено'}</div>
          <div style={{marginTop:10}}>
            <button className="btn btn-secondary" onClick={async()=>{
              if (confirm('Сбросить прогресс и вернуться к регистрации?')) {
                try { await resetProgress() } finally { navigate('/onboarding', { replace:true }) }
              }
            }}>Сбросить прогресс прохождения</button>
          </div>
        </div>

        {showPaywall && (<PaywallModal onClose={() => setShowPaywall(false)} />)}
        {showAccess && (<AccessModal onClose={() => setShowAccess(false)} />)}
      </div>
    </div>
  )
}

export default Calendar
