import type { ReactNode } from 'react'
import { useApp } from './state'
import { speakFrench, speakKazakh } from './lib/speech'

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

export function Speak({ text, lang }: { text: string; lang?: 'kk' | 'fr' }) {
  const { progress, tr } = useApp()
  const use = lang ?? progress.learn
  return (
    <button
      type="button"
      className="speak"
      onClick={() => (use === 'fr' ? speakFrench(text) : speakKazakh(text))}
      aria-label={tr('listen')}
    >
      ♪
    </button>
  )
}

const CYR_KEYS = ['ә', 'і', 'ң', 'ғ', 'ү', 'ұ', 'қ', 'ө', 'һ']
const LAT_KEYS = ['ä', 'ğ', 'ñ', 'ö', 'ü', 'ū', 'ş', 'ı']
const FR_KEYS = ['é', 'è', 'ê', 'à', 'ç', 'ù', 'ô', 'î', 'ï', 'ë']

export function ExtraKeys({
  onType,
  onBackspace,
}: {
  onType: (ch: string) => void
  onBackspace: () => void
}) {
  const { progress, tr } = useApp()
  const keys = progress.learn === 'fr' ? FR_KEYS : progress.script === 'cyr' ? CYR_KEYS : LAT_KEYS
  return (
    <div className="keys">
      {keys.map((k) => (
        <button key={k} type="button" className="key" onClick={() => onType(k)}>
          {k}
        </button>
      ))}
      <button type="button" className="key wide" onClick={onBackspace} aria-label={tr('practice.type')}>
        ⌫
      </button>
    </div>
  )
}

export function Back({ onClick }: { onClick: () => void }) {
  const { tr } = useApp()
  return (
    <button type="button" className="back" onClick={onClick} aria-label={tr('back')}>
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

export function TrackSwitch() {
  const { progress, setLearn, tr } = useApp()
  return (
    <div className="script-switch track-switch" role="group" aria-label={tr('track.label')}>
      <button type="button" className={progress.learn === 'kk' ? 'on' : ''} onClick={() => setLearn('kk')}>
        {tr('track.kk')}
      </button>
      <button type="button" className={progress.learn === 'fr' ? 'on' : ''} onClick={() => setLearn('fr')}>
        {tr('track.fr')}
      </button>
    </div>
  )
}

export function Screen({ children }: { children: ReactNode }) {
  return <div className="screen">{children}</div>
}
