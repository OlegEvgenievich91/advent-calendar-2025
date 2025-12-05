import { useAuth } from '../context/AuthContext'

export default function Diploma() {
  const { user } = useAuth()
  const isGirl = user?.gender === 'girl'
  const verb = isGirl ? 'прошла' : 'прошёл'
  const verb2 = isGirl ? 'проявила' : 'проявил'
  return (
    <div className="container-center">
      <div className="diploma-wrap">
        <div className="diploma" style={{ fontFamily: 'Playfair Display, serif' }}>
          <div style={{ fontSize: '42px', fontWeight: 800, textAlign: 'center', color: '#111827', marginBottom: 8 }}>ДИПЛОМ НАСТОЯЩЕГО ВОЛШЕБНИКА</div>
          <div style={{ fontSize: '18px', textAlign: 'center', color: '#374151', marginBottom: 16 }}>Настоящим подтверждается, что</div>
          <div style={{ fontSize: '48px', fontWeight: 800, textAlign: 'center', color: '#1e3a8a', marginBottom: 16 }}>{user?.name || 'Юный Волшебник'}</div>
          <div style={{ fontSize: '20px', fontStyle: 'italic', textAlign: 'center', color: '#374151', marginBottom: 16 }}>успешно {verb} все 10 испытаний, {verb2} смекалку и доброе сердце.</div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
            <div style={{ fontSize: 64 }}>🎄</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <div style={{ marginLeft: 16 }}>
              <div style={{ opacity: .7, fontSize: 12 }}>Подпись:</div>
              <div style={{ fontSize: '24px', color: '#1e40af' }}>Дед Мороз</div>
            </div>
            <div className="seal"><div className="seal-text">НОВЫЙ ГОД 2026</div></div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-primary">Скачать диплом</button>
          <button className="btn btn-secondary" onClick={() => window.history.back()}>Вернуться в меню</button>
        </div>
      </div>
    </div>
  )
}
