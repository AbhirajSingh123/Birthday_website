import { FormEvent, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Loader2, Lock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { isSupabaseConfigured } from '@/lib/supabase'

export default function AdminLogin() {
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/admin/dashboard" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    navigate('/admin/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-midnight-900 px-5">
      <form onSubmit={handleSubmit} className="glass w-full max-w-sm rounded-3xl p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/15">
          <Lock className="h-5 w-5 text-gold-500" />
        </div>
        <h1 className="mt-4 text-center font-display text-2xl text-champagne">Admin Login</h1>
        <p className="mt-1 text-center text-sm text-champagne/50">Sign in with your Supabase admin account.</p>

        {!isSupabaseConfigured && (
          <p className="mt-4 rounded-lg bg-gold-500/10 px-3 py-2 text-xs text-gold-600">
            Supabase isn't connected yet — add your credentials to .env to enable admin login.
          </p>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label className="field-label" htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              className="field-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              className="field-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        {error && <p className="field-error mt-3">{error}</p>}

        <button type="submit" className="btn-gold mt-6 w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
