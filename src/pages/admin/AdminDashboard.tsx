import { useEffect, useState } from 'react'
import { Users, MessageSquareHeart, Clock, CheckCircle2 } from 'lucide-react'
import { fetchGuests, fetchWishes } from '@/services/adminService'
import { useEventSettings } from '@/contexts/EventSettingsContext'
import { useEventStatus } from '@/hooks/useEventStatus'
import GuestTable from '@/components/admin/GuestTable'
import WishModeration from '@/components/admin/WishModeration'
import EventSettingsForm from '@/components/admin/EventSettingsForm'
import PhotoManager from '@/components/admin/PhotoManager'
import MusicSettingsForm from '@/components/admin/MusicSettingsForm'

type Tab = 'overview' | 'guests' | 'wishes' | 'photos' | 'music' | 'settings'

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('overview')
  const [stats, setStats] = useState({ guests: 0, wishes: 0, pending: 0, approved: 0 })
  const { settings } = useEventSettings()
  const status = useEventStatus(settings.event_date, settings.event_end_date)

  useEffect(() => {
    Promise.all([fetchGuests(), fetchWishes()])
      .then(([guests, wishes]) => {
        setStats({
          guests: guests.length,
          wishes: wishes.length,
          pending: wishes.filter((w) => w.status === 'pending').length,
          approved: wishes.filter((w) => w.status === 'approved').length,
        })
      })
      .catch(() => {})
  }, [tab])

  const TABS: Array<{ key: Tab; label: string }> = [
    { key: 'overview', label: 'Overview' },
    { key: 'guests', label: 'Guests' },
    { key: 'wishes', label: 'Wishes' },
    { key: 'photos', label: 'Photos' },
    { key: 'music', label: 'Music' },
    { key: 'settings', label: 'Event Settings' },
  ]

  return (
    <div>
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-full bg-black/[0.04] p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-gold-500 text-ink-900' : 'text-champagne/60 hover:text-champagne'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} label="Registered Guests" value={stats.guests} />
          <StatCard icon={MessageSquareHeart} label="Total Wishes" value={stats.wishes} />
          <StatCard icon={Clock} label="Pending Wishes" value={stats.pending} />
          <StatCard icon={CheckCircle2} label="Approved Wishes" value={stats.approved} />
          <div className="glass col-span-full rounded-2xl p-5">
            <p className="text-sm text-champagne/50">Event Status</p>
            <p className="mt-1 font-display text-2xl text-gold-500">{status}</p>
          </div>
        </div>
      )}

      {tab === 'guests' && <GuestTable />}
      {tab === 'wishes' && <WishModeration />}
      {tab === 'photos' && <PhotoManager />}
      {tab === 'music' && <MusicSettingsForm />}
      {tab === 'settings' && <EventSettingsForm />}
    </div>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <div className="glass rounded-2xl p-5">
      <Icon className="h-5 w-5 text-gold-500" aria-hidden="true" />
      <p className="mt-3 font-display text-3xl text-champagne">{value}</p>
      <p className="mt-1 text-sm text-champagne/50">{label}</p>
    </div>
  )
}
