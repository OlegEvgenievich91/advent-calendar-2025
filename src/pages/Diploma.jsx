import { useAuth } from '../context/AuthContext'

export default function Diploma() {
  const { user } = useAuth()
  const isGirl = user?.gender === 'girl'
  const verb = isGirl ? 'прошла' : 'прошёл'
  const verb2 = isGirl ? 'проявила' : 'проявил'
  return (
    <div className="container-center">
      <div className="diploma-wrap">
        <div className="diploma">
          <div className="diploma-title">ДИПЛОМ НАСТОЯЩЕГО ВОЛШЕБНИКА</div>
          <div className="diploma-sub">Настоящим подтверждается, что</div>
          <div className="diploma-name">{user?.name || 'Юный Волшебник'}</div>
          <div className="diploma-body diploma-script">успешно {verb} все 10 испытаний, {verb2} смекалку и доброе сердце.</div>
          <div style={{display:'flex', justifyContent:'center', margin:'12px 0'}}>
            <div style={{fontSize:64}}>🎄</div>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:16}}>
            <div style={{marginLeft:16}}>
              <div style={{opacity:.7, fontSize:12}}>Подпись:</div>
              <div className="signature">Дед Мороз</div>
            </div>
            <div className="seal"><div className="seal-text">НОВЫЙ ГОД 2026</div></div>
          </div>
        </div>
        <div style={{textAlign:'center', marginTop:16, display:'flex', gap:12, justifyContent:'center'}}>
          <button className="btn btn-primary">Скачать диплом</button>
          <button className="btn btn-secondary" onClick={()=> window.history.back()}>Вернуться в меню</button>
        </div>
      </div>
    </div>
  )
}
