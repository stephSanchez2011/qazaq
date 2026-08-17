import { useEffect, useState } from 'react'
import { words } from '../data/words'
import { chooseVoice, voiceSummary } from '../lib/speech'
import { useApp } from '../state'
import { Screen, TrackSwitch } from '../ui'

function VoiceLine() {
  const { progress, tr } = useApp()
  const [label, setLabel] = useState('…')
  const [frenchOnly, setFrenchOnly] = useState(false)
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setLabel('—')
      return
    }
    const update = () => {
      const voices = window.speechSynthesis.getVoices()
      if (progress.learn === 'fr') {
        const fr = voices.find((v) => v.lang.toLowerCase().replace('_', '-').startsWith('fr'))
        setLabel(fr ? `${fr.name} · ${fr.lang}` : 'fr-FR')
        setFrenchOnly(false)
        return
      }
      const { profile } = chooseVoice(voices)
      setLabel(voiceSummary(voices))
      setFrenchOnly(profile === 'fr' && voices.length > 0)
    }
    update()
    window.speechSynthesis.addEventListener('voiceschanged', update)
    const id = window.setTimeout(update, 800)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', update)
      window.clearTimeout(id)
    }
  }, [progress.learn])
  return (
    <p className="tiny">
      {tr('more.voice.now')} : <b>{label}</b>
      {frenchOnly ? tr('more.voice.fronly') : ''}
    </p>
  )
}

export function More() {
  const { go, progress, wipeProgress, tr } = useApp()
  const [confirm, setConfirm] = useState(false)
  const learnFr = progress.learn === 'fr'

  return (
    <Screen>
      <div className="topbar">
        <h2>{tr('more.title')}</h2>
      </div>
      <div className="card" style={{ marginBottom: 14 }}>
        <p>
          <b>{tr('track.label')}</b>
        </p>
        <TrackSwitch />
      </div>
      <div className="stack">
        <button type="button" className="list-row" onClick={() => go('dictionary')}>
          <span className="badge">Aa</span>
          <span className="grow">
            <b>{tr('home.lexicon')}</b>
            <span className="muted">
              {words.length} {tr('more.lexicon.sub')}
            </span>
          </span>
        </button>
        <button type="button" className="list-row" onClick={() => go('dialogues')}>
          <span className="badge">🎙</span>
          <span className="grow">
            <b>{tr('home.dialogues')}</b>
            <span className="muted">{tr('more.dlg.sub')}</span>
          </span>
        </button>
        <button type="button" className="list-row" onClick={() => go('practice')}>
          <span className="badge">✎</span>
          <span className="grow">
            <b>{tr('home.practice')}</b>
            <span className="muted">{tr('more.practice.sub')}</span>
          </span>
        </button>
        <button type="button" className="list-row" onClick={() => go('quiz')}>
          <span className="badge">?</span>
          <span className="grow">
            <b>{tr('more.quiz')}</b>
            <span className="muted">{tr('more.quiz.sub', { n: progress.quizBest })}</span>
          </span>
        </button>
        <button type="button" className="list-row" onClick={() => go('alphabet')}>
          <span className="badge">АӘ</span>
          <span className="grow">
            <b>{tr(learnFr ? 'more.alpha.fr' : 'more.alpha.kk')}</b>
            <span className="muted">{tr(learnFr ? 'more.alpha.sub.fr' : 'more.alpha.sub.kk')}</span>
          </span>
        </button>
        <button type="button" className="list-row" onClick={() => go('phrases')}>
          <span className="badge">💬</span>
          <span className="grow">
            <b>{tr('more.phrases')}</b>
            <span className="muted">{tr('more.phrases.sub')}</span>
          </span>
        </button>
        <button type="button" className="list-row" onClick={() => go('grammar')}>
          <span className="badge">☰</span>
          <span className="grow">
            <b>{tr('more.grammar')}</b>
            <span className="muted">{tr(learnFr ? 'more.grammar.sub.fr' : 'more.grammar.sub.kk')}</span>
          </span>
        </button>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <p>
          <b>{tr('more.pace')}</b>
        </p>
        <p className="muted">
          {tr('more.stats', { xp: progress.xp, streak: progress.streak, best: progress.quizBest })}
        </p>
        <p className="tiny">{tr('more.local')}</p>
        <p className="tiny">{tr(learnFr ? 'more.voice.fr' : 'more.voice.kk')}</p>
        <VoiceLine />
        {!confirm ? (
          <button type="button" className="btn quiet" style={{ marginTop: 12 }} onClick={() => setConfirm(true)}>
            {tr('more.reset')}
          </button>
        ) : (
          <div className="row-actions">
            <button type="button" className="btn bad" onClick={() => { wipeProgress(); setConfirm(false) }}>
              {tr('more.wipe')}
            </button>
            <button type="button" className="btn quiet" onClick={() => setConfirm(false)}>
              {tr('cancel')}
            </button>
          </div>
        )}
      </div>
    </Screen>
  )
}
