import { Link, useParams } from 'react-router-dom'
import { getStoriesByLevel } from '../data'

export default function StoryList() {
  const { level } = useParams()
  const stories = getStoriesByLevel(level)

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-brand uppercase">{level}</h1>
        <Link to="/level" className="text-sm font-semibold text-brand">
          Select Level
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-100 p-6 sm:grid-cols-3 md:grid-cols-5">
        {stories.map((s) => (
          <Link key={s.slug} to={`/story/${s.slug}`} className="group">
            <img
              src={s.cover}
              alt={s.title.id}
              className="aspect-[4/3] w-full rounded bg-pink-100 object-cover transition group-hover:scale-105"
            />
            <p className="mt-2 text-center text-sm font-semibold text-brand">
              {s.title.id}
            </p>
          </Link>
        ))}
        {stories.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            Belum ada cerita untuk level ini.
          </p>
        )}
      </div>
    </div>
  )
}
