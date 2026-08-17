import { useState } from 'react'
import { phrases, situations } from '../data/phrases'
import { useApp } from '../state'
import { Back, Kk, Screen, Speak } from '../ui'

const LABELS: Record<string, string> = {
  rencontre: 'Rencontre',
  secours: 'Je ne comprends pas',
  ville: 'En ville',
  marché: 'Au marché',
  table: 'À table',
  hôtel: 'Hôtel',
  météo: 'Météo',
  santé: 'Santé',
}

export function Phrases() {
  const { go } = useApp()
  const [sit, setSit] = useState<string>('rencontre')
  const [open, setOpen] = useState<string | null>(null)
  const list = phrases.filter((p) => p.situation === sit)

  return (
    <Screen>
      <div className="topbar">
        <Back onClick={() => go('more')} />
        <h2>Phrases</h2>
      </div>
      <div className="chips">
        {situations.map((s) => (
          <button key={s} type="button" className={`chip ${sit === s ? 'on' : ''}`} onClick={() => setSit(s)}>
            {LABELS[s] ?? s}
          </button>
        ))}
      </div>
      <div className="stack">
        {list.map((p) => {
          const isOpen = open === p.id
          return (
            <button key={p.id} type="button" className="phrase" onClick={() => setOpen(isOpen ? null : p.id)}>
              <b>
                <Kk cyr={p.cyr} lat={p.lat} />
              </b>
              <div className="muted">{p.fr}</div>
              {isOpen && (
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Speak text={p.cyr} />
                  {p.note && <span className="tiny">{p.note}</span>}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </Screen>
  )
}
