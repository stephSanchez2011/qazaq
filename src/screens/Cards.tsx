import { useState } from 'react'
import { words, wordsById } from '../data/words'
import { dueCardIds } from '../lib/progress'
import { speakKazakh } from '../lib/speech'
import { useApp } from '../state'
import { Kk, Screen } from '../ui'
import type { Word } from '../data/types'

export function Cards() {
  const { progress, gradeCard } = useApp()
  const [queue] = useState(() => {
    const ids = dueCardIds(progress, words.map((w) => w.id)).slice(0, 20)
    return ids.map((id) => wordsById[id]).filter((w): w is Word => Boolean(w))
  })
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(0)
  const card = queue[i]

  function grade(ok: boolean) {
    if (!card) return
    gradeCard(card.id, ok)
    setFlipped(false)
    setDone((n) => n + 1)
    setI((n) => n + 1)
  }

  if (!card) {
    return (
      <Screen>
        <div className="topbar">
          <h2>Flashcards</h2>
        </div>
        <div className="card empty">
          <p>
            {done > 0
              ? `Session finie · ${done} cartes. Revenez demain pour la répétition.`
              : 'Aucune carte due. Lancez une leçon pour alimenter le paquet.'}
          </p>
        </div>
      </Screen>
    )
  }

  const frontFr = i % 2 === 0

  return (
    <Screen>
      <div className="topbar">
        <h2>Flashcards</h2>
        <span className="muted">
          {i + 1}/{queue.length}
        </span>
      </div>
      <div
        className={`flip ${flipped ? 'on' : ''}`}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setFlipped((f) => !f)
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Retourner la carte"
      >
        <div className="flip-inner">
          <div className="face">
            <span className="prompt">{frontFr ? 'Français' : 'Kazakh'}</span>
            {frontFr ? (
              <p className="hello" style={{ color: 'var(--ink)', margin: '12px 0 0' }}>
                {card.fr}
              </p>
            ) : (
              <p className="hello kk" style={{ color: 'var(--ink)', margin: '12px 0 0' }}>
                {progress.script === 'cyr' ? card.cyr : card.lat}
              </p>
            )}
            <p className="tiny">Touchez pour retourner</p>
          </div>
          <div className="face back">
            <span className="prompt">{frontFr ? 'Kazakh' : 'Français'}</span>
            {frontFr ? (
              <>
                <Kk cyr={card.cyr} lat={card.lat} className="hello" />
                <p className="ipa">/{card.ipa}/</p>
              </>
            ) : (
              <p className="hello" style={{ color: 'var(--ink)', margin: '12px 0 0' }}>
                {card.fr}
              </p>
            )}
            <button
              type="button"
              className="speak"
              onClick={(e) => {
                e.stopPropagation()
                speakKazakh(card.cyr)
              }}
            >
              ♪
            </button>
          </div>
        </div>
      </div>
      {flipped && (
        <div className="row-actions">
          <button type="button" className="btn bad" onClick={() => grade(false)}>
            À revoir
          </button>
          <button type="button" className="btn ok" onClick={() => grade(true)}>
            Je savais
          </button>
        </div>
      )}
    </Screen>
  )
}
