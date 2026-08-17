import { useMemo, useState } from 'react'
import { categories, categoryLabels, words } from '../data/words'
import { useApp } from '../state'
import { Back, Kk, Screen, Speak } from '../ui'
import type { Word } from '../data/types'

export function Dictionary() {
  const { go, gradeCard } = useApp()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string>('all')
  const [open, setOpen] = useState<Word | null>(null)

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return words.filter((w) => {
      if (cat !== 'all' && w.category !== cat) return false
      if (!needle) return true
      return [w.fr, w.cyr, w.lat, w.ipa].some((s) => s.toLowerCase().includes(needle))
    })
  }, [q, cat])

  return (
    <Screen>
      <div className="topbar">
        <Back onClick={() => go('more')} />
        <h2>Lexique</h2>
      </div>
      <input
        className="field"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Chercher un mot…"
        aria-label="Recherche"
      />
      <div className="chips" style={{ marginTop: 10 }}>
        <button type="button" className={`chip ${cat === 'all' ? 'on' : ''}`} onClick={() => setCat('all')}>
          Tout
        </button>
        {categories.map((c) => (
          <button key={c} type="button" className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>
            {categoryLabels[c] ?? c}
          </button>
        ))}
      </div>
      <p className="tiny">{list.length} mot{list.length > 1 ? 's' : ''}</p>
      <div className="stack">
        {list.map((w) => (
          <button key={w.id} type="button" className="phrase" onClick={() => setOpen(w)}>
            <b>
              <Kk cyr={w.cyr} lat={w.lat} />
            </b>
            <div className="muted">{w.fr}</div>
          </button>
        ))}
      </div>
      {open && (
        <div className="sheet" role="dialog" aria-label={open.fr}>
          <div className="card word-card">
            <Kk cyr={open.cyr} lat={open.lat} />
            <p className="ipa">/{open.ipa}/</p>
            <p className="fr">{open.fr}</p>
            <p className="tiny">{categoryLabels[open.category] ?? open.category}</p>
            {open.note && <p className="note">{open.note}</p>}
            <div className="row-actions">
              <Speak text={open.cyr} />
              <button
                type="button"
                className="btn gold"
                onClick={() => {
                  gradeCard(open.id, false)
                  setOpen(null)
                }}
              >
                Réviser
              </button>
            </div>
            <button type="button" className="btn quiet" onClick={() => setOpen(null)}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </Screen>
  )
}
