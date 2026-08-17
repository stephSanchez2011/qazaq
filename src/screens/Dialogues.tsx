import { useState } from 'react'
import { dialogues } from '../data/dialogues'
import { speakFrench, speakKazakh } from '../lib/speech'
import { useApp } from '../state'
import { Back, Kk, Screen, Speak } from '../ui'

export function Dialogues() {
  const { go, awardXp, progress, tr } = useApp()
  const [id, setId] = useState<string | null>(null)
  const [line, setLine] = useState(0)
  const [showTr, setShowTr] = useState(false)
  const d = dialogues.find((x) => x.id === id)
  const learnFr = progress.learn === 'fr'

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
          {dialogues.map((item) => (
            <button
              key={item.id}
              type="button"
              className="list-row"
              onClick={() => {
                setId(item.id)
                setLine(0)
                setShowTr(false)
              }}
            >
              <span className="badge">🎙</span>
              <span className="grow">
                <b>{item.title}</b>
                <span className="muted">{item.place}</span>
              </span>
            </button>
          ))}
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
          <h3>{tr('dlg.done')}</h3>
          <p className="muted">{d.title}</p>
          <div className="row-actions">
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                awardXp(12)
                setId(null)
              }}
            >
              {tr('back')}
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
          {last ? tr('lesson.finish') : tr('dlg.next')}
        </button>
      </div>
    </Screen>
  )
}
