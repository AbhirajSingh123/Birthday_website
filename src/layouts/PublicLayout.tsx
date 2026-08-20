import { Outlet } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MusicPlayer from '@/components/MusicPlayer'

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-noise">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MusicPlayer />
    </div>
  )
}
