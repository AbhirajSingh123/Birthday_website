import { useEffect, useMemo, useState } from 'react'
import { Check, X, Trash2, Search, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { deleteWish, fetchWishes, setWishStatus } from '@/services/adminService'
import type { Wish, WishStatus } from '@/types/database'

const TABS: Array<{ key: WishStatus | 'all'; label: string }> = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'all', label: 'All' },
]

export default function WishModeration() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<WishStatus | 'all'>('pending')
  const [query, setQuery] = useState('')

  async function load() {
    setLoading(true)
    try {
      setWishes(await fetchWishes())
    } catch {
      toast.error('Could not load wishes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return wishes.filter((w) => {
      const matchesTab = tab === 'all' || w.status === tab
      const matchesQuery = !q || w.name.toLowerCase().includes(q) || w.message.toLowerCase().includes(q)
      return matchesTab && matchesQuery
    })
  }, [wishes, tab, query])

  async function updateStatus(id: string, status: WishStatus) {
    const prev = wishes
    setWishes((w) => w.map((x) => (x.id === id ? { ...x, status } : x)))
    try {
      await setWishStatus(id, status)
      toast.success(status === 'approved' ? 'Wish approved.' : 'Wish rejected.')
    } catch {
      setWishes(prev)
      toast.error('Could not update wish.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this wish permanently?')) return
    try {
      await deleteWish(id)
      setWishes((w) => w.filter((x) => x.id !== id))
      toast.success('Wish deleted.')
    } catch {
      toast.error('Could not delete wish.')
    }
  }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-full bg-black/[0.04] p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                tab === t.key ? 'bg-gold-500 text-ink-900' : 'text-champagne/60 hover:text-champagne'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-champagne/40" />
          <input
            className="field-input !py-2 !pl-9 text-sm"
            placeholder="Search wishes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-gold-500" /></div>
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-champagne/40">No wishes here.</p>
        ) : (
          filtered.map((w) => (
            <div key={w.id} className="rounded-xl border border-black/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-champagne">{w.name}</p>
                  <p className="mt-1 text-sm text-champagne/70">{w.message}</p>
                  <p className="mt-2 text-xs text-champagne/30">{new Date(w.created_at).toLocaleString()}</p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  {w.status !== 'approved' && (
                    <button
                      onClick={() => updateStatus(w.id, 'approved')}
                      aria-label="Approve wish"
                      className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400 hover:bg-emerald-500/20"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  {w.status !== 'rejected' && (
                    <button
                      onClick={() => updateStatus(w.id, 'rejected')}
                      aria-label="Reject wish"
                      className="rounded-lg bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500/20"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(w.id)}
                    aria-label="Delete wish"
                    className="rounded-lg p-2 text-champagne/40 hover:bg-black/[0.04] hover:text-rose-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
