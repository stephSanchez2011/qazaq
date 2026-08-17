export function speakKazakh(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const synth = window.speechSynthesis
  synth.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  const voices = synth.getVoices()
  const preferred =
    voices.find((v) => v.lang.toLowerCase().startsWith('kk')) ??
    voices.find((v) => v.lang.toLowerCase().startsWith('ru')) ??
    voices.find((v) => v.lang.toLowerCase().startsWith('tr'))
  if (preferred) utter.voice = preferred
  utter.lang = preferred?.lang ?? 'kk-KZ'
  utter.rate = 0.88
  synth.speak(utter)
}

export function preloadVoices(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.getVoices()
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    window.speechSynthesis.getVoices()
  })
}
