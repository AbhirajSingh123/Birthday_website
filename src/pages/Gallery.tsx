import GalleryAccess from '@/components/GalleryAccess'
import PhotoDropGrid from '@/components/PhotoDropGrid'

export default function Gallery() {
  return (
    <div className="py-8">
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="text-center">
          <p className="section-eyebrow">In Frame</p>
          <h2 className="mt-3 text-3xl font-semibold text-champagne sm:text-4xl">Abhiraj's Photos</h2>
        </div>
        <div className="mt-10">
          <PhotoDropGrid />
        </div>
      </section>
      <GalleryAccess />
    </div>
  )
}
