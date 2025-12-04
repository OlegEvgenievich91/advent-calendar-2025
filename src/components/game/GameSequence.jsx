import { useMemo, useState } from 'react'

export default function GameSequence({ question, items, onWin, onBack }) {
  const [picked, setPicked] = useState([])
  const [error, setError] = useState('')
  const correctOrder = useMemo(() => (items || []).slice().sort((a,b)=> (a.order||0) - (b.order||0)).map(i=>i.id), [items])
  const pick = (id) => {
    if (picked.includes(id)) return
    const next = [...picked, id]
    setPicked(next)
    if (next.length === correctOrder.length) {
      const ok = next.every((v, i) => v === correctOrder[i])
      if (ok) onWin?.()
      else setError('Неверно')
    }
  }
  return (
    <div style={{textAlign:'center'}}>
      <div className="card" style={{padding:20}}>
        <div className="title" style={{fontSize:20, marginBottom:10}}>🎁 Последовательность</div>
        <div className="subtitle" style={{marginBottom:12}}>{question}</div>
        <div className="chips" style={{flexWrap:'wrap', justifyContent:'center'}}>
          {items?.map(it => (
            <button key={it.id} onClick={() => pick(it.id)} className={`chip ${picked.includes(it.id)?'active':''}`}>{it.text || it.label}</button>
          ))}
        </div>
        <div className="subtitle" style={{marginTop:12}}>Выбрано: {picked.join(' → ')}</div>
        <div style={{marginTop:12, display:'flex', gap:10, justifyContent:'center'}}>
          {onBack && <button onClick={onBack} className="btn btn-secondary">В меню</button>}
        </div>
        {error && <div className="info" style={{marginTop:10, border:'1px solid rgba(239,68,68,.5)', background:'rgba(239,68,68,.15)'}}>{error}</div>}
      </div>
    </div>
  )
}
