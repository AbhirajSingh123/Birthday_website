import { useEffect, useMemo, useState } from 'react'
import { Search, Trash2, Download, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { deleteGuest, fetchGuests, guestsToCsv } from '@/services/adminService'
import type { Guest } from '@/types/database'

export default function GuestTable() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  async function load() {
    setLoading(true)
    try {
      setGuests(await fetchGuests())
    } catch (err) {
      toast.error('Could not load guests.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return guests
    return guests.filter(
      (g) => g.full_name.toLowerCase().includes(q) || g.email.toLowerCase().includes(q),
    )
  }, [guests, query])

  async function handleDelete(id: string) {
    if (!confirm('Remove this guest from the list?')) return
    try {
      await deleteGuest(id)
      setGuests((g) => g.filter((x) => x.id !== id))
      toast.success('Guest removed.')
    } catch {
      toast.error('Could not remove guest.')
    }
  }

  function handleExport() {
    const csv = guestsToCsv(filtered)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'guests.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-lg text-champagne">Guests ({filtered.length})</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-champagne/40" />
            <input
              className="field-input !py-2 !pl-9 text-sm"
              placeholder="Search guests…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button onClick={handleExport} className="btn-outline !px-4 !py-2 text-xs">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-gold-500" /></div>
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-champagne/40">No guests match yet.</p>
        ) : (
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-champagne/50">
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">WhatsApp</th>
                <th className="py-2 pr-4 font-medium">Registered</th>
                <th className="py-2 pr-4 font-medium sr-only">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id} className="border-b border-black/[0.06] text-champagne/80">
                  <td className="py-3 pr-4">{g.full_name}</td>
                  <td className="py-3 pr-4">{g.email}</td>
                  <td className="py-3 pr-4">{g.whatsapp_number}</td>
                  <td className="py-3 pr-4">{new Date(g.registered_at).toLocaleDateString()}</td>
                  <td className="py-3 pr-4 text-right">
                    <button
                      onClick={() => handleDelete(g.id)}
                      aria-label={`Delete ${g.full_name}`}
                      className="rounded-lg p-1.5 text-champagne/40 hover:bg-black/[0.04] hover:text-rose-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
