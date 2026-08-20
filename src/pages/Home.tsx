import BirthdayHero from '@/components/BirthdayHero'
import PhotoCarousel from '@/components/PhotoCarousel'
import EventDetails from '@/components/EventDetails'
import WishSlider from '@/components/WishSlider'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <BirthdayHero />
      <PhotoCarousel />
      <EventDetails />
      <section className="px-5 py-16">
        <div className="text-center">
          <p className="section-eyebrow">From Everyone</p>
          <h2 className="mt-3 text-3xl font-semibold text-champagne sm:text-4xl">Birthday Wishes for Abhiraj</h2>
        </div>
        <div className="mt-10">
          <WishSlider />
        </div>
        <div className="mt-8 text-center">
          <Link to="/wishes" className="btn-outline">Send Your Wish</Link>
        </div>
      </section>
    </>
  )
}
