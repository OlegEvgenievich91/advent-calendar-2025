import { useState } from 'react'

export default function GameQuiz({ question, options, onWin, onBack }) {
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  const submit = () => {
    const opt = options?.[selected]
    if (opt?.isCorrect) onWin?.()
    else setError('Неверно')
  }
  return (
    <div style={{textAlign:'center'}}>
      <div className="card" style={{padding:20}}>
        <div className="title" style={{fontSize:20, marginBottom:10}}>🎁 Выбор ответа</div>
        <div className="subtitle question-text" style={{marginBottom:12}}>{question}</div>
        <div className="quiz-grid">
          {options?.map((opt, i) => (
            <button key={opt.id || i} onClick={() => setSelected(i)} className={`quiz-btn ${selected===i?'active':''}`}>{opt.text || String(opt)}</button>
          ))}
        </div>
        <div style={{marginTop:12, display:'flex', gap:10, justifyContent:'center'}}>
          <button onClick={submit} className="btn btn-primary">Выбрать</button>
          {onBack && <button onClick={onBack} className="btn btn-secondary">В меню</button>}
        </div>
        {error && <div className="info" style={{marginTop:10, border:'1px solid rgba(239,68,68,.5)', background:'rgba(239,68,68,.15)'}}>{error}</div>}
      </div>
    </div>
  )
}
