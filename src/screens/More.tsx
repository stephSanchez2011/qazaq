import { useState } from 'react'
import { words } from '../data/words'
import { useApp } from '../state'
import { Screen } from '../ui'

export function More() {
  const { go, progress, wipeProgress } = useApp()
  const [confirm, setConfirm] = useState(false)

  return (
    <Screen>
      <div className="topbar">
        <h2>Plus</h2>
      </div>
      <div className="stack">
        <button type="button" className="list-row" onClick={() => go('dictionary')}>
          <span className="badge">Aa</span>
          <span className="grow">
            <b>Lexique</b>
            <span className="muted">{words.length} mots, recherche et thèmes</span>
          </span>
        </button>
        <button type="button" className="list-row" onClick={() => go('dialogues')}>
          <span className="badge">🎙</span>
          <span className="grow">
            <b>Dialogues</b>
            <span className="muted">Se présenter, thé, bazar, chemin, hôtel</span>
          </span>
        </button>
        <button type="button" className="list-row" onClick={() => go('practice')}>
          <span className="badge">✎</span>
          <span className="grow">
            <b>Atelier</b>
            <span className="muted">Écrire, associer, écouter</span>
          </span>
        </button>
        <button type="button" className="list-row" onClick={() => go('quiz')}>
          <span className="badge">?</span>
          <span className="grow">
            <b>Quiz classique</b>
            <span className="muted">Meilleur score {progress.quizBest}/10</span>
          </span>
        </button>
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
            <span className="muted">Café, taxi, santé, météo</span>
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
          Tout reste sur cet appareil. Basculez Кирил / Latin en haut de l’accueil.
        </p>
        <p className="tiny">
          Le bouton ♪ n’a souvent pas de vraie voix kazakhe. On réécrit alors қ ә ң ө ұ ү pour le turc, l’allemand ou
          le français du téléphone (eu, u, ng, r parisien…). C’est une aide, pas un locuteur natif.
        </p>
        {!confirm ? (
          <button type="button" className="btn quiet" style={{ marginTop: 12 }} onClick={() => setConfirm(true)}>
            Réinitialiser la progression
          </button>
        ) : (
          <div className="row-actions">
            <button type="button" className="btn bad" onClick={() => { wipeProgress(); setConfirm(false) }}>
              Effacer tout
            </button>
            <button type="button" className="btn quiet" onClick={() => setConfirm(false)}>
              Annuler
            </button>
          </div>
        )}
      </div>
    </Screen>
  )
}
