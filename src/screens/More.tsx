import { useApp } from '../state'
import { Screen } from '../ui'

export function More() {
  const { go, progress } = useApp()

  return (
    <Screen>
      <div className="topbar">
        <h2>Plus</h2>
      </div>
      <div className="stack">
        <button type="button" className="list-row" onClick={() => go('alphabet')}>
          <span className="badge">АӘ</span>
          <span className="grow">
            <b>Alphabet kazakh</b>
            <span className="muted">42 lettres, sons, exemples</span>
          </span>
        </button>
        <button type="button" className="list-row" onClick={() => go('phrases')}>
          <span className="badge">💬</span>
          <span className="grow">
            <b>Phrases du voyageur</b>
            <span className="muted">Café, taxi, marché, politesse</span>
          </span>
        </button>
        <button type="button" className="list-row" onClick={() => go('grammar')}>
          <span className="badge">☰</span>
          <span className="grow">
            <b>Grammaire claire</b>
            <span className="muted">Cas, harmonie vocalique, бар/жоқ</span>
          </span>
        </button>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <p>
          <b>Votre rythme</b>
        </p>
        <p className="muted">
          {progress.xp} XP · série de {progress.streak} jour{progress.streak > 1 ? 's' : ''} · meilleur quiz{' '}
          {progress.quizBest}/10
        </p>
        <p className="tiny">
          Tout reste sur cet appareil. Basculez Кирил / Latin en haut de l’accueil : le Kazakhstan utilise encore le
          cyrillique au quotidien, tout en passant au latin.
        </p>
        <p className="tiny">
          Le bouton ♪ utilise la synthèse vocale du téléphone. S’il n’a pas de voix kazakhe, il se rabat sur le russe —
          proche, pas parfait.
        </p>
      </div>
    </Screen>
  )
}
