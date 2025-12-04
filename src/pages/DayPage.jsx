import { useParams, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import GameEngine from '../components/GameEngine.jsx'
import { QUEST_DATA } from '../data/quests.js'
import { useAuth } from '../context/AuthContext'
import { generateStory } from '../lib/openai.js'

const DayPage = () => {
  const { day } = useParams()
  const navigate = useNavigate()
  const { user, completeDay } = useAuth()
  const quest = useMemo(() => QUEST_DATA?.[Number(day)], [day])
  const [won, setWon] = useState(false)
  const [story, setStory] = useState('')
  const [saving, setSaving] = useState(false)
  const isReplay = Number(day) < (user?.currentDay || 1)
  return (
    <div className="container-center">
      <div className="card" style={{maxWidth: 560, textAlign:'center'}}>
        <h1 className="text-3xl font-bold text-white mb-4">🎮 День {day}</h1>
        {!won ? (
          <div>
            <div style={{textAlign:'left', marginBottom:8}}>
              <button className="btn btn-secondary" onClick={()=> navigate('/calendar', { replace:true })}>В меню</button>
            </div>
            <GameEngine
              quest={quest}
              onBack={()=> navigate('/calendar', { replace:true })}
              onWin={async () => {
                const text = await generateStory({ name: user?.name, hobby: user?.hobby, gender: user?.gender }, Number(day), quest?.task)
                setStory(text)
                if (quest?.type === 'final') {
                  setTimeout(() => setWon(true), 1800)
                } else {
                  setWon(true)
                }
              }}
            />
          </div>
        ) : (
          <div style={{textAlign:'left'}}>
            <div className="title" style={{fontSize:24}}>✨ Победа!</div>
            <div className="subtitle" style={{marginBottom:16}}>История:</div>
            <div className="card" style={{padding:20}}>
              <div className="story-text" style={{whiteSpace:'pre-wrap'}}>{story}</div>
            </div>
            <div style={{marginTop:16, display:'flex', gap:12, flexWrap:'wrap'}}>
              {!isReplay && (
                <button className="btn btn-primary" disabled={saving} onClick={async ()=>{
                  setSaving(true)
                  try {
                    await completeDay(Number(day), { task: quest?.task, text: story, created_at: new Date().toISOString() })
                    navigate('/calendar', { replace: true })
                  } finally { setSaving(false) }
                }}>{saving? 'Сохраняем...' : 'Продолжить'}</button>
              )}
              <button className="btn btn-secondary" onClick={()=> navigate('/calendar', { replace:true })}>{isReplay ? 'Вернуться' : 'Вернуться к календарю'}</button>
              {Number(day) === 10 && (
                <button className="btn btn-primary" onClick={()=> navigate('/diploma')}>Получить диплом</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DayPage
