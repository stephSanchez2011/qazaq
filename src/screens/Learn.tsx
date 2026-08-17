import { lessons } from '../data/lessons'
import { useApp } from '../state'
import { Screen } from '../ui'

export function Learn() {
  const { progress, go } = useApp()

  return (
    <Screen>
      <div className="topbar">
        <h2>Parcours</h2>
      </div>
      <p className="muted" style={{ marginTop: 0 }}>
        Onze leçons, du premier сәлем jusqu’au taxi. Chaque leçon débloque la suivante.
      </p>
      <div className="stack">
        {lessons.map((lesson, i) => {
          const done = progress.completedLessons.includes(lesson.id)
          const locked = i > 0 && !progress.completedLessons.includes(lessons[i - 1]!.id)
          return (
            <button
              key={lesson.id}
              type="button"
              className={`lesson-row ${locked ? 'locked' : ''}`}
              disabled={locked}
              onClick={() => go('lesson', { lessonId: lesson.id })}
            >
              <span className={`badge ${done ? 'done' : ''}`}>{done ? '✓' : lesson.emoji}</span>
              <span className="grow">
                <b>
                  {i + 1}. {lesson.title}
                </b>
                <span className="muted">{locked ? 'Terminez la leçon précédente' : lesson.subtitle}</span>
              </span>
            </button>
          )
        })}
      </div>
    </Screen>
  )
}
