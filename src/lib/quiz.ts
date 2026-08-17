import type { AlphabetLetter, LearnTrack, Script, Word } from '../data/types'

export type ChoiceQuestion = {
  kind: 'choice'
  prompt: string
  promptLang: 'fr' | 'kk'
  answer: string
  options: string[]
  word: Word
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = copy[i]!
    copy[i] = copy[j]!
    copy[j] = tmp
  }
  return copy
}

export function uniqueOptions(correct: string, pool: string[], count: number): string[] {
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

export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:«»"'`´]/g, '')
    .replace(/\s+/g, ' ')
}

export function isKazakhMatch(input: string, word: Word): boolean {
  const got = normalizeAnswer(input)
  if (!got) return false
  return got === normalizeAnswer(word.cyr) || got === normalizeAnswer(word.lat)
}

export function isFrenchMatch(input: string, word: Word): boolean {
  const got = normalizeAnswer(input)
  if (!got) return false
  const want = normalizeAnswer(word.fr)
  const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '')
  return got === want || fold(got) === fold(want)
}

export type MatchRound = {
  left: Word[]
  right: Word[]
}

export function buildMatchRound(bank: Word[], size = 4): MatchRound {
  const pick = shuffle(bank).slice(0, Math.min(size, bank.length))
  return { left: shuffle(pick), right: shuffle(pick) }
}

export type AlphaQuizKind = 'word' | 'letter' | 'sound' | 'listen' | 'script'

export type AlphaQuestion = {
  kind: AlphaQuizKind
  prompt: string
  answer: string
  options: string[]
  speak: string
  speakLang: 'fr' | 'kk'
  layout: 'list' | 'grid'
}

function letterGlyph(letter: AlphabetLetter, learnFr: boolean, script: Script): string {
  if (learnFr) return letter.lat
  return script === 'cyr' ? letter.cyr : letter.lat || letter.cyr
}

function exampleWord(letter: AlphabetLetter, learnFr: boolean, script: Script): string {
  if (learnFr) return letter.exampleFr
  return script === 'cyr' ? letter.exampleCyr : letter.exampleLat
}

function ipaLabel(ipa: string): string {
  return `/${ipa}/`
}

function makeQuestion(
  kind: AlphaQuizKind,
  letter: AlphabetLetter,
  pool: AlphabetLetter[],
  learnFr: boolean,
  script: Script,
): AlphaQuestion | null {
  const glyph = letterGlyph(letter, learnFr, script)
  const word = exampleWord(letter, learnFr, script)
  const speak = learnFr ? letter.exampleFr : letter.exampleCyr
  const speakLang: 'fr' | 'kk' = learnFr ? 'fr' : 'kk'

  if (kind === 'word') {
    return {
      kind,
      prompt: glyph,
      answer: word,
      options: uniqueOptions(
        word,
        pool.map((l) => exampleWord(l, learnFr, script)),
        4,
      ),
      speak,
      speakLang,
      layout: 'list',
    }
  }

  if (kind === 'letter' || kind === 'listen') {
    return {
      kind,
      prompt: kind === 'letter' ? word : '',
      answer: glyph,
      options: uniqueOptions(
        glyph,
        pool.map((l) => letterGlyph(l, learnFr, script)),
        4,
      ),
      speak,
      speakLang,
      layout: 'grid',
    }
  }

  if (kind === 'sound') {
    if (!letter.ipa) return null
    return {
      kind,
      prompt: glyph,
      answer: ipaLabel(letter.ipa),
      options: uniqueOptions(
        ipaLabel(letter.ipa),
        pool.filter((l) => l.ipa).map((l) => ipaLabel(l.ipa)),
        4,
      ),
      speak,
      speakLang,
      layout: 'grid',
    }
  }

  const other = script === 'cyr' ? letter.lat : letter.cyr
  if (!other || other === glyph) return null
  const otherPool = pool
    .map((l) => (script === 'cyr' ? l.lat : l.cyr))
    .filter((x) => x && x !== other)
  return {
    kind: 'script',
    prompt: glyph,
    answer: other,
    options: uniqueOptions(other, otherPool, 4),
    speak,
    speakLang,
    layout: 'grid',
  }
}

export function buildAlphabetQuiz(
  letters: AlphabetLetter[],
  learn: LearnTrack,
  script: Script,
  size = 10,
): AlphaQuestion[] {
  const learnFr = learn === 'fr'
  const pool = letters.filter((l) => l.core)
  const pick = shuffle(pool).slice(0, Math.min(size, pool.length))
  const modes: AlphaQuizKind[] = learnFr
    ? ['word', 'letter', 'listen', 'sound']
    : ['word', 'letter', 'listen', 'sound', 'script']
  const fallback: AlphaQuizKind[] = ['word', 'letter', 'listen']
  const out: AlphaQuestion[] = []

  for (let i = 0; i < pick.length; i += 1) {
    const letter = pick[i]!
    const preferred = modes[i % modes.length]!
    const q =
      makeQuestion(preferred, letter, pool, learnFr, script) ??
      fallback.map((k) => makeQuestion(k, letter, pool, learnFr, script)).find(Boolean)
    if (q) out.push(q)
  }

  return out
}
