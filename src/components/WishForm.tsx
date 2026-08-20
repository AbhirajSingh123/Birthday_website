import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { isValidEmail, isValidMessage, isValidName } from '@/utils/validation'
import { submitWish } from '@/services/wishService'

interface FormState {
  name: string
  email: string
  message: string
}
type FormErrors = Partial<Record<keyof FormState, string>>

export default function WishForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  function validate(): boolean {
    const next: FormErrors = {}
    if (!isValidName(form.name)) next.name = 'Enter your name.'
    if (!isValidEmail(form.email)) next.email = 'Enter a valid email address.'
    if (!isValidMessage(form.message)) next.message = 'Write a short wish (5–500 characters).'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const result = await submitWish(form)
      if (!result.success) {
        toast.error(result.error || 'Something went wrong. Please try again.')
        return
      }
      navigate('/thank-you', { state: { type: 'wish' } })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      noValidate
      className="glass mx-auto max-w-lg rounded-3xl p-6 sm:p-8"
    >
      <h2 className="font-display text-2xl text-champagne">Send Your Birthday Wish</h2>
      <p className="mt-1 text-sm text-champagne/60">
        Your wish is reviewed before it appears on the Wishes Wall.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="wish-name" className="field-label">Name</label>
          <input
            id="wish-name"
            className="field-input"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="wish-email" className="field-label">Email</label>
          <input
            id="wish-email"
            type="email"
            className="field-input"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="wish-message" className="field-label">Birthday Wish</label>
          <textarea
            id="wish-message"
            rows={4}
            className="field-input resize-none"
            placeholder="Write your best wishes for Abhiraj…"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            aria-invalid={Boolean(errors.message)}
          />
          {errors.message && <p className="field-error">{errors.message}</p>}
        </div>
      </div>

      <button type="submit" className="btn-gold mt-7 w-full" disabled={submitting}>
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {submitting ? 'Sending…' : 'Send Wish'}
      </button>
    </motion.form>
  )
}
