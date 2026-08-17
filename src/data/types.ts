export type Script = 'cyr' | 'lat'

export type Word = {
  id: string
  cyr: string
  lat: string
  fr: string
  ipa: string
  category: string
  note?: string
}

export type Phrase = {
  id: string
  cyr: string
  lat: string
  fr: string
  situation: string
  note?: string
}

export type AlphabetLetter = {
  cyr: string
  lat: string
  name: string
  ipa: string
  hint: string
  exampleCyr: string
  exampleLat: string
  exampleFr: string
  core: boolean
}

export type GrammarLesson = {
  id: string
  title: string
  summary: string
  body: string[]
  examples: { cyr: string; lat: string; fr: string }[]
}

export type CourseLesson = {
  id: string
  title: string
  subtitle: string
  emoji: string
  kind: 'alphabet' | 'words'
  wordIds: string[]
  tip: string
  culture?: string
}
