import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import Logo from './Logo'

export default function Navbar() {
  return (
    <header className="border-b border-gray-200">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
        <Link to="/" className="shrink-0">
          <Logo icon="h-6 sm:h-8" text="text-xl sm:text-3xl" />
        </Link>
        <div className="flex items-center gap-3 text-xs font-semibold text-brand sm:gap-6 sm:text-sm">
          <Link to="/whats-yomunusa" className="whitespace-nowrap">What's Yomunusa?</Link>
          <Link to="/about-us" className="whitespace-nowrap">About Us</Link>
          <button className="flex items-center gap-1">
            <FontAwesomeIcon icon={faGlobe} /> EN
          </button>
        </div>
      </nav>
    </header>
  )
}
