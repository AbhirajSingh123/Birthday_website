import WishForm from '@/components/WishForm'
import WishSlider from '@/components/WishSlider'

export default function Wishes() {
  return (
    <div className="px-5 py-16">
      <div className="mx-auto max-w-lg text-center">
        <p className="section-eyebrow">Wishes Wall</p>
        <h1 className="mt-3 text-3xl font-semibold text-champagne sm:text-4xl">Birthday Wishes for Abhiraj</h1>
      </div>
      <div className="mt-10">
        <WishSlider />
      </div>
      <div className="mt-16">
        <WishForm />
      </div>
    </div>
  )
}
