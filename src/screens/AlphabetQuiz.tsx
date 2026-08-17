import { useState } from 'react'
import { alphabet } from '../data/alphabet'
import { frenchAlphabet } from '../data/frenchAlphabet'
import { buildAlphabetQuiz, type AlphaQuestion } from '../lib/quiz'
import { speakFrench, speakKazakh } from '../lib/speech'
import { useApp } from '../state'
import { Back, Screen } from '../ui'
import type { I18nKey } from '../lib/i18n'

const LABEL: Record<Exclude<AlphaQuestion['kind'], 'script'>, I18nKey> = {
  word: 'alpha.quiz.word',
  letter: 'alpha.quiz.letter',
  sound: 'alpha.quiz.sound',
  listen: 'alpha.quiz.listen',
}

function Choices({
  question,
  picked,
  onPick,
}: {
  question: AlphaQuestion
  picked: string | null
  onPick: (opt: string) => void
}) {
  return (
    <div className={question.layout === 'grid' ? 'choice-grid' : ''} style={{ marginTop: 12 }}>
      {question.options.map((opt) => {
        let cls = 'choice'
        if (picked) {
          if (opt === question.answer) cls += ' right'
          else if (opt === picked) cls += ' wrong'
        }
        return (
          <button key={opt} type="button" className={cls} onClick={() => onPick(opt)}>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

export function AlphabetQuizPlay({
  onExit,
  onFinished,
  embed,
}: {
  onExit: () => void
  onFinished?: (score: number, total: number) => void
  embed?: boolean
}) {
  const { progress, awardXp, tr } = useApp()
  const learnFr = progress.learn === 'fr'
  const letters = learnFr ? frenchAlphabet : alphabet
  const [quiz] = useState(() => buildAlphabetQuiz(letters, progress.learn, progress.script, 10))
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const q = quiz[i]

  function speak(text: string) {
    if (learnFr) speakFrench(text)
    else speakKazakh(text)
  }

  function pick(opt: string) {
    if (picked || !q) return
    setPicked(opt)
    if (opt === q.answer) setScore((s) => s + 1)
  }

  function next() {
    if (!q) return
    if (i + 1 >= quiz.length) {
      if (onFinished) {
        onFinished(score, quiz.length)
        return
      }
      awardXp(score * 4)
      setI((n) => n + 1)
      return
    }
    setPicked(null)
    setI((n) => n + 1)
  }

  if (!q) {
    const body = (
      <div className="card center">
        <div className="big-letter">{score >= 8 ? '🌟' : '💪'}</div>
        <h3>
          {score}/{quiz.length}
        </h3>
        <p className="muted">{tr('alpha.quiz.done')}</p>
        <div className="row-actions">
          <button type="button" className="btn primary" onClick={onExit}>
            {tr('lesson.finish')}
          </button>
        </div>
      </div>
    )
    if (embed) return body
    return (
      <Screen>
        {body}
      </Screen>
    )
  }

  const card = (
    <div className={`card ${q.kind === 'listen' ? 'center' : ''}`}>
      <span className="pill">
        {i + 1}/{quiz.length}
      </span>
      <p className="prompt">
        {q.kind === 'script'
          ? tr(progress.script === 'cyr' ? 'alpha.quiz.latin' : 'alpha.quiz.cyril')
          : tr(LABEL[q.kind])}
      </p>
      {q.kind === 'listen' ? (
        <button
          type="button"
          className="speak"
          style={{ width: 72, height: 72, fontSize: 28, margin: '8px auto' }}
          onClick={() => speak(q.speak)}
          aria-label={tr('listen')}
        >
          ♪
        </button>
      ) : q.kind === 'word' || q.kind === 'sound' || q.kind === 'script' ? (
        <div className="big-letter">{q.prompt}</div>
      ) : (
        <p className="target" style={{ fontSize: 32, fontWeight: 700, margin: '8px 0 4px' }}>
          {q.prompt}
        </p>
      )}
      {q.kind !== 'listen' && (
        <button
          type="button"
          className="speak ghost"
          onClick={() => speak(q.speak)}
          aria-label={tr('listen')}
        >
          ♪
        </button>
      )}
      {picked && q.kind === 'listen' && (
        <p className="muted" style={{ marginTop: 8 }}>
          {q.speak}
        </p>
      )}
      <Choices question={q} picked={picked} onPick={pick} />
      {picked && (
        <div className="row-actions">
          <button type="button" className="btn primary" onClick={next}>
            {i + 1 >= quiz.length ? tr('quiz.seeScore') : tr('continue')}
          </button>
        </div>
      )}
    </div>
  )

  if (embed) return card

  return (
    <Screen>
      <div className="topbar">
        <Back onClick={onExit} />
        <h2>{tr('practice.alpha')}</h2>
        <span className="muted">
          {i + 1}/{quiz.length} · {score} pts
        </span>
      </div>
      {card}
    </Screen>
  )
}
