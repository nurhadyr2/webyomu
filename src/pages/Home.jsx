import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import Logo from '../components/Logo'

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="flex min-h-[calc(100vh-65px)] flex-col items-center px-4 text-center">
        <div className="flex flex-col items-center gap-5 pt-20 md:pt-28">
          <h1>
            <Logo icon="h-16 md:h-24" text="text-6xl md:text-8xl" />
          </h1>
          <p className="text-lg text-brand md:text-2xl">
            Practice N5-N4 Japanese Reading Through Indonesian Folklore.
          </p>
        </div>

        <Link
          to="/level"
          className="group mt-auto mb-16 flex flex-col items-center md:mb-24"
        >
          {/* Teks "Start Reading" melengkung */}
          <svg viewBox="0 0 300 80" className="h-20 w-72">
            <path id="startArc" d="M 30 75 Q 150 15 270 75" fill="none" />
            <text
              className="fill-brand text-[28px] font-bold"
              style={{ fontFamily: 'inherit' }}
            >
              <textPath href="#startArc" startOffset="50%" textAnchor="middle">
                Start Reading
              </textPath>
            </text>
          </svg>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl text-brand transition group-hover:scale-110">
            <FontAwesomeIcon icon={faArrowDown} />
          </span>
        </Link>
      </section>
    </div>
  )
}
