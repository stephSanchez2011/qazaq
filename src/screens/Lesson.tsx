import { useMemo, useState } from 'react'
import { alphabet } from '../data/alphabet'
import { lessonById } from '../data/lessons'
import { wordsById } from '../data/words'
import { buildQuiz, type ChoiceQuestion } from '../lib/quiz'
import { speakKazakh } from '../lib/speech'
import { useApp } from '../state'
import { Back, Kk, ProgressBar, Screen, Speak } from '../ui'
import type { Word } from '../data/types'

type Phase = 'intro' | 'item' | 'quiz' | 'done'

export function Lesson() {
  const { progress, lessonId, go, finishLesson } = useApp()
  const lesson = lessonId ? lessonById[lessonId] : undefined
  const items: Word[] = useMemo(
    () => (lesson ? lesson.wordIds.map((id) => wordsById[id]).filter((w): w is Word => Boolean(w)) : []),
    [lesson],
  )
  const [phase, setPhase] = useState<Phase>('intro')
  const [index, setIndex] = useState(0)
  const [quiz, setQuiz] = useState<ChoiceQuestion[]>([])
  const [qIndex, setQIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)

  if (!lesson) {
    return (
      <Screen>
        <p>Leçon introuvable.</p>
      </Screen>
    )
  }

  const currentLesson = lesson
  const coreLetters = alphabet.filter((l) => l.core)
  const currentLetter = coreLetters[index]
  const currentWord = items[index]
  const question = quiz[qIndex]
  const totalItems = currentLesson.kind === 'alphabet' ? coreLetters.length : items.length

  function startItems() {
    setIndex(0)
    setPhase('item')
  }

  function nextItem() {
    if (index + 1 >= totalItems) {
      const bank = currentLesson.kind === 'alphabet' ? [] : items
      if (currentLesson.kind === 'alphabet') {
        finishLesson(currentLesson.id)
        setPhase('done')
        return
      }
      setQuiz(buildQuiz(bank, bank, progress.script, Math.min(8, bank.length)))
      setQIndex(0)
      setScore(0)
      setPicked(null)
      setPhase('quiz')
      return
    }
    setIndex((n) => n + 1)
  }

  function answer(option: string) {
    if (picked || !question) return
    setPicked(option)
    if (option === question.answer) setScore((s) => s + 1)
  }

  function nextQuestion() {
    if (qIndex + 1 >= quiz.length) {
      finishLesson(currentLesson.id)
      setPhase('done')
      return
    }
    setPicked(null)
    setQIndex((n) => n + 1)
  }

  return (
    <Screen>
      <div className="topbar">
        <Back onClick={() => go('learn')} />
        <h2>{lesson.title}</h2>
      </div>

      {phase === 'intro' && (
        <div className="card">
          <div className="badge">{lesson.emoji}</div>
          <h3 style={{ marginBottom: 6 }}>{lesson.subtitle}</h3>
          <p className="muted">{lesson.tip}</p>
          {lesson.culture && <p className="note">{lesson.culture}</p>}
          <div className="row-actions">
            <button type="button" className="btn primary" onClick={startItems}>
              Commencer
            </button>
          </div>
        </div>
      )}

      {phase === 'item' && lesson.kind === 'alphabet' && currentLetter && (
        <div className="card word-card">
          <span className="pill">
            {index + 1} / {totalItems}
          </span>
          <div className="big-letter">{progress.script === 'cyr' ? currentLetter.cyr : currentLetter.lat}</div>
          <p className="ipa">/{currentLetter.ipa || '—'}/</p>
          <p>{currentLetter.hint}</p>
          <p className="muted">
            <span className="kk">
              {progress.script === 'cyr' ? currentLetter.exampleCyr : currentLetter.exampleLat}
            </span>
            {' — '}
            {currentLetter.exampleFr}
          </p>
          <Speak text={currentLetter.exampleCyr} />
          <ProgressBar value={((index + 1) / totalItems) * 100} />
          <div className="row-actions">
            <button type="button" className="btn primary" onClick={nextItem}>
              {index + 1 >= totalItems ? 'Terminer' : 'Lettre suivante'}
            </button>
          </div>
        </div>
      )}

      {phase === 'item' && lesson.kind === 'words' && currentWord && (
        <div className="card word-card">
          <span className="pill">
            {index + 1} / {totalItems}
          </span>
          <Kk cyr={currentWord.cyr} lat={currentWord.lat} />
          <p className="ipa">/{currentWord.ipa}/</p>
          <p className="fr">{currentWord.fr}</p>
          {currentWord.note && <p className="note">{currentWord.note}</p>}
          <div style={{ marginTop: 12 }}>
            <Speak text={currentWord.cyr} />
          </div>
          <ProgressBar value={((index + 1) / totalItems) * 100} />
          <div className="row-actions">
            <button type="button" className="btn primary" onClick={nextItem}>
              {index + 1 >= totalItems ? 'Quiz de la leçon' : 'Mot suivant'}
            </button>
          </div>
        </div>
      )}

      {phase === 'quiz' && question && (
        <div className="card">
          <span className="pill">
            Quiz {qIndex + 1}/{quiz.length}
          </span>
          <p className="prompt">{question.promptLang === 'kk' ? 'Que signifie' : 'Comment dit-on'}</p>
          <p className={`hello kk`} style={{ color: 'var(--ink)', fontSize: 28, margin: '8px 0 16px' }}>
            {question.prompt}
          </p>
          {question.promptLang === 'kk' && (
            <button
              type="button"
              className="speak ghost"
              onClick={() => speakKazakh(question.word.cyr)}
              aria-label="Écouter"
            >
              ♪
            </button>
          )}
          <div style={{ marginTop: 12 }}>
            {question.options.map((opt) => {
              let cls = 'choice'
              if (picked) {
                if (opt === question.answer) cls += ' right'
                else if (opt === picked) cls += ' wrong'
              }
              return (
                <button key={opt} type="button" className={cls} onClick={() => answer(opt)}>
                  {opt}
                </button>
              )
            })}
          </div>
          {picked && (
            <div className="row-actions">
              <button type="button" className="btn primary" onClick={nextQuestion}>
                {qIndex + 1 >= quiz.length ? 'Voir le score' : 'Continuer'}
              </button>
            </div>
          )}
        </div>
      )}

      {phase === 'done' && (
        <div className="card center">
          <div className="big-letter">🎉</div>
          <h3>Жарайсың! Bravo</h3>
          <p className="muted">
            {lesson.kind === 'words'
              ? `Quiz : ${score}/${quiz.length} · leçon enregistrée`
              : 'Alphabet parcouru. Revenez-y dès qu’une lettre résiste.'}
          </p>
          <p className="kk">Келесі сабаққа!</p>
          <div className="row-actions">
            <button type="button" className="btn primary" onClick={() => go('learn')}>
              Retour au parcours
            </button>
          </div>
        </div>
      )}
    </Screen>
  )
}
