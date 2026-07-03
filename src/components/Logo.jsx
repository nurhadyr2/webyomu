import logo from '../assets/logo.png'

// Ikon tumpukan buku + teks YOMUNUSA (Irish Grover)
export default function Logo({ icon = 'h-8', text = 'text-3xl' }) {
  return (
    <span className="inline-flex items-center gap-2 text-brand">
      <img src={logo} alt="" className={`w-auto ${icon}`} />
      <span className={`font-logo leading-none ${text}`}>YOMUNUSA</span>
    </span>
  )
}
