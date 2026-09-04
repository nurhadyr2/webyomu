import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { loadStory } from '../data'
import { useLanguage } from '../i18n/LanguageContext'
import JapaneseText from '../components/JapaneseText'

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
  const hasGlossary = story.glossary.length > 0
  const isGlossary = hasGlossary && page === story.pages.length
  const current = isCover || isGlossary ? null : story.pages[page]
  const hasNext = page < story.pages.length - 1 || (hasGlossary && page < story.pages.length)
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
            <JapaneseText as="h1" className="text-2xl font-bold text-brand">{story.title.jp}</JapaneseText>
            <p className="text-lg text-gray-600">「{story.title[lang]}」</p>
            <JapaneseText as="p" className="font-semibold text-brand">{story.regionJp}の話[はなし]</JapaneseText>
          </div>
        ) : isGlossary ? (
          <section className="glossary-slide" aria-labelledby="glossary-title">
            <div className="glossary-heading">
              <p>{story.title[lang]}</p>
              <h1 id="glossary-title">{t.glossary}</h1>
            </div>
            <div className="glossary-table" role="table" aria-label={`${story.title[lang]} ${t.glossary}`}>
              <div className="glossary-row glossary-header" role="row">
                <span role="columnheader">{t.glossaryTerm}</span>
                <span role="columnheader">{t.glossaryMeaning}</span>
              </div>
              {story.glossary.map((group) => (
                <div className="glossary-group" role="rowgroup" key={group.category}>
                  <div className="glossary-category" role="row">
                    <span role="cell">{group.category}</span>
                  </div>
                  {group.items.map((item, index) => (
                    <div className="glossary-row" role="row" key={`${item.term}-${index}`}>
                      <JapaneseText as="span" role="cell">{item.term}</JapaneseText>
                      <span role="cell">{item.meaning}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="flex w-full flex-col items-center gap-6 md:flex-row">
            <img
              src={current.image}
              alt=""
              className="max-h-80 w-full rounded bg-pink-100 object-contain md:w-1/2"
            />
            <JapaneseText as="p" className="w-full text-lg leading-[2.6] text-gray-800 md:w-1/2">
              {current.text}
            </JapaneseText>
          </div>
        )}

        {hasPrev && (
          <button
            onClick={() => setPage(page - 1)}
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow"
            aria-label={t.previousPage}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}
        {hasNext ? (
          <button
            onClick={() => setPage(page + 1)}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow"
            aria-label={t.nextPage}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        ) : null}
      </div>

      {!isCover && !isGlossary && (
        <p className="mt-3 text-center text-sm text-gray-500">
          {page + 1} / {story.pages.length}
        </p>
      )}
    </div>
  )
}
