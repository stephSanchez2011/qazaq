import { useState } from 'react'
import { words, wordsById } from '../data/words'
import { dueCardIds } from '../lib/progress'
import { speakFrench, speakKazakh } from '../lib/speech'
import { useApp } from '../state'
import { Kk, Screen } from '../ui'
import type { Word } from '../data/types'

export function Cards() {
  const { progress, gradeCard, tr } = useApp()
  const [queue] = useState(() => {
    const ids = dueCardIds(progress, words.map((w) => w.id)).slice(0, 20)
    return ids.map((id) => wordsById[id]).filter((w): w is Word => Boolean(w))
  })
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(0)
  const card = queue[i]
  const learnFr = progress.learn === 'fr'

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
          <h2>{tr('cards.title')}</h2>
        </div>
        <div className="card empty">
          <p>{done > 0 ? tr('cards.empty.done', { n: done }) : tr('cards.empty')}</p>
        </div>
      </Screen>
    )
  }

  const frontFr = learnFr ? i % 2 === 0 : i % 2 === 0

  return (
    <Screen>
      <div className="topbar">
        <h2>{tr('cards.title')}</h2>
        <span className="muted">
          {i + 1}/{queue.length}
        </span>
      </div>
      <div
        className={`flash ${flipped ? 'revealed' : ''}`}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setFlipped((f) => !f)
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={tr('cards.tap')}
      >
        {!flipped ? (
          <>
            <span className="prompt">{frontFr ? tr('cards.fr') : tr('cards.kk')}</span>
            {frontFr ? (
              <p className="hello" style={{ color: 'var(--ink)' }}>
                {card.fr}
              </p>
            ) : (
              <p className="hello kk" style={{ color: 'var(--ink)' }}>
                {progress.script === 'cyr' ? card.cyr : card.lat}
              </p>
            )}
            <p className="tiny">{tr('cards.tap')}</p>
          </>
        ) : (
          <>
            <span className="prompt">{frontFr ? tr('cards.kk') : tr('cards.fr')}</span>
            {frontFr ? (
              <>
                <Kk cyr={card.cyr} lat={card.lat} className="hello" />
                <p className="ipa">/{card.ipa}/</p>
              </>
            ) : (
              <p className="hello" style={{ color: 'var(--ink)' }}>
                {card.fr}
              </p>
            )}
            <button
              type="button"
              className="speak"
              onClick={(e) => {
                e.stopPropagation()
                if (learnFr) speakFrench(card.fr)
                else speakKazakh(card.cyr)
              }}
            >
              ♪
            </button>
          </>
        )}
      </div>
      {flipped && (
        <div className="row-actions">
          <button type="button" className="btn bad" onClick={() => grade(false)}>
            {tr('cards.again')}
          </button>
          <button type="button" className="btn ok" onClick={() => grade(true)}>
            {tr('cards.knew')}
          </button>
        </div>
      )}
    </Screen>
  )
}
