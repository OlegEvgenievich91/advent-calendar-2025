import { useMemo, useState } from 'react'

export default function GameSequence({ question, items, onWin, onBack }) {
  const [picked, setPicked] = useState([])
  const [error, setError] = useState('')
  const correctOrder = useMemo(() => (items || []).slice().sort((a,b)=> (a.order||0) - (b.order||0)).map(i=>i.id), [items])
  const labelById = useMemo(() => Object.fromEntries((items||[]).map(it=>[it.id, it.text || it.label])), [items])
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
  const unpick = (id) => setPicked(p => p.filter(x => x !== id))
  return (
    <div style={{textAlign:'center'}}>
      <div className="card" style={{padding:20}}>
        <div className="title" style={{fontSize:28, marginBottom:12}}>🎁 Последовательность</div>
        <div className="subtitle question-text" style={{marginBottom:16, fontSize: 'clamp(20px, 5vw, 24px)'}}>{question}</div>
        <div className="chips-row">
          {items?.map(it => (
            <button key={it.id} onClick={() => pick(it.id)} className={`chip ${picked.includes(it.id)?'active':''}`} style={{padding:'16px', fontSize:'20px'}}>{it.text || it.label}</button>
          ))}
        </div>
        <div className="chips-row" style={{marginTop:12}}>
          {picked.map(id => (
            <button key={`p-${id}`} onClick={() => unpick(id)} className="chip active" style={{padding:'16px', fontSize:'20px'}}>{labelById[id]}</button>
          ))}
        </div>
        <div style={{marginTop:12, display:'flex', gap:10, justifyContent:'center'}}>
          {onBack && <button onClick={onBack} className="btn btn-secondary">В меню</button>}
        </div>
        {error && <div className="info" style={{marginTop:10, border:'1px solid rgba(239,68,68,.5)', background:'rgba(239,68,68,.15)'}}>{error}</div>}
      </div>
    </div>
  )
}
