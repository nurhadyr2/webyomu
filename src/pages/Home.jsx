import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import yomunusaLogo from '../assets/Frame 22.png'

export default function Home() {
  const { t } = useLanguage()
  return (
    <section className="home-hero">
        <div className="hero-brand">
          <h1 className="hero-title">
            <img src={yomunusaLogo} alt="Yomunusa" />
          </h1>
          <p className="hero-tagline">{t.tagline}</p>
        </div>

        <Link
          to="/level"
          className="start-reading"
        >
          <svg viewBox="0 0 320 100" aria-hidden="true">
            <path id="startArc" d="M 18 88 Q 160 10 302 88" fill="none" />
            <text>
              <textPath href="#startArc" startOffset="50%" textAnchor="middle">
                {t.startReading}
              </textPath>
            </text>
          </svg>
          <span className="start-arrow" aria-hidden="true">
            ↓
          </span>
        </Link>
      </section>
  )
}
