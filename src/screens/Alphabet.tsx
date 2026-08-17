import { useEffect, useState } from 'react'
import { alphabet } from '../data/alphabet'
import { frenchAlphabet } from '../data/frenchAlphabet'
import { speakFrench, speakKazakh } from '../lib/speech'
import { useApp } from '../state'
import { Back, Screen, Speak } from '../ui'

export function Alphabet() {
  const { progress, go, tr } = useApp()
  const learnFr = progress.learn === 'fr'
  const source = learnFr ? frenchAlphabet : alphabet
  const [onlyCore, setOnlyCore] = useState(true)
  const [sel, setSel] = useState(source.find((l) => l.core)?.cyr ?? source[0]!.cyr)
  const letters = onlyCore ? source.filter((l) => l.core) : source
  const letter = source.find((l) => l.cyr === sel) ?? letters[0]!

  useEffect(() => {
    setSel(source.find((l) => l.core)?.cyr ?? source[0]!.cyr)
  }, [learnFr, source])

  return (
    <Screen>
      <div className="topbar">
        <Back onClick={() => go('more')} />
        <h2>{tr('alpha.title')}</h2>
      </div>
      <p className="muted" style={{ marginTop: 0 }}>
        {tr(learnFr ? 'alpha.intro.fr' : 'alpha.intro.kk')}
      </p>
      <div className="chips">
        <button type="button" className={`chip ${onlyCore ? 'on' : ''}`} onClick={() => setOnlyCore(true)}>
          {tr('alpha.core')}
        </button>
        <button
          type="button"
          className={`chip ${!onlyCore ? 'on' : ''}`}
          onClick={() => setOnlyCore(false)}
        >
          {tr(learnFr ? 'alpha.all.fr' : 'alpha.all')}
        </button>
      </div>
      <div className="letter-grid">
        {letters.map((l) => (
          <button
            key={l.cyr}
            type="button"
            className={`letter ${l.core ? 'core' : ''} ${l.cyr === sel ? 'on' : ''}`}
            onClick={() => {
              setSel(l.cyr)
              if (learnFr) speakFrench(l.name)
              else speakKazakh(l.cyr)
            }}
          >
            {learnFr ? l.lat : progress.script === 'cyr' ? l.cyr : l.lat || l.cyr}
          </button>
        ))}
      </div>
      <div className="card detail">
        <div className="brand">
          <div className="big-letter">
            {learnFr ? letter.lat : progress.script === 'cyr' ? letter.cyr : letter.lat || letter.cyr}
          </div>
          <Speak text={learnFr ? letter.exampleFr || letter.lat : letter.cyr} lang={learnFr ? 'fr' : 'kk'} />
        </div>
        <p className="ipa">
          /{letter.ipa || '—'}/ · {letter.name}
        </p>
        <p>{letter.hint}</p>
        {learnFr ? (
          <>
            <p className="target" style={{ fontSize: 28, fontWeight: 700, margin: '8px 0 4px' }}>
              {letter.exampleFr}
            </p>
            <p className="muted">
              {progress.script === 'cyr' ? letter.exampleCyr : letter.exampleLat}
            </p>
          </>
        ) : (
          <p className="ex">
            <b className="kk">{progress.script === 'cyr' ? letter.exampleCyr : letter.exampleLat}</b>
            <span className="muted"> — {letter.exampleFr}</span>
          </p>
        )}
      </div>
    </Screen>
  )
}
