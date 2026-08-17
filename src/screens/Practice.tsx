import { useMemo, useState } from 'react'
import { words } from '../data/words'
import { buildMatchRound, isFrenchMatch, isKazakhMatch, shuffle, uniqueOptions } from '../lib/quiz'
import { speakFrench, speakKazakh } from '../lib/speech'
import { useApp } from '../state'
import { ExtraKeys, Screen } from '../ui'
import { AlphabetQuizPlay } from './AlphabetQuiz'
import type { Word } from '../data/types'

type Mode = 'menu' | 'type' | 'match' | 'listen' | 'alpha'

function poolFor(progressCards: Record<string, unknown>): Word[] {
  const seen = new Set(Object.keys(progressCards))
  const known = words.filter((w) => seen.has(w.id))
  return known.length >= 8 ? known : words.slice(0, 50)
}

export function Practice() {
  const { progress, awardXp, gradeCard, tr, practiceMode } = useApp()
  const [mode, setMode] = useState<Mode>(practiceMode === 'alpha' ? 'alpha' : 'menu')
  const bank = useMemo(() => poolFor(progress.cards), [progress.cards])
  const learnFr = progress.learn === 'fr'

  if (mode === 'type') return <TypeDrill bank={bank} onExit={() => setMode('menu')} awardXp={awardXp} gradeCard={gradeCard} />
  if (mode === 'match') return <MatchDrill bank={bank} onExit={() => setMode('menu')} awardXp={awardXp} />
  if (mode === 'listen') {
    return (
      <ListenDrill
        bank={bank}
        script={progress.script}
        onExit={() => setMode('menu')}
        awardXp={awardXp}
      />
    )
  }
  if (mode === 'alpha') {
    return <AlphabetQuizPlay onExit={() => setMode('menu')} />
  }

  return (
    <Screen>
      <div className="topbar">
        <h2>{tr('practice.title')}</h2>
      </div>
      <p className="muted" style={{ marginTop: 0 }}>
        {tr('practice.intro')}
      </p>
      <div className="stack">
        <button type="button" className="list-row" onClick={() => setMode('type')}>
          <span className="badge">✎</span>
          <span className="grow">
            <b>{tr('practice.type')}</b>
            <span className="muted">{tr(learnFr ? 'practice.type.sub.fr' : 'practice.type.sub.kk')}</span>
          </span>
        </button>
        <button type="button" className="list-row" onClick={() => setMode('match')}>
          <span className="badge">⚭</span>
          <span className="grow">
            <b>{tr('practice.match')}</b>
            <span className="muted">{tr('practice.match.sub')}</span>
          </span>
        </button>
        <button type="button" className="list-row" onClick={() => setMode('listen')}>
          <span className="badge">♪</span>
          <span className="grow">
            <b>{tr('practice.listen')}</b>
            <span className="muted">{tr(learnFr ? 'practice.listen.sub.fr' : 'practice.listen.sub.kk')}</span>
          </span>
        </button>
        <button type="button" className="list-row" onClick={() => setMode('alpha')}>
          <span className="badge">Aa</span>
          <span className="grow">
            <b>{tr('practice.alpha')}</b>
            <span className="muted">{tr(learnFr ? 'practice.alpha.sub.fr' : 'practice.alpha.sub.kk')}</span>
          </span>
        </button>
      </div>
    </Screen>
  )
}

function TypeDrill({
  bank,
  onExit,
  awardXp,
  gradeCard,
}: {
  bank: Word[]
  onExit: () => void
  awardXp: (n: number) => void
  gradeCard: (id: string, ok: boolean) => void
}) {
  const { progress, tr } = useApp()
  const [queue] = useState(() => [...bank].sort(() => Math.random() - 0.5).slice(0, 8))
  const [i, setI] = useState(0)
  const [typed, setTyped] = useState('')
  const [verdict, setVerdict] = useState<'ok' | 'no' | null>(null)
  const [score, setScore] = useState(0)
  const word = queue[i]
  const learnFr = progress.learn === 'fr'

  function check() {
    if (!word || verdict) return
    const ok = learnFr ? isFrenchMatch(typed, word) : isKazakhMatch(typed, word)
    setVerdict(ok ? 'ok' : 'no')
    gradeCard(word.id, ok)
    if (ok) setScore((s) => s + 1)
  }

  if (!word) {
    return (
      <Screen>
        <div className="card center">
          <div className="big-letter">{score >= 6 ? '🌟' : '💪'}</div>
          <h3>
            {score}/{queue.length}
          </h3>
          <p className="muted">{tr('practice.type.done')}</p>
          <div className="row-actions">
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                awardXp(score * 5)
                onExit()
              }}
            >
              {tr('lesson.finish')}
            </button>
          </div>
        </div>
      </Screen>
    )
  }

  const expected = learnFr ? word.fr : progress.script === 'cyr' ? word.cyr : word.lat

  return (
    <Screen>
      <div className="topbar">
        <button type="button" className="back" onClick={onExit} aria-label={tr('back')}>
          ←
        </button>
        <h2>{tr('practice.type')}</h2>
        <span className="muted">
          {i + 1}/{queue.length}
        </span>
      </div>
      <div className="card">
        <p className="prompt">{tr('quiz.say')}</p>
        <p className="hello" style={{ color: 'var(--ink)', margin: '8px 0 14px' }}>
          {learnFr ? (
            <span className="kk">{progress.script === 'cyr' ? word.cyr : word.lat}</span>
          ) : (
            word.fr
          )}
        </p>
        <input
          className={`field ${learnFr ? '' : 'kk'}`}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') check()
          }}
          placeholder={
            learnFr
              ? tr('practice.placeholder.fr')
              : progress.script === 'cyr'
                ? tr('practice.placeholder.kk')
                : tr('practice.placeholder.lat')
          }
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          disabled={Boolean(verdict)}
        />
        <ExtraKeys
          onType={(ch) => setTyped((t) => t + ch)}
          onBackspace={() => setTyped((t) => t.slice(0, -1))}
        />
        {verdict === 'ok' && <p className="note">{tr('practice.ok')}</p>}
        {verdict === 'no' && (
          <p className="note">
            {tr('practice.answer')} : <b className={learnFr ? '' : 'kk'}>{expected}</b>
            {!learnFr && (progress.script === 'cyr' ? ` · ${word.lat}` : ` · ${word.cyr}`)}
          </p>
        )}
        <div className="row-actions">
          {!verdict ? (
            <button type="button" className="btn primary" onClick={check}>
              {tr('check')}
            </button>
          ) : (
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                setTyped('')
                setVerdict(null)
                setI((n) => n + 1)
              }}
            >
              {tr('continue')}
            </button>
          )}
        </div>
      </div>
    </Screen>
  )
}

function MatchDrill({
  bank,
  onExit,
  awardXp,
}: {
  bank: Word[]
  onExit: () => void
  awardXp: (n: number) => void
}) {
  const { progress, tr } = useApp()
  const [round, setRound] = useState(0)
  const [board, setBoard] = useState(() => buildMatchRound(bank, 4))
  const [picked, setPicked] = useState<string | null>(null)
  const [matched, setMatched] = useState<string[]>([])
  const [wrong, setWrong] = useState<string | null>(null)
  const [hits, setHits] = useState(0)

  const doneRound = matched.length === board.left.length
  const finished = round >= 3

  function tapKk(id: string) {
    if (matched.includes(id) || doneRound) return
    setPicked(id)
    setWrong(null)
  }

  function tapFr(id: string) {
    if (!picked || matched.includes(id) || doneRound) return
    if (picked === id) {
      setMatched((m) => [...m, id])
      setHits((n) => n + 1)
      setPicked(null)
    } else {
      setWrong(id)
      setTimeout(() => setWrong(null), 500)
      setPicked(null)
    }
  }

  if (finished) {
    return (
      <Screen>
        <div className="card center">
          <div className="big-letter">🔗</div>
          <h3>{tr('practice.match.pairs', { n: hits })}</h3>
          <p className="muted">{tr('practice.match.done')}</p>
          <div className="row-actions">
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                awardXp(hits * 2)
                onExit()
              }}
            >
              {tr('lesson.finish')}
            </button>
          </div>
        </div>
      </Screen>
    )
  }

  return (
    <Screen>
      <div className="topbar">
        <button type="button" className="back" onClick={onExit} aria-label={tr('back')}>
          ←
        </button>
        <h2>{tr('practice.match')}</h2>
        <span className="muted">{tr('practice.match.round', { n: round + 1 })}</span>
      </div>
      <div className="match">
        <div>
          {board.left.map((w) => (
            <button
              key={`k-${w.id}`}
              type="button"
              className={`choice ${picked === w.id ? 'right' : ''} ${matched.includes(w.id) ? 'right' : ''}`}
              disabled={matched.includes(w.id)}
              onClick={() => tapKk(w.id)}
            >
              {progress.script === 'cyr' ? w.cyr : w.lat}
            </button>
          ))}
        </div>
        <div>
          {board.right.map((w) => (
            <button
              key={`f-${w.id}`}
              type="button"
              className={`choice ${wrong === w.id ? 'wrong' : ''} ${matched.includes(w.id) ? 'right' : ''}`}
              disabled={matched.includes(w.id)}
              onClick={() => tapFr(w.id)}
            >
              {w.fr}
            </button>
          ))}
        </div>
      </div>
      {doneRound && (
        <div className="row-actions">
          <button
            type="button"
            className="btn gold"
            onClick={() => {
              setRound((r) => r + 1)
              setBoard(buildMatchRound(bank, 4))
              setMatched([])
              setPicked(null)
            }}
          >
            {tr('practice.match.next')}
          </button>
        </div>
      )}
    </Screen>
  )
}

function ListenDrill({
  bank,
  script,
  onExit,
  awardXp,
}: {
  bank: Word[]
  script: 'cyr' | 'lat'
  onExit: () => void
  awardXp: (n: number) => void
}) {
  const { progress, tr } = useApp()
  const learnFr = progress.learn === 'fr'
  const [quiz] = useState(() => {
    const pick = shuffle(bank).slice(0, 8)
    const kkPool = words.map((w) => (script === 'cyr' ? w.cyr : w.lat))
    const frPool = words.map((w) => w.fr)
    return pick.map((word) => {
      const answer = learnFr ? (script === 'cyr' ? word.cyr : word.lat) : word.fr
      const pool = learnFr ? kkPool : frPool
      return { word, answer, options: uniqueOptions(answer, pool, 4) }
    })
  })
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const q = quiz[i]

  if (!q) {
    return (
      <Screen>
        <div className="card center">
          <div className="big-letter">🎧</div>
          <h3>
            {score}/{quiz.length}
          </h3>
          <div className="row-actions">
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                awardXp(score * 4)
                onExit()
              }}
            >
              {tr('lesson.finish')}
            </button>
          </div>
        </div>
      </Screen>
    )
  }

  return (
    <Screen>
      <div className="topbar">
        <button type="button" className="back" onClick={onExit} aria-label={tr('back')}>
          ←
        </button>
        <h2>{tr('practice.listen')}</h2>
        <span className="muted">
          {i + 1}/{quiz.length}
        </span>
      </div>
      <div className="card center">
        <p className="prompt">{tr('practice.listen.prompt')}</p>
        <button
          type="button"
          className="speak"
          style={{ width: 72, height: 72, fontSize: 28 }}
          onClick={() => (learnFr ? speakFrench(q.word.fr) : speakKazakh(q.word.cyr))}
        >
          ♪
        </button>
        {picked && (
          <p className="kk" style={{ fontSize: 22, fontWeight: 700 }}>
            {learnFr ? q.word.fr : script === 'cyr' ? q.word.cyr : q.word.lat}
          </p>
        )}
        <p className="tiny" style={{ marginTop: 10 }}>
          {tr('practice.listen.hint')}
        </p>
        <div style={{ textAlign: 'left', marginTop: 16 }}>
          {q.options.map((opt) => {
            let cls = 'choice'
            if (picked) {
              if (opt === q.answer) cls += ' right'
              else if (opt === picked) cls += ' wrong'
            }
            return (
              <button
                key={opt}
                type="button"
                className={cls}
                onClick={() => {
                  if (picked) return
                  setPicked(opt)
                  if (opt === q.answer) setScore((s) => s + 1)
                }}
              >
                {opt}
              </button>
            )
          })}
        </div>
        {picked && (
          <div className="row-actions">
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                setPicked(null)
                setI((n) => n + 1)
              }}
            >
              {tr('continue')}
            </button>
          </div>
        )}
      </div>
    </Screen>
  )
}
