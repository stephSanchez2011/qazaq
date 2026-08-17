export type VoiceProfile = 'kk' | 'tr' | 'de' | 'fr' | 'ru' | 'en'

const LETTER_HINT_FR: Record<string, string> = {
  ә: 'a de chat',
  қ: 'k profond, comme Qatar',
  ң: 'ng de parking',
  ө: 'eu de peu',
  ұ: 'ou court',
  ү: 'u de lune',
  ғ: 'r parisien',
  ы: 'i sans sourire',
  і: 'i court',
  һ: 'h aspiré',
}

function lowerCyr(text: string): string {
  return text.replace(/І/g, 'і').replace(/I/g, 'i').toLowerCase()
}

/** Cyrillic Kazakh → Russian-friendly Cyrillic (unknown letters otherwise get skipped). */
export function toRussianFriendly(text: string): string {
  return lowerCyr(text)
    .replace(/ң/g, 'нг')
    .replace(/ә/g, 'а')
    .replace(/ғ/g, 'гх')
    .replace(/қ/g, 'къ')
    .replace(/ө/g, 'оэ')
    .replace(/ү/g, 'у')
    .replace(/ұ/g, 'у')
    .replace(/і/g, 'и')
    .replace(/һ/g, 'х')
    .replace(/ў/g, 'у')
}

type LatinMap = Record<string, string>

const LATIN_BASE: LatinMap = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'j',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ъ: '',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
  і: 'i',
  һ: 'h',
  ә: 'a',
  ғ: 'gh',
  қ: 'q',
  ң: 'ng',
  ө: 'o',
  ұ: 'u',
  ү: 'u',
  ы: 'y',
}

const PROFILE_SPECIAL: Record<Exclude<VoiceProfile, 'kk' | 'ru'>, LatinMap> = {
  tr: {
    ә: 'a',
    ғ: 'ğ',
    қ: 'k',
    ң: 'ng',
    ө: 'ö',
    ұ: 'u',
    ү: 'ü',
    ы: 'ı',
    ш: 'ş',
    ч: 'ç',
    ж: 'j',
    х: 'h',
    у: 'u',
  },
  de: {
    ә: 'a',
    ғ: 'r',
    қ: 'k',
    ң: 'ng',
    ө: 'ö',
    ұ: 'u',
    ү: 'ü',
    ы: 'i',
    ш: 'sch',
    х: 'ch',
    ч: 'tsch',
    у: 'u',
  },
  fr: {
    ә: 'a',
    ғ: 'r',
    қ: 'k',
    ң: 'ng',
    ө: 'eu',
    ұ: 'ou',
    ү: 'u',
    ы: 'e',
    ш: 'ch',
    ж: 'j',
    у: 'ou',
    х: 'kh',
    ч: 'tch',
    ю: 'iou',
    я: 'ia',
  },
  en: {
    ә: 'a',
    ғ: 'gh',
    қ: 'q',
    ң: 'ng',
    ө: 'oe',
    ұ: 'u',
    ү: 'ue',
    ы: 'uh',
    ш: 'sh',
    у: 'oo',
    х: 'kh',
  },
}

const LATIN_INPUT: Record<string, string> = {
  ä: 'ә',
  ğ: 'ғ',
  q: 'қ',
  ñ: 'ң',
  ö: 'ө',
  ū: 'ұ',
  ü: 'ү',
  ı: 'і',
  ş: 'ш',
}

function toCyrillicish(text: string): string {
  let out = lowerCyr(text.normalize('NFC'))
  for (const [from, to] of Object.entries(LATIN_INPUT)) {
    out = out.replaceAll(from, to)
  }
  return out
}

const FR_SAY: Record<string, string> = {
  сәлем: 'saliem',
  'сәлеметсіз бе': 'saliemet siz be',
  сәлеметсіз: 'saliemet siz',
}

function lookupFr(text: string): string | undefined {
  const key = lowerCyr(text)
    .replace(/[!?.,;:…]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return FR_SAY[key]
}

const KK_VOWELS = 'аәеёийоөуұүыіэюя'

function frenchYe(prev: string | undefined): string {
  if (!prev || prev === ' ' || KK_VOWELS.includes(prev)) return 'ie'
  if ('л'.includes(prev)) return 'ie'
  return 'e'
}

function toLatinPhonetic(text: string, profile: Exclude<VoiceProfile, 'kk' | 'ru'>): string {
  if (profile === 'fr') {
    const exact = lookupFr(text)
    if (exact) return exact
  }
  const special = PROFILE_SPECIAL[profile]
  const map = { ...LATIN_BASE, ...special }
  const source = toCyrillicish(text)
  let out = ''
  let prev: string | undefined
  for (const ch of source) {
    if (ch === ' ' || ch === '-' || ch === '\'' || ch === '’') {
      out += ' '
      prev = ' '
      continue
    }
    if (profile === 'fr' && ch === 'е') {
      out += frenchYe(prev)
      prev = ch
      continue
    }
    out += map[ch] ?? ch
    prev = ch
  }
  return out.replace(/\s+/g, ' ').trim()
}

export function toTtsText(text: string, profile: VoiceProfile): string {
  const trimmed = text.trim()
  if (!trimmed) return ''
  if (profile === 'kk') return trimmed
  if (profile === 'ru') return toRussianFriendly(trimmed)
  return toLatinPhonetic(trimmed, profile)
}

function profileOf(lang: string): VoiceProfile {
  const l = lang.toLowerCase()
  if (l.startsWith('kk')) return 'kk'
  if (l.startsWith('tr')) return 'tr'
  if (l.startsWith('az')) return 'tr'
  if (l.startsWith('de')) return 'de'
  if (l.startsWith('fr')) return 'fr'
  if (l.startsWith('ru')) return 'ru'
  if (l.startsWith('en')) return 'en'
  return 'fr'
}

function scoreVoice(voice: SpeechSynthesisVoice): number {
  const lang = voice.lang.toLowerCase()
  const name = voice.name.toLowerCase()
  let score = 0
  if (lang.startsWith('kk') || name.includes('kazakh')) score = 100
  else if (lang.startsWith('fr')) score = 90
  else if (lang.startsWith('tr') || name.includes('turk')) score = 88
  else if (lang.startsWith('az')) score = 78
  else if (lang.startsWith('de')) score = 72
  else if (lang.startsWith('ru')) score = 52
  else if (lang.startsWith('en')) score = 28
  if (voice.localService) score += 3
  return score
}

export function chooseVoice(voices: SpeechSynthesisVoice[]): {
  voice: SpeechSynthesisVoice | null
  profile: VoiceProfile
} {
  if (voices.length === 0) return { voice: null, profile: 'fr' }
  const ranked = [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a))
  const best = ranked[0]
  if (!best || scoreVoice(best) === 0) return { voice: null, profile: 'fr' }
  return { voice: best, profile: profileOf(best.lang) }
}

function makeUtterance(
  text: string,
  voice: SpeechSynthesisVoice | null,
  lang: string,
  rate: number,
): SpeechSynthesisUtterance {
  const utter = new SpeechSynthesisUtterance(text)
  if (voice) utter.voice = voice
  utter.lang = lang
  utter.rate = rate
  utter.pitch = 1
  return utter
}

export function speakKazakh(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const synth = window.speechSynthesis
  synth.cancel()
  const raw = text.trim()
  if (!raw) return

  const voices = synth.getVoices()
  const { voice, profile } = chooseVoice(voices)
  const spoken = toTtsText(raw, profile)
  const lang = voice?.lang ?? (profile === 'fr' ? 'fr-FR' : 'tr-TR')
  const rate = profile === 'kk' ? 0.86 : 0.76

  const letter = lowerCyr(raw)
  const hint = letter.length === 1 ? LETTER_HINT_FR[letter] : undefined
  const frVoice = voices.find((v) => v.lang.toLowerCase().startsWith('fr')) ?? null

  const queue: SpeechSynthesisUtterance[] = []
  if (hint && frVoice) {
    queue.push(makeUtterance(hint, frVoice, frVoice.lang, 0.95))
  }
  queue.push(makeUtterance(spoken || raw, voice, lang, rate))

  let i = 0
  const play = () => {
    if (i >= queue.length) return
    const u = queue[i]
    i += 1
    u.onend = play
    synth.speak(u)
  }
  play()
}

export function preloadVoices(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.getVoices()
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    window.speechSynthesis.getVoices()
  })
}
