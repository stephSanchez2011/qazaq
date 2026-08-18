import type { Route } from '../state'

const ROUTES: Route[] = [
  'home',
  'learn',
  'lesson',
  'alphabet',
  'cards',
  'quiz',
  'phrases',
  'grammar',
  'more',
  'dictionary',
  'practice',
  'dialogues',
]

export type RouteState = {
  route: Route
  lessonId: string | null
  practiceMode: 'alpha' | null
}

export function readHash(): RouteState {
  const raw = window.location.hash.replace(/^#/, '') || 'home'
  const [r, param] = raw.split('/')
  const route = (ROUTES.includes(r as Route) ? r : 'home') as Route
  if (route === 'lesson' && param) return { route, lessonId: param, practiceMode: null }
  if (route === 'practice' && param === 'alpha') return { route, lessonId: null, practiceMode: 'alpha' }
  return { route, lessonId: null, practiceMode: null }
}

export function writeHash(route: Route, lessonId: string | null, practiceMode: 'alpha' | null): void {
  let hash: string = route
  if (route === 'lesson' && lessonId) hash = `${route}/${lessonId}`
  else if (route === 'practice' && practiceMode === 'alpha') hash = `${route}/alpha`
  const next = `#${hash}`
  if (window.location.hash !== next) window.location.hash = hash
}
