import { useState } from 'react'
import { alphabet } from '../data/alphabet'
import { useApp } from '../state'
import { speakKazakh } from '../lib/speech'
import { Back, Screen, Speak } from '../ui'

export function Alphabet() {
  const { progress, go } = useApp()
  const [onlyCore, setOnlyCore] = useState(true)
  const [sel, setSel] = useState(alphabet.find((l) => l.core)?.cyr ?? 'А')
  const letters = onlyCore ? alphabet.filter((l) => l.core) : alphabet
  const letter = alphabet.find((l) => l.cyr === sel) ?? letters[0]!

  return (
    <Screen>
      <div className="topbar">
        <Back onClick={() => go('more')} />
        <h2>Alphabet</h2>
      </div>
      <p className="muted" style={{ marginTop: 0 }}>
        Les lettres teintées sont celles du kazakh « de tous les jours ». Les autres apparaissent surtout dans les
        emprunts.
      </p>
      <div className="chips">
        <button type="button" className={`chip ${onlyCore ? 'on' : ''}`} onClick={() => setOnlyCore(true)}>
          Essentielles
        </button>
        <button type="button" className={`chip ${!onlyCore ? 'on' : ''}`} onClick={() => setOnlyCore(false)}>
          42 lettres
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
              speakKazakh(l.cyr)
            }}
          >
            {progress.script === 'cyr' ? l.cyr : l.lat || l.cyr}
          </button>
        ))}
      </div>
      <div className="card detail">
        <div className="brand">
          <div className="big-letter">{progress.script === 'cyr' ? letter.cyr : letter.lat || letter.cyr}</div>
          <Speak text={letter.cyr} />
        </div>
        <p className="ipa">/{letter.ipa || '—'}/ · {letter.name}</p>
        <p>{letter.hint}</p>
        <p className="ex">
          <b className="kk">{progress.script === 'cyr' ? letter.exampleCyr : letter.exampleLat}</b>
          <span className="muted"> — {letter.exampleFr}</span>
        </p>
      </div>
    </Screen>
  )
}
