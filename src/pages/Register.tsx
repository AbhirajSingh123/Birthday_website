import RegistrationForm from '@/components/RegistrationForm'

export default function Register() {
  return (
    <div className="px-5 py-16">
      <div className="mx-auto max-w-lg text-center">
        <p className="section-eyebrow">Guest List</p>
        <h1 className="mt-3 text-3xl font-semibold text-champagne sm:text-4xl">Register for the Celebration</h1>
      </div>
      <div className="mt-10">
        <RegistrationForm />
      </div>
    </div>
  )
}
