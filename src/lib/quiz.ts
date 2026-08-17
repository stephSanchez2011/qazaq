import type { Word } from '../data/types'

export type ChoiceQuestion = {
  kind: 'choice'
  prompt: string
  promptLang: 'fr' | 'kk'
  answer: string
  options: string[]
  word: Word
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = copy[i]!
    copy[i] = copy[j]!
    copy[j] = tmp
  }
  return copy
}

function uniqueOptions(correct: string, pool: string[], count: number): string[] {
  const others = shuffle(pool.filter((x) => x !== correct)).slice(0, count - 1)
  return shuffle([correct, ...others])
}

export function buildQuiz(
  target: Word[],
  bank: Word[],
  script: 'cyr' | 'lat',
  size = 8,
): ChoiceQuestion[] {
  const pick = shuffle(target).slice(0, Math.min(size, target.length))
  const frPool = bank.map((w) => w.fr)
  const kkPool = bank.map((w) => (script === 'cyr' ? w.cyr : w.lat))

  return pick.map((word, i) => {
    const kk = script === 'cyr' ? word.cyr : word.lat
    const toFr = i % 2 === 0
    if (toFr) {
      return {
        kind: 'choice',
        prompt: kk,
        promptLang: 'kk',
        answer: word.fr,
        options: uniqueOptions(word.fr, frPool, 4),
        word,
      }
    }
    return {
      kind: 'choice',
      prompt: word.fr,
      promptLang: 'fr',
      answer: kk,
      options: uniqueOptions(kk, kkPool, 4),
      word,
    }
  })
}
