import type { ReactNode } from 'react'
import { useApp } from './state'
import { speakKazakh } from './lib/speech'

export function Kk({
  cyr,
  lat,
  className,
}: {
  cyr: string
  lat: string
  className?: string
}) {
  const { progress } = useApp()
  return <span className={`kk ${className ?? ''}`}>{progress.script === 'cyr' ? cyr : lat}</span>
}

export function Speak({ text }: { text: string }) {
  return (
    <button type="button" className="speak" onClick={() => speakKazakh(text)} aria-label="Écouter">
      ♪
    </button>
  )
}

const CYR_KEYS = ['ә', 'і', 'ң', 'ғ', 'ү', 'ұ', 'қ', 'ө', 'һ']
const LAT_KEYS = ['ä', 'ğ', 'ñ', 'ö', 'ü', 'ū', 'ş', 'ı']

export function ExtraKeys({
  onType,
  onBackspace,
}: {
  onType: (ch: string) => void
  onBackspace: () => void
}) {
  const { progress } = useApp()
  const keys = progress.script === 'cyr' ? CYR_KEYS : LAT_KEYS
  return (
    <div className="keys">
      {keys.map((k) => (
        <button key={k} type="button" className="key" onClick={() => onType(k)}>
          {k}
        </button>
      ))}
      <button type="button" className="key wide" onClick={onBackspace} aria-label="Effacer">
        ⌫
      </button>
    </div>
  )
}

export function Back({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="back" onClick={onClick} aria-label="Retour">
      ←
    </button>
  )
}

export function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className="progress-line">
      <i style={{ width: `${pct}%` }} />
    </div>
  )
}

export function ScriptSwitch() {
  const { progress, setScript } = useApp()
  return (
    <div className="script-switch" role="group" aria-label="Alphabet">
      <button type="button" className={progress.script === 'cyr' ? 'on' : ''} onClick={() => setScript('cyr')}>
        Кирил
      </button>
      <button type="button" className={progress.script === 'lat' ? 'on' : ''} onClick={() => setScript('lat')}>
        Latin
      </button>
    </div>
  )
}

export function Screen({ children }: { children: ReactNode }) {
  return <div className="screen">{children}</div>
}
