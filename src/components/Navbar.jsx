import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import Logo from './Logo'

export default function Navbar() {
  return (
    <header className="border-b border-gray-200">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/">
          <Logo icon="h-8" text="text-3xl" />
        </Link>
        <div className="flex items-center gap-6 text-sm font-semibold text-brand">
          <Link to="/whats-yomunusa">What's Yomunusa?</Link>
          <Link to="/about-us">About Us</Link>
          <button className="flex items-center gap-1">
            <FontAwesomeIcon icon={faGlobe} /> EN
          </button>
        </div>
      </nav>
    </header>
  )
}
