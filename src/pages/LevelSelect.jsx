import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { getStoriesByLevel } from '../data'

function LevelRow({ level }) {
  const stories = getStoriesByLevel(level)
  return (
    <div className="mb-10">
      <h2 className="mb-3 text-2xl font-bold text-brand">{level}</h2>
      <Link
        to={`/level/${level.toLowerCase()}`}
        className="flex items-center gap-3 rounded-lg bg-gray-100 p-4 transition hover:bg-gray-200"
      >
        <div className="flex flex-1 gap-3 overflow-hidden">
          {stories.slice(0, 4).map((s) => (
            <img
              key={s.slug}
              src={s.cover}
              alt={s.title.id}
              className="h-24 w-32 rounded bg-pink-100 object-cover"
            />
          ))}
          {stories.length === 0 && (
            <p className="text-gray-500">Coming soon…</p>
          )}
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow">
          <FontAwesomeIcon icon={faArrowRight} />
        </span>
      </Link>
    </div>
  )
}

export default function LevelSelect() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-10 text-center text-3xl font-extrabold text-brand">
        CHOOSE YOUR LEVEL
      </h1>
      <LevelRow level="N5" />
      <LevelRow level="N4" />
    </div>
  )
}
