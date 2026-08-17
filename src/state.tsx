import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  addXp,
  completeLesson,
  defaultProgress,
  loadProgress,
  reviewCard,
  saveProgress,
  type Progress,
} from './lib/progress'
import { preloadVoices } from './lib/speech'
import type { Script } from './data/types'

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

type AppState = {
  progress: Progress
  route: Route
  lessonId: string | null
  grammarId: string | null
  go: (route: Route, extra?: { lessonId?: string; grammarId?: string }) => void
  setScript: (script: Script) => void
  awardXp: (n: number) => void
  finishLesson: (id: string) => void
  gradeCard: (wordId: string, ok: boolean) => void
  setQuizBest: (score: number) => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(() => {
    if (typeof window === 'undefined') return defaultProgress()
    return loadProgress()
  })
  const [route, setRoute] = useState<Route>('home')
  const [lessonId, setLessonId] = useState<string | null>(null)
  const [grammarId, setGrammarId] = useState<string | null>(null)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  useEffect(() => {
    preloadVoices()
  }, [])

  const value = useMemo<AppState>(
    () => ({
      progress,
      route,
      lessonId,
      grammarId,
      go: (next, extra) => {
        setRoute(next)
        if (extra?.lessonId !== undefined) setLessonId(extra.lessonId)
        if (extra?.grammarId !== undefined) setGrammarId(extra.grammarId)
        window.scrollTo(0, 0)
      },
      setScript: (script) => setProgress((p) => ({ ...p, script })),
      awardXp: (n) => setProgress((p) => addXp(p, n)),
      finishLesson: (id) => setProgress((p) => completeLesson(p, id)),
      gradeCard: (wordId, ok) => setProgress((p) => reviewCard(p, wordId, ok)),
      setQuizBest: (score) =>
        setProgress((p) => ({ ...p, quizBest: Math.max(p.quizBest, score) })),
    }),
    [progress, route, lessonId, grammarId],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): AppState {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp outside provider')
  return ctx
}
