import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import Logo from './Logo'
import { useLanguage } from '../i18n/LanguageContext'

export default function Navbar() {
  const { lang, toggle, t } = useLanguage()
  return (
    <header className="border-b border-gray-200">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
        <Link to="/" className="shrink-0">
          <Logo icon="h-6 sm:h-8" text="text-xl sm:text-3xl" />
        </Link>
        <div className="flex items-center gap-3 text-xs font-semibold text-brand sm:gap-6 sm:text-sm">
          <Link to="/whats-yomunusa" className="whitespace-nowrap">{t.navWhats}</Link>
          <Link to="/about-us" className="whitespace-nowrap">{t.navAbout}</Link>
          <button
            onClick={toggle}
            className="flex items-center gap-1"
            aria-label="Switch language"
          >
            <FontAwesomeIcon icon={faGlobe} /> {lang.toUpperCase()}
          </button>
        </div>
      </nav>
    </header>
  )
}
