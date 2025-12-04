import GameInput from './game/GameInput.jsx'
import GameQuiz from './game/GameQuiz.jsx'
import GameClicker from './game/GameClicker.jsx'
import GameSequence from './game/GameSequence.jsx'
import GameAnagram from './game/GameAnagram.jsx'
import GameFinal from './game/GameFinal.jsx'

export default function GameEngine({ quest, onWin, onBack }) {
  if (!quest) return null
  const common = { onWin, onBack }
  switch (quest.type) {
    case 'input':
      return <GameInput question={quest.question} answers={quest.correctAnswer} {...common} />
    case 'quiz':
      return <GameQuiz question={quest.question} options={quest.options} {...common} />
    case 'clicker':
      return <GameClicker target={quest.targetClicks} label={quest.question} emoji={quest.emoji} {...common} />
    case 'sequence':
      return <GameSequence question={quest.question} items={quest.items} {...common} />
    case 'anagram':
      return <GameAnagram question={quest.question} letters={quest.letters} word={quest.targetWord} hintEmoji={quest.hintEmoji} {...common} />
    case 'final':
      return <GameFinal buttonText={quest.buttonText} {...common} />
    default:
      return null
  }
}
