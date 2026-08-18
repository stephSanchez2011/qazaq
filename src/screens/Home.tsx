import { lessons } from '../data/lessons'
import { phrases } from '../data/phrases'
import { words } from '../data/words'
import { dueCardIds, knownCount, todayStamp, wordOfDayIndex } from '../lib/progress'
import { lessonTitle } from '../lib/i18n'
import { useApp } from '../state'
import { Kk, ProgressBar, ScriptSwitch, Speak, TrackSwitch } from '../ui'

function greetingKeys(h: number): { top: 'hi.kk.morning' | 'hi.kk.day' | 'hi.kk.evening'; sub: 'hi.morning' | 'hi.day' | 'hi.evening' } {
  if (h < 12) return { top: 'hi.kk.morning', sub: 'hi.morning' }
  if (h < 18) return { top: 'hi.kk.day', sub: 'hi.day' }
  return { top: 'hi.kk.evening', sub: 'hi.evening' }
}

export function Home() {
  const { progress, go, tr } = useApp()
  const keys = greetingKeys(new Date().getHours())
  const next = lessons.find((l) => !progress.completedLessons.includes(l.id)) ?? lessons[lessons.length - 1]!
  const due = dueCardIds(progress, words.map((w) => w.id)).length
  const pct = (progress.completedLessons.length / lessons.length) * 100
  const daily = progress.dailyStamp === todayStamp() ? progress.dailyXp : 0
  const goalPct = (daily / progress.dailyGoal) * 100
  const wod = words[wordOfDayIndex(words.length)]!
  const learnFr = progress.learn === 'fr'
  const nextTitle = lessonTitle(progress.learn, next.id) ?? next.title

  return (
    <>
      <header className="hero">
        <div className="brand">
          <div>
            <h1>Qazaq</h1>
            <p>{tr(learnFr ? 'tagline.fr' : 'tagline.kk')}</p>
          </div>
          <ScriptSwitch />
        </div>
        <p className="hello kk">{tr(keys.top)}</p>
        <p className="hello-sub">{tr(keys.sub)}</p>
        <div style={{ marginTop: 12 }}>
          <TrackSwitch />
        </div>
        <div className="stats">
          <div className="stat">
            <b>{progress.streak}</b>
            <span>{tr('stat.streak')}</span>
          </div>
          <div className="stat">
            <b>{progress.xp}</b>
            <span>{tr('stat.xp')}</span>
          </div>
          <div className="stat">
            <b>{knownCount(progress)}</b>
            <span>{tr('stat.words')}</span>
          </div>
        </div>
      </header>
      <div className="screen" style={{ paddingTop: 16 }}>
        <div className="card">
          <span className="pill">{tr('home.goal')}</span>
          <p style={{ margin: '8px 0 0' }}>
            <b>
              {daily} / {progress.dailyGoal} XP
            </b>
          </p>
          <ProgressBar value={goalPct} />
          <p className="tiny">{daily >= progress.dailyGoal ? tr('home.goal.ok') : tr('home.goal.hint')}</p>
        </div>

        <button type="button" className="cta" onClick={() => go('lesson', { lessonId: next.id })}>
          <span className="emoji">{next.emoji}</span>
          <span className="grow">
            <b>
              {tr('home.continue')} · {nextTitle}
            </b>
            <span>
              {progress.completedLessons.length}/{lessons.length} {tr('home.lessons')}
            </span>
            <ProgressBar value={pct} />
          </span>
        </button>

        <div className="card wod">
          <span className="pill">{tr('home.wod')}</span>
          <div className="brand" style={{ marginTop: 8 }}>
            <div>
              {learnFr ? (
                <>
                  <b style={{ fontSize: 22 }}>{wod.fr}</b>
                  <div className="muted">
                    <Kk cyr={wod.cyr} lat={wod.lat} />
                  </div>
                </>
              ) : (
                <>
                  <b className="kk" style={{ fontSize: 22 }}>
                    <Kk cyr={wod.cyr} lat={wod.lat} />
                  </b>
                  <div className="muted">{wod.fr}</div>
                </>
              )}
            </div>
            <Speak text={learnFr ? wod.fr : wod.cyr} />
          </div>
        </div>

        <div className="h-row">
          <h2>{tr('home.shortcuts')}</h2>
        </div>
        <div className="grid-2">
          <button type="button" className="tile" onClick={() => go('practice')}>
            <span className="pill">{tr('pill.atelier')}</span>
            <b>{tr('home.practice')}</b>
            <span>{tr('home.practice.sub')}</span>
          </button>
          <button type="button" className="tile" onClick={() => go('dictionary')}>
            <span className="pill">{tr('pill.mots')}</span>
            <b>{tr('home.lexicon')}</b>
            <span>
              {words.length} {tr('home.lexicon.sub')}
            </span>
          </button>
          <button type="button" className="tile" onClick={() => go('dialogues')}>
            <span className="pill">{tr('pill.scenes')}</span>
            <b>{tr('home.dialogues')}</b>
            <span>{tr('home.dialogues.sub')}</span>
          </button>
          <button type="button" className="tile" onClick={() => go('cards')}>
            <span className="pill">{tr('pill.memoire')}</span>
            <b>{tr('home.cards')}</b>
            <span>
              {due} {tr('home.cards.due')}
            </span>
          </button>
          <button type="button" className="tile" onClick={() => go('alphabet')}>
            <span className="pill">{tr('pill.base')}</span>
            <b>{tr('home.alphabet')}</b>
            <span>{tr(learnFr ? 'home.alphabet.sub.fr' : 'home.alphabet.sub.kk')}</span>
          </button>
          <button type="button" className="tile" onClick={() => go('quiz')}>
            <span className="pill">{tr('pill.quiz')}</span>
            <b>{tr('home.quiz')}</b>
            <span>{tr('home.quiz.sub')}</span>
          </button>
          <button type="button" className="tile" onClick={() => go('phrases')}>
            <span className="pill">{tr('pill.oral')}</span>
            <b>{tr('home.phrases')}</b>
            <span>
              {phrases.length} {tr('home.phrases.sub')}
            </span>
          </button>
        </div>
      </div>
    </>
  )
}
