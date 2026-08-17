import { useState } from 'react'
import { grammar } from '../data/grammar'
import { grammarFr } from '../data/grammarFr'
import { useApp } from '../state'
import { Back, Kk, Screen } from '../ui'

export function Grammar() {
  const { go, progress, tr } = useApp()
  const [id, setId] = useState<string | null>(null)
  const bank = progress.learn === 'fr' ? grammarFr : grammar
  const lesson = bank.find((g) => g.id === id)
  const learnFr = progress.learn === 'fr'

  if (!lesson) {
    return (
      <Screen>
        <div className="topbar">
          <Back onClick={() => go('more')} />
          <h2>{tr('grammar.title')}</h2>
        </div>
        <p className="muted" style={{ marginTop: 0 }}>
          {tr(learnFr ? 'grammar.intro.fr' : 'grammar.intro.kk')}
        </p>
        <div className="stack">
          {bank.map((g) => (
            <button key={g.id} type="button" className="list-row" onClick={() => setId(g.id)}>
              <span className="badge">◌</span>
              <span className="grow">
                <b>{g.title}</b>
                <span className="muted">{g.summary}</span>
              </span>
            </button>
          ))}
        </div>
      </Screen>
    )
  }

  return (
    <Screen>
      <div className="topbar">
        <Back onClick={() => setId(null)} />
        <h2>{lesson.title}</h2>
      </div>
      <div className="card grammar">
        <p className="note">{lesson.summary}</p>
        {lesson.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
        {lesson.examples.map((ex) => (
          <div key={ex.cyr + ex.fr} className="ex">
            {learnFr ? (
              <>
                <div>
                  <b>{ex.fr}</b>
                </div>
                <div className="muted">
                  <Kk cyr={ex.cyr} lat={ex.lat} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Kk cyr={ex.cyr} lat={ex.lat} />
                </div>
                <div className="muted">{ex.fr}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </Screen>
  )
}
