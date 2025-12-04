import { useEffect, useState } from 'react'

export default function GameFinal({ buttonText = 'Зажечь елку', onWin }) {
  const [lit, setLit] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  useEffect(() => {
    if (lit) {
      setShowConfetti(true)
      const t = setTimeout(() => setShowConfetti(false), 2500)
      return () => clearTimeout(t)
    }
  }, [lit])
  const ignite = () => { setLit(true); onWin?.() }
  return (
    <div style={{textAlign:'center'}}>
      <div className="title" style={{fontSize:24, marginBottom:8}}>Главная Елка</div>
      <div style={{position:'relative', display:'flex', justifyContent:'center', marginBottom:12}}>
          <div style={{width:200, height:200, borderRadius:36, display:'flex', alignItems:'center', justifyContent:'center', fontSize:80, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.18)'}}>
          <span style={{filter: lit? 'drop-shadow(0 0 26px #22d3ee) drop-shadow(0 0 16px #34d399)' : 'none', transform: lit? 'scale(1.22)' : 'none'}}>🎄</span>
          </div>
          {showConfetti && (
            <div style={{position:'absolute', inset:0, pointerEvents:'none'}}>
              {[...Array(40)].map((_, i) => (
                <span key={i} style={{
                  position:'absolute',
                  left: `${Math.random()*100}%`,
                  top: '-10%',
                  fontSize: Math.random()*16 + 12,
                  animation: 'fall 2.4s linear forwards',
                }}>
                  {['🎉','✨','🎊','💥'][i%4]}
                </span>
              ))}
              <style>{`@keyframes fall { to { transform: translateY(130%); opacity: .8 } }`}</style>
            </div>
          )}
        </div>
      <div style={{display:'flex', gap:12, justifyContent:'center'}}>
        <button onClick={ignite} className="btn btn-primary">{buttonText}</button>
      </div>
    </div>
  )
}
