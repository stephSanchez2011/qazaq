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
