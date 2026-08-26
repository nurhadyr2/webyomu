import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../i18n/LanguageContext'
import undipLogo from '../../logo.png'

export default function Navbar() {
  const { lang, toggle, t } = useLanguage()
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Link to="/" className="institution-link" aria-label="Yomunusa home">
          <img
            src={undipLogo}
            alt="Universitas Diponegoro, Program Studi D4 Bahasa Asing Terapan, Sekolah Vokasi"
            className="institution-logo"
          />
        </Link>
        <div className="nav-links">
          <Link to="/whats-yomunusa">{t.navWhats}</Link>
          <Link to="/about-us">{t.navAbout}</Link>
          <button
            onClick={toggle}
            className="language-toggle"
            aria-label="Switch language"
          >
            <FontAwesomeIcon icon={faGlobe} /> {lang.toUpperCase()}
          </button>
        </div>
      </nav>
    </header>
  )
}
