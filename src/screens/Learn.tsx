import { lessons } from '../data/lessons'
import { lessonSubtitle, lessonTitle } from '../lib/i18n'
import { useApp } from '../state'
import { Screen } from '../ui'

export function Learn() {
  const { progress, go, tr } = useApp()

  return (
    <Screen>
      <div className="topbar">
        <h2>{tr('learn.title')}</h2>
      </div>
      <p className="muted" style={{ marginTop: 0 }}>
        {tr(progress.learn === 'fr' ? 'learn.intro.fr' : 'learn.intro.kk', { n: lessons.length })}
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
                  {i + 1}. {lessonTitle(progress.learn, lesson.id) ?? lesson.title}
                </b>
                <span className="muted">
                  {locked ? tr('learn.locked') : (lessonSubtitle(progress.learn, lesson.id) ?? lesson.subtitle)}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </Screen>
  )
}
