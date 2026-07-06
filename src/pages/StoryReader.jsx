import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { loadStory } from '../data'
import { useLanguage } from '../i18n/LanguageContext'

export default function StoryReader() {
  const { slug } = useParams()
  const { lang, t } = useLanguage()
  const [story, setStory] = useState(null)
  // page -1 = halaman cover (judul + asal daerah)
  const [page, setPage] = useState(-1)

  useEffect(() => {
    setStory(null)
    setPage(-1)
    loadStory(slug).then(setStory)
  }, [slug])

  if (!story) {
    return <p className="py-20 text-center text-gray-500">{t.loading}</p>
  }

  const isCover = page === -1
  const current = isCover ? null : story.pages[page]
  const hasNext = page < story.pages.length - 1
  const hasPrev = page > -1

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-4 flex justify-end">
        <Link
          to={`/level/${story.level.toLowerCase()}`}
          className="text-sm font-semibold text-brand"
        >
          {t.selectStory}
        </Link>
      </div>

      <div className="relative flex min-h-[60vh] items-center gap-6 rounded-lg bg-gray-100 p-8">
        {isCover ? (
          <div className="mx-auto flex flex-col items-center gap-4 text-center">
            <img
              src={story.cover}
              alt={story.title[lang]}
              className="max-h-72 rounded bg-pink-100 object-contain"
            />
            <h1 className="text-2xl font-bold text-brand">{story.title[lang]}</h1>
            <p className="text-gray-600">{story.region}</p>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-6 md:flex-row">
            <img
              src={current.image}
              alt=""
              className="max-h-80 w-full rounded bg-pink-100 object-contain md:w-1/2"
            />
            <p className="w-full text-lg leading-loose text-gray-800 md:w-1/2">
              {current.text}
            </p>
          </div>
        )}

        {hasPrev && (
          <button
            onClick={() => setPage(page - 1)}
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow"
            aria-label="Previous page"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}
        {hasNext || isCover ? (
          <button
            onClick={() => setPage(page + 1)}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow"
            aria-label="Next page"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        ) : null}
      </div>

      {!isCover && (
        <p className="mt-3 text-center text-sm text-gray-500">
          {page + 1} / {story.pages.length}
        </p>
      )}
    </div>
  )
}
