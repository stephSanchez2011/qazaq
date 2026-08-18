import { useMemo, useState } from 'react'
import { words } from '../data/words'
import { buildQuiz, type ChoiceQuestion } from '../lib/quiz'
import { speakFrench, speakKazakh } from '../lib/speech'
import { useApp } from '../state'
import { Screen } from '../ui'
import { AlphabetQuizPlay } from './AlphabetQuiz'

export function Quiz() {
  const { progress, setQuizBest, awardXp, tr } = useApp()
  const [kind, setKind] = useState<'vocab' | 'alpha' | null>(null)
  const [quiz, setQuiz] = useState<ChoiceQuestion[] | null>(null)
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)

  const pool = useMemo(() => {
    const seen = new Set(Object.keys(progress.cards))
    const known = words.filter((w) => seen.has(w.id))
    return known.length >= 8 ? known : words.slice(0, 40)
  }, [progress.cards])

  function start() {
    setQuiz(buildQuiz(pool, words, progress.script, 10))
    setI(0)
    setPicked(null)
    setScore(0)
  }

  if (kind === 'alpha') {
    return <AlphabetQuizPlay onExit={() => setKind(null)} />
  }

  if (!quiz) {
    return (
      <Screen>
        <div className="topbar">
          <h2>{tr('quiz.title')}</h2>
        </div>
        <div className="card">
          <p>{tr('quiz.intro')}</p>
          <p className="muted">{tr('quiz.best', { n: progress.quizBest })}</p>
          <p className="muted">{tr('quiz.alpha.best', { n: progress.alphaQuizBest })}</p>
          <div className="row-actions">
            <button type="button" className="btn gold" onClick={start}>
              {tr('quiz.start')}
            </button>
          </div>
        </div>
        <button type="button" className="list-row" style={{ marginTop: 12 }} onClick={() => setKind('alpha')}>
          <span className="badge">Aa</span>
          <span className="grow">
            <b>{tr('quiz.alpha')}</b>
            <span className="muted">{tr('quiz.alpha.intro')}</span>
          </span>
        </button>
      </Screen>
    )
  }

  const q = quiz[i]
  if (!q) {
    const pct = score
    return (
      <Screen>
        <div className="card center">
          <div className="big-letter">{pct >= 8 ? '🌟' : '💪'}</div>
          <h3>{score}/10</h3>
          <p className="muted">{score >= 8 ? tr('quiz.ok') : tr('quiz.again')}</p>
          <div className="row-actions">
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                setQuizBest(score)
                awardXp(score * 4)
                setQuiz(null)
              }}
            >
              {tr('lesson.finish')}
            </button>
          </div>
        </div>
      </Screen>
    )
  }

  function choose(opt: string) {
    if (picked) return
    setPicked(opt)
    if (opt === q.answer) setScore((s) => s + 1)
  }

  return (
    <Screen>
      <div className="topbar">
        <h2>{tr('quiz.title')}</h2>
        <span className="muted">
          {i + 1}/10 · {score} pts
        </span>
      </div>
      <div className="card">
        <p className="prompt">{q.promptLang === 'kk' ? tr('quiz.mean') : tr('quiz.say')}</p>
        <p className="hello kk" style={{ color: 'var(--ink)', fontSize: 28, margin: '8px 0 16px' }}>
          {q.prompt}
        </p>
        {q.promptLang === 'kk' && (
          <button type="button" className="speak ghost" onClick={() => speakKazakh(q.word.cyr)}>
            ♪
          </button>
        )}
        {q.promptLang === 'fr' && (
          <button type="button" className="speak ghost" onClick={() => speakFrench(q.word.fr)}>
            ♪
          </button>
        )}
        <div style={{ marginTop: 12 }}>
          {q.options.map((opt) => {
            let cls = 'choice'
            if (picked) {
              if (opt === q.answer) cls += ' right'
              else if (opt === picked) cls += ' wrong'
            }
            return (
              <button key={opt} type="button" className={cls} onClick={() => choose(opt)}>
                {opt}
              </button>
            )
          })}
        </div>
        {picked && (
          <div className="row-actions">
            <button type="button" className="btn primary" onClick={() => { setPicked(null); setI((n) => n + 1) }}>
              {tr('continue')}
            </button>
          </div>
        )}
      </div>
    </Screen>
  )
}
