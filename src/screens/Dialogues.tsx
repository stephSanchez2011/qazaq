import { useState } from 'react'
import { dialogues } from '../data/dialogues'
import { speakKazakh } from '../lib/speech'
import { useApp } from '../state'
import { Back, Kk, Screen, Speak } from '../ui'

export function Dialogues() {
  const { go, awardXp } = useApp()
  const [id, setId] = useState<string | null>(null)
  const [line, setLine] = useState(0)
  const [showFr, setShowFr] = useState(false)
  const d = dialogues.find((x) => x.id === id)

  if (!d) {
    return (
      <Screen>
        <div className="topbar">
          <Back onClick={() => go('more')} />
          <h2>Dialogues</h2>
        </div>
        <p className="muted" style={{ marginTop: 0 }}>
          Cinq scènes à écouter réplique par réplique — comme si vous y étiez.
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
                setShowFr(false)
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
          <h3>Керемет! Scène finie</h3>
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
              Retour
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
      <p className="note">{d.hint}</p>
      <div className="card">
        <span className="pill">{current.who}</span>
        <p className="hello kk" style={{ color: 'var(--ink)', fontSize: 26, margin: '10px 0' }}>
          <Kk cyr={current.cyr} lat={current.lat} />
        </p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Speak text={current.cyr} />
          <button type="button" className="linkish" onClick={() => setShowFr((v) => !v)}>
            {showFr ? 'Masquer' : 'Traduction'}
          </button>
        </div>
        {showFr && <p className="muted">{current.fr}</p>}
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
            setShowFr(false)
          }}
        >
          Précédent
        </button>
        <button
          type="button"
          className="btn primary"
          onClick={() => {
            if (last) {
              setLine(d.lines.length)
              return
            }
            setLine((n) => n + 1)
            setShowFr(false)
            speakKazakh(d.lines[line + 1]?.cyr ?? '')
          }}
        >
          {last ? 'Terminer' : 'Réplique suivante'}
        </button>
      </div>
    </Screen>
  )
}
