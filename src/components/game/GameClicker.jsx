import { useEffect, useState } from 'react'

const vibrate = () => {
  try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light') } catch {}
}

export default function GameClicker({ target = 10, label = 'Согрей елочку', emoji = '🎄', onWin }) {
  const [count, setCount] = useState(0)
  useEffect(() => { if (count >= target) onWin?.() }, [count, target, onWin])
  const click = () => { vibrate(); setCount(c => Math.min(target, c + 1)) }
  const pct = Math.round((count / target) * 100)
  const lit = pct >= 100
  const base = 140
  const grow = Math.round((count / target) * 60)
  const size = base + grow
  const glow = 6 + Math.round((count / target) * 18)
  return (
    <div style={{textAlign:'center'}}>
      <div className="subtitle" style={{marginBottom:12}}>{label}</div>
      <button onClick={click} className="btn btn-primary" style={{width:size, height:size, borderRadius:28, fontSize:64, lineHeight:'64px'}}>
        <span style={{filter: `drop-shadow(0 0 ${glow}px #22d3ee) drop-shadow(0 0 ${Math.round(glow/2)}px #34d399)`, transform: `scale(${1 + (count/target)*0.2})`}}>{emoji}</span>
      </button>
      <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden" style={{marginTop:12}}>
        <div style={{ width: `${pct}%` }} className="h-4 bg-green-500 rounded-full" />
      </div>
      <div className="text-white/80 text-sm" style={{marginTop:8}}>{count} / {target}</div>
    </div>
  )
}
