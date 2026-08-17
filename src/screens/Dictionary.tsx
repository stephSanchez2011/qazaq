import { useMemo, useState } from 'react'
import { categories, words } from '../data/words'
import type { I18nKey } from '../lib/i18n'
import { useApp } from '../state'
import { Back, Kk, Screen, Speak } from '../ui'
import type { Word } from '../data/types'

function catKey(c: string): I18nKey {
  return `cat.${c}` as I18nKey
}

export function Dictionary() {
  const { go, gradeCard, progress, tr } = useApp()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string>('all')
  const [open, setOpen] = useState<Word | null>(null)
  const learnFr = progress.learn === 'fr'

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
        <h2>{tr('dict.title')}</h2>
      </div>
      <input
        className="field"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={tr('dict.search')}
        aria-label={tr('dict.search')}
      />
      <div className="chips" style={{ marginTop: 10 }}>
        <button type="button" className={`chip ${cat === 'all' ? 'on' : ''}`} onClick={() => setCat('all')}>
          {tr('dict.all')}
        </button>
        {categories.map((c) => (
          <button key={c} type="button" className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>
            {tr(catKey(c))}
          </button>
        ))}
      </div>
      <p className="tiny">{list.length === 1 ? tr('dict.count', { n: 1 }) : tr('dict.counts', { n: list.length })}</p>
      <div className="stack">
        {list.map((w) => (
          <button key={w.id} type="button" className="phrase" onClick={() => setOpen(w)}>
            <b>{learnFr ? w.fr : <Kk cyr={w.cyr} lat={w.lat} />}</b>
            <div className="muted">{learnFr ? <Kk cyr={w.cyr} lat={w.lat} /> : w.fr}</div>
          </button>
        ))}
      </div>
      {open && (
        <div className="sheet" role="dialog" aria-label={open.fr}>
          <div className="card word-card">
            {learnFr ? (
              <>
                <p className="hello" style={{ color: 'var(--ink)' }}>
                  {open.fr}
                </p>
                <p className="fr">
                  <Kk cyr={open.cyr} lat={open.lat} />
                </p>
              </>
            ) : (
              <>
                <Kk cyr={open.cyr} lat={open.lat} />
                <p className="ipa">/{open.ipa}/</p>
                <p className="fr">{open.fr}</p>
              </>
            )}
            <p className="tiny">{tr(catKey(open.category))}</p>
            {open.note && progress.learn === 'kk' && <p className="note">{open.note}</p>}
            <div className="row-actions">
              <Speak text={learnFr ? open.fr : open.cyr} />
              <button
                type="button"
                className="btn gold"
                onClick={() => {
                  gradeCard(open.id, false)
                  setOpen(null)
                }}
              >
                {tr('dict.review')}
              </button>
            </div>
            <button type="button" className="btn quiet" onClick={() => setOpen(null)}>
              {tr('close')}
            </button>
          </div>
        </div>
      )}
    </Screen>
  )
}
