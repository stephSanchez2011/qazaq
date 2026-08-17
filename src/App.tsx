import { AppProvider, useApp, type Route } from './state'
import { Home } from './screens/Home'
import { Learn } from './screens/Learn'
import { Lesson } from './screens/Lesson'
import { Alphabet } from './screens/Alphabet'
import { Cards } from './screens/Cards'
import { Quiz } from './screens/Quiz'
import { Phrases } from './screens/Phrases'
import { Grammar } from './screens/Grammar'
import { More } from './screens/More'

const NAV: { id: Route; label: string; ico: string }[] = [
  { id: 'home', label: 'Accueil', ico: '🏔' },
  { id: 'learn', label: 'Cours', ico: '📖' },
  { id: 'cards', label: 'Cartes', ico: '🃏' },
  { id: 'quiz', label: 'Quiz', ico: '?' },
  { id: 'more', label: 'Plus', ico: '✦' },
]

function Shell() {
  const { route, go, lessonId } = useApp()
  const tab = route === 'lesson' ? 'learn' : route === 'alphabet' || route === 'phrases' || route === 'grammar' ? 'more' : route

  return (
    <div className="stage">
      {route === 'home' && <Home />}
      {route === 'learn' && <Learn />}
      {route === 'lesson' && <Lesson key={lessonId ?? 'none'} />}
      {route === 'alphabet' && <Alphabet />}
      {route === 'cards' && <Cards />}
      {route === 'quiz' && <Quiz />}
      {route === 'phrases' && <Phrases />}
      {route === 'grammar' && <Grammar />}
      {route === 'more' && <More />}
      <nav className="nav">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? 'on' : ''}
            onClick={() => go(item.id)}
          >
            <span className="ico">{item.ico}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
