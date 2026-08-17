import { lessons } from '../data/lessons'
import { phrases } from '../data/phrases'
import { words } from '../data/words'
import { dueCardIds, knownCount } from '../lib/progress'
import { useApp } from '../state'
import { ProgressBar, ScriptSwitch } from '../ui'

function greeting(): { kk: string; fr: string } {
  const h = new Date().getHours()
  if (h < 12) return { kk: 'Қайырлы таң!', fr: 'Bonne matinée — un peu de kazakh ?' }
  if (h < 18) return { kk: 'Сәлем!', fr: 'Et si on avançait d’une leçon ?' }
  return { kk: 'Қайырлы кеш!', fr: 'Une petite session avant la nuit ?' }
}

export function Home() {
  const { progress, go } = useApp()
  const hi = greeting()
  const next = lessons.find((l) => !progress.completedLessons.includes(l.id)) ?? lessons[lessons.length - 1]!
  const due = dueCardIds(progress, words.map((w) => w.id)).length
  const pct = (progress.completedLessons.length / lessons.length) * 100

  return (
    <>
      <header className="hero">
        <div className="brand">
          <div>
            <h1>Qazaq</h1>
            <p>apprendre le kazakh</p>
          </div>
          <ScriptSwitch />
        </div>
        <p className="hello kk">{hi.kk}</p>
        <p className="hello-sub">{hi.fr}</p>
        <div className="stats">
          <div className="stat">
            <b>{progress.streak}</b>
            <span>jours d’affilée</span>
          </div>
          <div className="stat">
            <b>{progress.xp}</b>
            <span>XP</span>
          </div>
          <div className="stat">
            <b>{knownCount(progress)}</b>
            <span>mots solides</span>
          </div>
        </div>
      </header>
      <div className="screen" style={{ paddingTop: 16 }}>
        <button type="button" className="cta" onClick={() => go('lesson', { lessonId: next.id })}>
          <span className="emoji">{next.emoji}</span>
          <span className="grow">
            <b>Continuer · {next.title}</b>
            <span>
              {progress.completedLessons.length}/{lessons.length} leçons
            </span>
            <ProgressBar value={pct} />
          </span>
        </button>

        <div className="h-row">
          <h2>Raccourcis</h2>
        </div>
        <div className="grid-2">
          <button type="button" className="tile" onClick={() => go('alphabet')}>
            <span className="pill">base</span>
            <b>Alphabet</b>
            <span>Cyrillique + latin</span>
          </button>
          <button type="button" className="tile" onClick={() => go('phrases')}>
            <span className="pill">oral</span>
            <b>Phrases</b>
            <span>{phrases.length} répliques utiles</span>
          </button>
          <button type="button" className="tile" onClick={() => go('cards')}>
            <span className="pill">mémoire</span>
            <b>Flashcards</b>
            <span>{due} cartes à revoir</span>
          </button>
          <button type="button" className="tile" onClick={() => go('grammar')}>
            <span className="pill">structure</span>
            <b>Grammaire</b>
            <span>cas, harmonie, politesse</span>
          </button>
        </div>
      </div>
    </>
  )
}
