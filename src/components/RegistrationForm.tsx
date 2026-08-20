import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ImagePlus, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { isValidEmail, isValidName, isValidWhatsApp } from '@/utils/validation'
import { registerGuest } from '@/services/guestService'
import { uploadProfilePhoto } from '@/services/storageService'

interface FormState {
  fullName: string
  email: string
  whatsapp: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

export default function RegistrationForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({ fullName: '', email: '', whatsapp: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [photo, setPhoto] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function validate(): boolean {
    const next: FormErrors = {}
    if (!isValidName(form.fullName)) next.fullName = 'Enter your full name (2–80 characters).'
    if (!isValidEmail(form.email)) next.email = 'Enter a valid email address.'
    if (!isValidWhatsApp(form.whatsapp)) next.whatsapp = 'Enter a valid WhatsApp number.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      let profileUrl: string | null = null
      if (photo) {
        try {
          profileUrl = await uploadProfilePhoto(photo)
        } catch {
          toast.error('Photo upload failed — continuing without it.')
        }
      }

      const result = await registerGuest({
        full_name: form.fullName,
        email: form.email,
        whatsapp_number: form.whatsapp,
        profile_image_url: profileUrl,
      })

      if (!result.success) {
        toast.error(result.error || 'Something went wrong. Please try again.')
        return
      }

      navigate('/thank-you', { state: { type: 'registration' } })
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
      <h2 className="font-display text-2xl text-champagne">You're Invited</h2>
      <p className="mt-1 text-sm text-champagne/60">
        Reserve your spot on the guest list. Your details stay private and are never shown publicly.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="fullName" className="field-label">Full Name</label>
          <input
            id="fullName"
            className="field-input"
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            autoComplete="name"
          />
          {errors.fullName && <p id="fullName-error" className="field-error">{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="field-label">Email Address</label>
          <input
            id="email"
            type="email"
            className="field-input"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            autoComplete="email"
          />
          {errors.email && <p id="email-error" className="field-error">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="whatsapp" className="field-label">WhatsApp Number</label>
          <input
            id="whatsapp"
            type="tel"
            className="field-input"
            placeholder="+91 98765 43210"
            value={form.whatsapp}
            onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
            aria-invalid={Boolean(errors.whatsapp)}
            aria-describedby={errors.whatsapp ? 'whatsapp-error' : undefined}
            autoComplete="tel"
          />
          {errors.whatsapp && <p id="whatsapp-error" className="field-error">{errors.whatsapp}</p>}
        </div>

        <div>
          <span className="field-label">Profile Photo (optional)</span>
          <label
            htmlFor="photo"
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-black/15 px-4 py-3 text-sm text-champagne/60 transition-colors hover:border-gold-500/50"
          >
            <ImagePlus className="h-4 w-4 text-gold-500" aria-hidden="true" />
            {photo ? photo.name : 'Choose a photo'}
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      <button type="submit" className="btn-gold mt-7 w-full" disabled={submitting}>
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {submitting ? 'Registering…' : "I'll Be There"}
      </button>
    </motion.form>
  )
}
