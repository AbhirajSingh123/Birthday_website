import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-6xl text-gold-500">404</p>
      <p className="mt-3 text-champagne/60">This page hasn't been invited.</p>
      <Link to="/" className="btn-outline mt-6">Back Home</Link>
    </div>
  )
}
