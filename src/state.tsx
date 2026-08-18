import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { LearnTrack, Script } from './data/types'
import {
  addXp,
  completeDialogue,
  completeLesson,
  defaultProgress,
  loadProgress,
  resetProgress,
  reviewCard,
  saveProgress,
  type Progress,
} from './lib/progress'
import { readHash, writeHash } from './lib/routing'
import { t, type I18nKey } from './lib/i18n'
import { preloadVoices } from './lib/speech'

export type Route =
  | 'home'
  | 'learn'
  | 'lesson'
  | 'alphabet'
  | 'cards'
  | 'quiz'
  | 'phrases'
  | 'grammar'
  | 'more'
  | 'dictionary'
  | 'practice'
  | 'dialogues'

type AppState = {
  progress: Progress
  route: Route
  lessonId: string | null
  grammarId: string | null
  go: (route: Route, extra?: { lessonId?: string; grammarId?: string; practiceMode?: 'alpha' }) => void
  practiceMode: 'alpha' | null
  setScript: (script: Script) => void
  setLearn: (learn: LearnTrack) => void
  awardXp: (n: number) => void
  finishLesson: (id: string) => void
  finishDialogue: (id: string) => void
  gradeCard: (wordId: string, ok: boolean) => void
  setQuizBest: (score: number) => void
  setAlphaQuizBest: (score: number) => void
  wipeProgress: () => void
  tr: (key: I18nKey, vars?: Record<string, string | number>) => string
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(() => {
    if (typeof window === 'undefined') return defaultProgress()
    return loadProgress()
  })
  const initial = typeof window === 'undefined' ? { route: 'home' as Route, lessonId: null, practiceMode: null } : readHash()
  const [route, setRoute] = useState<Route>(initial.route)
  const [lessonId, setLessonId] = useState<string | null>(initial.lessonId)
  const [grammarId, setGrammarId] = useState<string | null>(null)
  const [practiceMode, setPracticeMode] = useState<'alpha' | null>(initial.practiceMode)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  useEffect(() => {
    preloadVoices()
  }, [])

  useEffect(() => {
    document.documentElement.lang = progress.learn === 'fr' ? 'kk' : 'fr'
  }, [progress.learn])

  useEffect(() => {
    writeHash(route, lessonId, practiceMode)
  }, [route, lessonId, practiceMode])

  useEffect(() => {
    const onHash = () => {
      const h = readHash()
      setRoute(h.route)
      setLessonId(h.lessonId)
      setPracticeMode(h.practiceMode)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const value = useMemo<AppState>(
    () => ({
      progress,
      route,
      lessonId,
      grammarId,
      practiceMode,
      go: (next, extra) => {
        setRoute(next)
        if (extra?.lessonId !== undefined) setLessonId(extra.lessonId)
        if (extra?.grammarId !== undefined) setGrammarId(extra.grammarId)
        setPracticeMode(extra?.practiceMode ?? null)
        window.scrollTo(0, 0)
      },
      setScript: (script) => setProgress((p) => ({ ...p, script })),
      setLearn: (learn) => setProgress((p) => ({ ...p, learn })),
      awardXp: (n) => setProgress((p) => addXp(p, n)),
      finishLesson: (id) => setProgress((p) => completeLesson(p, id)),
      finishDialogue: (id) => setProgress((p) => completeDialogue(p, id)),
      gradeCard: (wordId, ok) => setProgress((p) => reviewCard(p, wordId, ok)),
      setQuizBest: (score) =>
        setProgress((p) => ({ ...p, quizBest: Math.max(p.quizBest, score) })),
      setAlphaQuizBest: (score) =>
        setProgress((p) => ({ ...p, alphaQuizBest: Math.max(p.alphaQuizBest, score) })),
      wipeProgress: () => setProgress((p) => resetProgress(p.script, p.learn)),
      tr: (key, vars) => t(progress.learn, key, vars),
    }),
    [progress, route, lessonId, grammarId, practiceMode],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): AppState {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp outside provider')
  return ctx
}
