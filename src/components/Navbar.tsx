import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, PartyPopper } from 'lucide-react'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/event', label: 'Event' },
  { to: '/wishes', label: 'Wishes' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/register', label: 'Register' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-midnight-900/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4" aria-label="Primary">
        <Link to="/" className="flex items-center gap-2 font-display text-lg text-champagne" onClick={() => setOpen(false)}>
          <PartyPopper className="h-5 w-5 text-gold-500" aria-hidden="true" />
          <span>
            Abhiraj<span className="text-gold-500">.</span>21
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-colors ${
                  isActive ? 'text-gold-500' : 'text-champagne/70 hover:text-champagne'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/register" className="btn-gold !px-5 !py-2 text-xs">
            Join the Celebration
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-champagne md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-black/[0.06] bg-midnight-900 px-5 pb-5 md:hidden">
          <div className="flex flex-col gap-1 pt-3">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-black/[0.04] text-gold-600' : 'text-champagne/80'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
