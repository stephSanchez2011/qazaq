import { useMemo, useState } from 'react'
import { dialogues } from '../data/dialogues'
import { buildDialogueQuiz } from '../lib/quiz'
import { speakFrench, speakKazakh } from '../lib/speech'
import { useApp } from '../state'
import { Back, Kk, Screen, Speak } from '../ui'

type Phase = 'lines' | 'quiz' | 'done'

export function Dialogues() {
  const { go, finishDialogue, progress, tr } = useApp()
  const [id, setId] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('lines')
  const [line, setLine] = useState(0)
  const [showTr, setShowTr] = useState(false)
  const [qIndex, setQIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const d = dialogues.find((x) => x.id === id)
  const learnFr = progress.learn === 'fr'
  const allLines = useMemo(() => dialogues.flatMap((x) => x.lines), [])
  const quiz = useMemo(
    () => (d ? buildDialogueQuiz(d.lines, allLines, progress.script, progress.learn, 3) : []),
    [d, allLines, progress.script, progress.learn],
  )
  const question = quiz[qIndex]

  function openDialogue(dialogueId: string) {
    setId(dialogueId)
    setPhase('lines')
    setLine(0)
    setShowTr(false)
    setQIndex(0)
    setPicked(null)
    setScore(0)
  }

  if (!d) {
    return (
      <Screen>
        <div className="topbar">
          <Back onClick={() => go('more')} />
          <h2>{tr('dlg.title')}</h2>
        </div>
        <p className="muted" style={{ marginTop: 0 }}>
          {tr('dlg.intro')}
        </p>
        <div className="stack">
          {dialogues.map((item) => {
            const done = progress.completedDialogues.includes(item.id)
            return (
              <button key={item.id} type="button" className="list-row" onClick={() => openDialogue(item.id)}>
                <span className={`badge ${done ? 'done' : ''}`}>{done ? '✓' : '🎙'}</span>
                <span className="grow">
                  <b>{item.title}</b>
                  <span className="muted">{item.place}</span>
                </span>
              </button>
            )
          })}
        </div>
      </Screen>
    )
  }

  if (phase === 'done') {
    return (
      <Screen>
        <div className="card center">
          <div className="big-letter">🎉</div>
          <h3>{tr('dlg.done')}</h3>
          <p className="muted">{tr('dlg.quiz.done', { score, total: quiz.length })}</p>
          <div className="row-actions">
            <button type="button" className="btn primary" onClick={() => setId(null)}>
              {tr('back')}
            </button>
          </div>
        </div>
      </Screen>
    )
  }

  if (phase === 'quiz' && question) {
    return (
      <Screen>
        <div className="topbar">
          <Back onClick={() => setPhase('lines')} />
          <h2>{tr('dlg.quiz')}</h2>
          <span className="muted">
            {qIndex + 1}/{quiz.length}
          </span>
        </div>
        <div className="card">
          <p className="prompt">{question.promptLang === 'kk' ? tr('quiz.mean') : tr('quiz.say')}</p>
          <p className="hello kk" style={{ color: 'var(--ink)', fontSize: 22, margin: '8px 0 16px' }}>
            {question.prompt}
          </p>
          <button
            type="button"
            className="speak ghost"
            onClick={() =>
              question.speakLang === 'fr' ? speakFrench(question.speak) : speakKazakh(question.speak)
            }
            aria-label={tr('listen')}
          >
            ♪
          </button>
          <div style={{ marginTop: 12 }}>
            {question.options.map((opt) => {
              let cls = 'choice'
              if (picked) {
                if (opt === question.answer) cls += ' right'
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
                    if (opt === question.answer) setScore((s) => s + 1)
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
                  if (qIndex + 1 >= quiz.length) {
                    finishDialogue(d.id)
                    setPhase('done')
                    return
                  }
                  setPicked(null)
                  setQIndex((n) => n + 1)
                }}
              >
                {qIndex + 1 >= quiz.length ? tr('quiz.seeScore') : tr('continue')}
              </button>
            </div>
          )}
        </div>
      </Screen>
    )
  }

  const current = d.lines[line]
  const last = line >= d.lines.length - 1

  if (!current) {
    return (
      <Screen>
        <div className="card center">
          <h3>{tr('dlg.quiz')}</h3>
          <div className="row-actions">
            <button type="button" className="btn primary" onClick={() => setPhase('quiz')}>
              {tr('quiz.start')}
            </button>
          </div>
        </div>
      </Screen>
    )
  }

  return (
    <Screen>
      <div className="topbar">
        <Back onClick={() => setId(null)} />
        <h2>{d.title}</h2>
      </div>
      {progress.learn === 'kk' && <p className="note">{d.hint}</p>}
      <div className="card">
        <span className="pill">{current.who}</span>
        <p className="hello kk" style={{ color: 'var(--ink)', fontSize: 26, margin: '10px 0' }}>
          {learnFr ? current.fr : <Kk cyr={current.cyr} lat={current.lat} />}
        </p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Speak text={learnFr ? current.fr : current.cyr} />
          <button type="button" className="linkish" onClick={() => setShowTr((v) => !v)}>
            {showTr ? tr('dlg.hide') : tr('dlg.tr')}
          </button>
        </div>
        {showTr && (
          <p className="muted">{learnFr ? <Kk cyr={current.cyr} lat={current.lat} /> : current.fr}</p>
        )}
      </div>
      <p className="tiny center">
        {line + 1} / {d.lines.length}
      </p>
      <div className="row-actions">
        <button
          type="button"
          className="btn quiet"
          disabled={line === 0}
          onClick={() => {
            setLine((n) => Math.max(0, n - 1))
            setShowTr(false)
          }}
        >
          {tr('dlg.prev')}
        </button>
        <button
          type="button"
          className="btn primary"
          onClick={() => {
            if (last) {
              setLine(d.lines.length)
              return
            }
            const next = d.lines[line + 1]
            setLine((n) => n + 1)
            setShowTr(false)
            if (next) {
              if (learnFr) speakFrench(next.fr)
              else speakKazakh(next.cyr)
            }
          }}
        >
          {last ? tr('dlg.quiz') : tr('dlg.next')}
        </button>
      </div>
    </Screen>
  )
}
