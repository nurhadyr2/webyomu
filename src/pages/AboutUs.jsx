import { useLanguage } from '../i18n/LanguageContext'

export default function AboutUs() {
  const { t } = useLanguage()
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-6 text-2xl font-bold text-brand">{t.navAbout}</h1>
      {t.aboutBody.map((p, i) => (
        <p key={i} className="mb-4 text-justify leading-relaxed text-gray-700">
          {p}
        </p>
      ))}
    </div>
  )
}
