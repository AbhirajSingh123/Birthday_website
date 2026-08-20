import { Routes, Route } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/ProtectedRoute'

import Home from '@/pages/Home'
import Register from '@/pages/Register'
import Wishes from '@/pages/Wishes'
import Event from '@/pages/Event'
import Gallery from '@/pages/Gallery'
import ThankYou from '@/pages/ThankYou'
import NotFound from '@/pages/NotFound'

import AdminLogin from '@/pages/admin/AdminLogin'
import AdminDashboard from '@/pages/admin/AdminDashboard'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/wishes" element={<Wishes />} />
        <Route path="/event" element={<Event />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
