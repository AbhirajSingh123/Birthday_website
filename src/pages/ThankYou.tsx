import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PartyPopper } from 'lucide-react'

export default function ThankYou() {
  const location = useLocation()
  const type = (location.state as { type?: 'registration' | 'wish' } | null)?.type ?? 'registration'

  const copy =
    type === 'registration'
      ? {
          title: "You're on the Guest List!",
          body: "Thank you for being part of Abhiraj's 21st Birthday Celebration. We can't wait to see you there.",
        }
      : {
          title: 'Your wish has been received!',
          body: 'Once approved, it will appear on the Birthday Wishes Wall.',
        }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 py-16 text-center">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15">
          <PartyPopper className="h-7 w-7 text-gold-500" aria-hidden="true" />
        </div>
        <h1 className="font-display text-3xl text-champagne sm:text-4xl">{copy.title}</h1>
        <p className="mx-auto mt-3 max-w-md text-champagne/60">{copy.body}</p>
        <Link to="/" className="btn-gold mt-8 inline-flex">Back to the Celebration</Link>
      </motion.div>
    </div>
  )
}
