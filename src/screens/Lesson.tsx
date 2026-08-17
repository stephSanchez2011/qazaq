import { useMemo, useState } from 'react'
import { alphabet } from '../data/alphabet'
import { frenchAlphabet } from '../data/frenchAlphabet'
import { lessonById } from '../data/lessons'
import { wordsById } from '../data/words'
import { lessonSubtitle, lessonTitle } from '../lib/i18n'
import { buildQuiz, type ChoiceQuestion } from '../lib/quiz'
import { speakFrench, speakKazakh } from '../lib/speech'
import { useApp } from '../state'
import { Back, Kk, ProgressBar, Screen, Speak } from '../ui'
import { AlphabetQuizPlay } from './AlphabetQuiz'
import type { Word } from '../data/types'

type Phase = 'intro' | 'item' | 'quiz' | 'done'

export function Lesson() {
  const { progress, lessonId, go, finishLesson, tr } = useApp()
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
  const [alphaTotal, setAlphaTotal] = useState(0)

  if (!lesson) {
    return (
      <Screen>
        <p>{tr('lesson.missing')}</p>
      </Screen>
    )
  }

  const currentLesson = lesson
  const learnFr = progress.learn === 'fr'
  const letters = learnFr ? frenchAlphabet.filter((l) => l.core) : alphabet.filter((l) => l.core)
  const currentLetter = letters[index]
  const currentWord = items[index]
  const question = quiz[qIndex]
  const totalItems = currentLesson.kind === 'alphabet' ? letters.length : items.length
  const title = lessonTitle(progress.learn, currentLesson.id) ?? currentLesson.title

  function startItems() {
    setIndex(0)
    setPhase('item')
  }

  function nextItem() {
    if (index + 1 >= totalItems) {
      const bank = currentLesson.kind === 'alphabet' ? [] : items
      if (currentLesson.kind === 'alphabet') {
        setScore(0)
        setPicked(null)
        setPhase('quiz')
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
        <h2>{title}</h2>
      </div>

      {phase === 'intro' && (
        <div className="card">
          <div className="badge">{lesson.emoji}</div>
          <h3 style={{ marginBottom: 6 }}>{lessonSubtitle(progress.learn, lesson.id) ?? lesson.subtitle}</h3>
          <p className="muted">
            {lesson.id === 'l1' && learnFr ? tr('l1.tip.fr') : lesson.id === 'l1' ? tr('l1.tip.kk') : lesson.tip}
          </p>
          {lesson.culture && progress.learn === 'kk' && <p className="note">{lesson.culture}</p>}
          <div className="row-actions">
            <button type="button" className="btn primary" onClick={startItems}>
              {tr('lesson.start')}
            </button>
          </div>
        </div>
      )}

      {phase === 'item' && lesson.kind === 'alphabet' && currentLetter && (
        <div className="card word-card">
          <span className="pill">
            {index + 1} / {totalItems}
          </span>
          <div className="big-letter">
            {learnFr ? currentLetter.lat : progress.script === 'cyr' ? currentLetter.cyr : currentLetter.lat}
          </div>
          <p className="ipa">/{currentLetter.ipa || '—'}/</p>
          <p>{currentLetter.hint}</p>
          {learnFr ? (
            <>
              <p className="target">{currentLetter.exampleFr}</p>
              <p className="gloss">
                {progress.script === 'cyr' ? currentLetter.exampleCyr : currentLetter.exampleLat}
              </p>
            </>
          ) : (
            <p className="muted">
              <span className="kk">
                {progress.script === 'cyr' ? currentLetter.exampleCyr : currentLetter.exampleLat}
              </span>
              {' — '}
              {currentLetter.exampleFr}
            </p>
          )}
          <Speak
            text={learnFr ? currentLetter.exampleFr : currentLetter.cyr}
            lang={learnFr ? 'fr' : 'kk'}
          />
          <ProgressBar value={((index + 1) / totalItems) * 100} />
          <div className="row-actions">
            <button type="button" className="btn primary" onClick={nextItem}>
              {index + 1 >= totalItems ? tr('lesson.quiz') : tr('lesson.nextLetter')}
            </button>
          </div>
        </div>
      )}

      {phase === 'item' && lesson.kind === 'words' && currentWord && (
        <div className="card word-card">
          <span className="pill">
            {index + 1} / {totalItems}
          </span>
          {learnFr ? (
            <>
              <p className="hello" style={{ color: 'var(--ink)' }}>
                {currentWord.fr}
              </p>
              <p className="fr">
                <Kk cyr={currentWord.cyr} lat={currentWord.lat} />
              </p>
            </>
          ) : (
            <>
              <Kk cyr={currentWord.cyr} lat={currentWord.lat} />
              <p className="ipa">/{currentWord.ipa}/</p>
              <p className="fr">{currentWord.fr}</p>
            </>
          )}
          {currentWord.note && progress.learn === 'kk' && <p className="note">{currentWord.note}</p>}
          <div style={{ marginTop: 12 }}>
            <Speak text={learnFr ? currentWord.fr : currentWord.cyr} />
          </div>
          <ProgressBar value={((index + 1) / totalItems) * 100} />
          <div className="row-actions">
            <button type="button" className="btn primary" onClick={nextItem}>
              {index + 1 >= totalItems ? tr('lesson.quiz') : tr('lesson.nextWord')}
            </button>
          </div>
        </div>
      )}

      {phase === 'quiz' && lesson.kind === 'alphabet' && (
        <AlphabetQuizPlay
          embed
          onExit={() => go('learn')}
          onFinished={(s, total) => {
            setScore(s)
            setAlphaTotal(total)
            finishLesson(currentLesson.id)
            setPhase('done')
          }}
        />
      )}

      {phase === 'quiz' && lesson.kind === 'words' && question && (
        <div className="card">
          <span className="pill">
            Quiz {qIndex + 1}/{quiz.length}
          </span>
          <p className="prompt">{question.promptLang === 'kk' ? tr('quiz.mean') : tr('quiz.say')}</p>
          <p className={`hello kk`} style={{ color: 'var(--ink)', fontSize: 28, margin: '8px 0 16px' }}>
            {question.prompt}
          </p>
          {question.promptLang === 'kk' && (
            <button
              type="button"
              className="speak ghost"
              onClick={() => speakKazakh(question.word.cyr)}
              aria-label={tr('listen')}
            >
              ♪
            </button>
          )}
          {question.promptLang === 'fr' && (
            <button
              type="button"
              className="speak ghost"
              onClick={() => speakFrench(question.word.fr)}
              aria-label={tr('listen')}
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
                {qIndex + 1 >= quiz.length ? tr('quiz.seeScore') : tr('continue')}
              </button>
            </div>
          )}
        </div>
      )}

      {phase === 'done' && (
        <div className="card center">
          <div className="big-letter">🎉</div>
          <h3>{tr('lesson.done')}</h3>
          <p className="muted">
            {lesson.kind === 'words'
              ? tr('lesson.done.words', { score, total: quiz.length })
              : tr('lesson.done.alpha', { score, total: alphaTotal })}
          </p>
          <p className="kk">{tr('lesson.next')}</p>
          <div className="row-actions">
            <button type="button" className="btn primary" onClick={() => go('learn')}>
              {tr('lesson.back')}
            </button>
          </div>
        </div>
      )}
    </Screen>
  )
}
