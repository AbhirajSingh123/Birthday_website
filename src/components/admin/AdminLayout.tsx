import { Outlet, Link, useNavigate } from 'react-router-dom'
import { LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminLayout() {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-midnight-900">
      <header className="border-b border-black/[0.06] bg-midnight-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/admin/dashboard" className="flex items-center gap-2 text-champagne">
            <LayoutDashboard className="h-5 w-5 text-gold-500" />
            <span className="font-display text-lg">Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            {user?.email && <span className="hidden text-sm text-champagne/50 sm:inline">{user.email}</span>}
            <button onClick={handleLogout} className="btn-outline !px-4 !py-2 text-xs">
              <LogOut className="h-3.5 w-3.5" /> Log out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">
        <Outlet />
      </main>
    </div>
  )
}
