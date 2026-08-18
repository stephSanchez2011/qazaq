import { lessonById } from '../data/lessons'
import type { LearnTrack, Script } from '../data/types'

const KEY = 'qazaq-progress-v1'

export type CardBox = 1 | 2 | 3 | 4 | 5

export type CardState = {
  box: CardBox
  due: number
  seen: number
  correct: number
}

export type Progress = {
  streak: number
  lastPractice: string | null
  xp: number
  completedLessons: string[]
  cards: Record<string, CardState>
  script: Script
  learn: LearnTrack
  quizBest: number
  alphaQuizBest: number
  completedDialogues: string[]
  dailyXp: number
  dailyStamp: string | null
  dailyGoal: number
}

const BOX_DAYS: Record<CardBox, number> = {
  1: 0,
  2: 1,
  3: 3,
  4: 7,
  5: 14,
}

export function todayStamp(): string {
  return new Date().toISOString().slice(0, 10)
}

export function defaultProgress(): Progress {
  return {
    streak: 0,
    lastPractice: null,
    xp: 0,
    completedLessons: [],
    cards: {},
    script: 'cyr',
    learn: 'kk',
    quizBest: 0,
    alphaQuizBest: 0,
    completedDialogues: [],
    dailyXp: 0,
    dailyStamp: null,
    dailyGoal: 40,
  }
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultProgress()
    const parsed = JSON.parse(raw) as Partial<Progress>
    const learn = parsed.learn === 'fr' ? 'fr' : 'kk'
    return {
      ...defaultProgress(),
      ...parsed,
      learn,
      cards: parsed.cards ?? {},
      completedDialogues: parsed.completedDialogues ?? [],
      alphaQuizBest: parsed.alphaQuizBest ?? 0,
    }
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(p: Progress): void {
  localStorage.setItem(KEY, JSON.stringify(p))
}

export function markPracticed(p: Progress): Progress {
  const today = todayStamp()
  if (p.lastPractice === today) return p
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yStamp = yesterday.toISOString().slice(0, 10)
  const streak = p.lastPractice === yStamp ? p.streak + 1 : 1
  return { ...p, lastPractice: today, streak }
}

export function addXp(p: Progress, amount: number): Progress {
  const today = todayStamp()
  const dailyXp = p.dailyStamp === today ? p.dailyXp + amount : amount
  return markPracticed({ ...p, xp: p.xp + amount, dailyXp, dailyStamp: today })
}

export function resetProgress(script: Script, learn: LearnTrack = 'kk'): Progress {
  return { ...defaultProgress(), script, learn }
}

export function wordOfDayIndex(length: number): number {
  const stamp = todayStamp()
  let hash = 0
  for (const ch of stamp) hash = (hash * 33 + ch.charCodeAt(0)) >>> 0
  return length === 0 ? 0 : hash % length
}

function seedLessonCards(p: Progress, lessonId: string): Progress {
  const lesson = lessonById[lessonId]
  if (!lesson || lesson.kind !== 'words' || lesson.wordIds.length === 0) return p
  const cards = { ...p.cards }
  for (const wordId of lesson.wordIds) {
    if (!cards[wordId]) {
      cards[wordId] = { box: 1, due: 0, seen: 0, correct: 0 }
    }
  }
  return { ...p, cards }
}

export function completeLesson(p: Progress, id: string): Progress {
  const seeded = seedLessonCards(p, id)
  if (seeded.completedLessons.includes(id)) return addXp(seeded, 5)
  return addXp(
    { ...seeded, completedLessons: [...seeded.completedLessons, id] },
    25,
  )
}

export function completeDialogue(p: Progress, id: string): Progress {
  if (p.completedDialogues.includes(id)) return addXp(p, 5)
  return addXp(
    { ...p, completedDialogues: [...p.completedDialogues, id] },
    12,
  )
}

function bumpBox(box: CardBox, ok: boolean): CardBox {
  if (!ok) return 1
  return (Math.min(5, box + 1) as CardBox)
}

export function reviewCard(p: Progress, wordId: string, ok: boolean): Progress {
  const prev = p.cards[wordId] ?? { box: 1 as CardBox, due: 0, seen: 0, correct: 0 }
  const box = bumpBox(prev.box, ok)
  const due = Date.now() + BOX_DAYS[box] * 86_400_000
  const cards = {
    ...p.cards,
    [wordId]: {
      box,
      due,
      seen: prev.seen + 1,
      correct: prev.correct + (ok ? 1 : 0),
    },
  }
  return addXp({ ...p, cards }, ok ? 8 : 2)
}

export function dueCardIds(p: Progress, allIds: string[]): string[] {
  const now = Date.now()
  const due = allIds.filter((id) => {
    const c = p.cards[id]
    if (!c) return true
    return c.due <= now
  })
  return due.sort((a, b) => {
    const ca = p.cards[a]
    const cb = p.cards[b]
    if (!ca && cb) return -1
    if (ca && !cb) return 1
    return (ca?.due ?? 0) - (cb?.due ?? 0)
  })
}

export function knownCount(p: Progress): number {
  return Object.values(p.cards).filter((c) => c.box >= 3).length
}
