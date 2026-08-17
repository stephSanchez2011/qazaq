import { useState } from 'react'
import { phrases, situations } from '../data/phrases'
import type { I18nKey } from '../lib/i18n'
import { useApp } from '../state'
import { Back, Kk, Screen, Speak } from '../ui'

const SIT: Record<string, I18nKey> = {
  rencontre: 'sit.rencontre',
  secours: 'sit.secours',
  ville: 'sit.ville',
  marché: 'sit.marché',
  table: 'sit.table',
  hôtel: 'sit.hôtel',
  météo: 'sit.météo',
  santé: 'sit.santé',
}

export function Phrases() {
  const { go, progress, tr } = useApp()
  const [sit, setSit] = useState<string>('rencontre')
  const [open, setOpen] = useState<string | null>(null)
  const list = phrases.filter((p) => p.situation === sit)
  const learnFr = progress.learn === 'fr'

  return (
    <Screen>
      <div className="topbar">
        <Back onClick={() => go('more')} />
        <h2>{tr('phrases.title')}</h2>
      </div>
      <div className="chips">
        {situations.map((s) => (
          <button key={s} type="button" className={`chip ${sit === s ? 'on' : ''}`} onClick={() => setSit(s)}>
            {tr(SIT[s] ?? 'sit.rencontre')}
          </button>
        ))}
      </div>
      <div className="stack">
        {list.map((p) => {
          const isOpen = open === p.id
          return (
            <button key={p.id} type="button" className="phrase" onClick={() => setOpen(isOpen ? null : p.id)}>
              <b>{learnFr ? p.fr : <Kk cyr={p.cyr} lat={p.lat} />}</b>
              <div className="muted">{learnFr ? <Kk cyr={p.cyr} lat={p.lat} /> : p.fr}</div>
              {isOpen && (
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Speak text={learnFr ? p.fr : p.cyr} />
                  {p.note && progress.learn === 'kk' && <span className="tiny">{p.note}</span>}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </Screen>
  )
}
