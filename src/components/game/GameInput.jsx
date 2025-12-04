import { useState } from 'react'

export default function GameInput({ question, answers, onWin, onBack }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const check = () => {
    const v = value.trim().toLowerCase()
    const ok = Array.isArray(answers) && answers.some(a => String(a).trim().toLowerCase() === v)
    if (ok) onWin?.()
    else setError('Неверно')
  }
  return (
    <div style={{textAlign:'center'}}>
      <div className="card" style={{padding:20}}>
        <div className="title" style={{fontSize:28, marginBottom:12}}>🎁 Вопрос</div>
        <div className="subtitle question-text" style={{marginBottom:16, fontSize: 'clamp(20px, 5vw, 24px)'}}>{question}</div>
        <div className="input-wrap">
          <input value={value} onChange={e => setValue(e.target.value)} className="input" placeholder="Ответ" />
        </div>
        <div style={{marginTop:12, display:'flex', gap:10, justifyContent:'center'}}>
          <button onClick={check} className="btn btn-primary" style={{padding:'16px 20px', fontSize:'20px'}}>Ответить</button>
          {onBack && <button onClick={onBack} className="btn btn-secondary">В меню</button>}
        </div>
        {error && <div className="info" style={{marginTop:10, border:'1px solid rgba(239,68,68,.5)', background:'rgba(239,68,68,.15)'}}>{error}</div>}
      </div>
    </div>
  )
}
