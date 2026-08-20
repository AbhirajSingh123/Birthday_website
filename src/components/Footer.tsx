import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-midnight-950">
      <div className="mx-auto max-w-6xl px-5 py-10 text-center">
        <p className="font-display text-lg text-champagne">Abhiraj's 21st Birthday</p>
        <p className="mt-1 text-sm text-champagne/50">20 August 2026 · A private celebration</p>
        <div className="mt-4 flex justify-center gap-6 text-xs text-champagne/40">
          <Link to="/register" className="hover:text-gold-500">Register</Link>
          <Link to="/wishes" className="hover:text-gold-500">Wishes</Link>
          <Link to="/admin/login" className="hover:text-gold-500">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
