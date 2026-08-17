import { useMemo, useState } from 'react'
import { words } from '../data/words'
import { buildMatchRound, isKazakhMatch, shuffle, uniqueOptions } from '../lib/quiz'
import { speakKazakh } from '../lib/speech'
import { useApp } from '../state'
import { ExtraKeys, Screen } from '../ui'
import type { Word } from '../data/types'

type Mode = 'menu' | 'type' | 'match' | 'listen'

function poolFor(progressCards: Record<string, unknown>): Word[] {
  const seen = new Set(Object.keys(progressCards))
  const known = words.filter((w) => seen.has(w.id))
  return known.length >= 8 ? known : words.slice(0, 50)
}

export function Practice() {
  const { progress, awardXp, gradeCard } = useApp()
  const [mode, setMode] = useState<Mode>('menu')
  const bank = useMemo(() => poolFor(progress.cards), [progress.cards])

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

  return (
    <Screen>
      <div className="topbar">
        <h2>S’entraîner</h2>
      </div>
      <p className="muted" style={{ marginTop: 0 }}>
        Trois ateliers, plus actifs qu’un quiz : écrire, relier, écouter.
      </p>
      <div className="stack">
        <button type="button" className="list-row" onClick={() => setMode('type')}>
          <span className="badge">✎</span>
          <span className="grow">
            <b>Écrire</b>
            <span className="muted">Du français vers le kazakh, avec les lettres spéciales</span>
          </span>
        </button>
        <button type="button" className="list-row" onClick={() => setMode('match')}>
          <span className="badge">⚭</span>
          <span className="grow">
            <b>Associer</b>
            <span className="muted">Reliez quatre paires, trois manches</span>
          </span>
        </button>
        <button type="button" className="list-row" onClick={() => setMode('listen')}>
          <span className="badge">♪</span>
          <span className="grow">
            <b>Écouter</b>
            <span className="muted">Entendez le mot, choisissez le français</span>
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
  const { progress } = useApp()
  const [queue] = useState(() => [...bank].sort(() => Math.random() - 0.5).slice(0, 8))
  const [i, setI] = useState(0)
  const [typed, setTyped] = useState('')
  const [verdict, setVerdict] = useState<'ok' | 'no' | null>(null)
  const [score, setScore] = useState(0)
  const word = queue[i]

  function check() {
    if (!word || verdict) return
    const ok = isKazakhMatch(typed, word)
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
          <p className="muted">Écriture kazakhe — ça vient avec la main.</p>
          <div className="row-actions">
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                awardXp(score * 5)
                onExit()
              }}
            >
              Terminer
            </button>
          </div>
        </div>
      </Screen>
    )
  }

  const expected = progress.script === 'cyr' ? word.cyr : word.lat

  return (
    <Screen>
      <div className="topbar">
        <button type="button" className="back" onClick={onExit} aria-label="Retour">
          ←
        </button>
        <h2>Écrire</h2>
        <span className="muted">
          {i + 1}/{queue.length}
        </span>
      </div>
      <div className="card">
        <p className="prompt">Comment dit-on</p>
        <p className="hello" style={{ color: 'var(--ink)', margin: '8px 0 14px' }}>
          {word.fr}
        </p>
        <input
          className="field kk"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') check()
          }}
          placeholder={progress.script === 'cyr' ? 'en cyrillique…' : 'en latin…'}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          disabled={Boolean(verdict)}
        />
        <ExtraKeys
          onType={(ch) => setTyped((t) => t + ch)}
          onBackspace={() => setTyped((t) => t.slice(0, -1))}
        />
        {verdict === 'ok' && <p className="note">Дұрыс! Exact.</p>}
        {verdict === 'no' && (
          <p className="note">
            Réponse : <b className="kk">{expected}</b>
            {progress.script === 'cyr' ? ` · ${word.lat}` : ` · ${word.cyr}`}
          </p>
        )}
        <div className="row-actions">
          {!verdict ? (
            <button type="button" className="btn primary" onClick={check}>
              Vérifier
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
              Continuer
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
  const { progress } = useApp()
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
          <h3>{hits} paires</h3>
          <p className="muted">Trois manches d’associations.</p>
          <div className="row-actions">
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                awardXp(hits * 2)
                onExit()
              }}
            >
              Terminer
            </button>
          </div>
        </div>
      </Screen>
    )
  }

  return (
    <Screen>
      <div className="topbar">
        <button type="button" className="back" onClick={onExit} aria-label="Retour">
          ←
        </button>
        <h2>Associer</h2>
        <span className="muted">manche {round + 1}/3</span>
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
            Manche suivante
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
  const [quiz] = useState(() => {
    const pick = shuffle(bank).slice(0, 8)
    const frPool = words.map((w) => w.fr)
    return pick.map((word) => ({
      word,
      options: uniqueOptions(word.fr, frPool, 4),
    }))
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
              Terminer
            </button>
          </div>
        </div>
      </Screen>
    )
  }

  return (
    <Screen>
      <div className="topbar">
        <button type="button" className="back" onClick={onExit} aria-label="Retour">
          ←
        </button>
        <h2>Écouter</h2>
        <span className="muted">
          {i + 1}/{quiz.length}
        </span>
      </div>
      <div className="card center">
        <p className="prompt">Touchez, écoutez, choisissez</p>
        <button type="button" className="speak" style={{ width: 72, height: 72, fontSize: 28 }} onClick={() => speakKazakh(q.word.cyr)}>
          ♪
        </button>
        {picked && (
          <p className="kk" style={{ fontSize: 22, fontWeight: 700 }}>
            {script === 'cyr' ? q.word.cyr : q.word.lat}
          </p>
        )}
        <p className="tiny" style={{ marginTop: 10 }}>
          La voix peut être approximative selon le téléphone.
        </p>
        <div style={{ textAlign: 'left', marginTop: 16 }}>
          {q.options.map((opt) => {
            let cls = 'choice'
            if (picked) {
              if (opt === q.word.fr) cls += ' right'
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
                  if (opt === q.word.fr) setScore((s) => s + 1)
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
              Continuer
            </button>
          </div>
        )}
      </div>
    </Screen>
  )
}
