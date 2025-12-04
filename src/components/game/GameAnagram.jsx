import { useMemo, useState } from 'react'

const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

export default function GameAnagram({ question, letters: inputLetters, word, hintEmoji, onWin, onBack }) {
  const letters = useMemo(() => inputLetters?.length ? inputLetters : shuffle(Array.from(String(word))), [inputLetters, word])
  const [picked, setPicked] = useState([])
  const [error, setError] = useState('')
  const pick = (i) => { if (picked.includes(i)) return; setPicked(p => [...p, i]) }
  const unpick = (i) => { setPicked(p => p.filter(idx => idx !== i)) }
  const current = picked.map(i => letters[i]).join('')
  const submit = () => { if (current.toLowerCase() === String(word).toLowerCase()) onWin?.(); else setError('Неверно') }
  return (
    <div style={{textAlign:'center'}}>
      <div className="card" style={{padding:20}}>
        <div className="title" style={{fontSize:28, marginBottom:12}}>🎁 Анаграмма</div>
        <div className="subtitle question-text" style={{marginBottom:16, fontSize: 'clamp(20px, 5vw, 24px)'}}>{question}</div>
        {hintEmoji && <div className="subtitle" style={{marginBottom:12, fontSize:20}}>{hintEmoji}</div>}
        <div className="chips-row" style={{justifyContent:'center'}}>
          {letters.map((ch, i) => (
            <button key={i} onClick={() => pick(i)} className={`chip ${picked.includes(i)?'active':''}`} style={{width:56, height:56, fontSize:'20px'}} disabled={picked.includes(i)}>{ch}</button>
          ))}
        </div>
        <div className="chips-row" style={{marginTop:10, justifyContent:'center'}}>
          {picked.map((i, k) => (
            <button key={`${i}-${k}`} onClick={() => unpick(i)} className="chip active" style={{width:56, height:56, fontSize:'20px'}}>{letters[i]}</button>
          ))}
        </div>
        <div className="subtitle" style={{marginTop:8}}>{current}</div>
        {hintEmoji && <div className="subtitle" style={{marginTop:12, fontSize:48}}>{hintEmoji}</div>}
        <div style={{marginTop:12, display:'flex', gap:10, justifyContent:'center'}}>
          <button onClick={submit} className="btn btn-primary" style={{padding:'16px 20px', fontSize:'20px'}}>Проверить</button>
          {onBack && <button onClick={onBack} className="btn btn-secondary">В меню</button>}
        </div>
        {error && <div className="info" style={{marginTop:10, border:'1px solid rgba(239,68,68,.5)', background:'rgba(239,68,68,.15)'}}>{error}</div>}
      </div>
    </div>
  )
}
