import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { EventSettingsProvider } from './contexts/EventSettingsContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EventSettingsProvider>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#12121e',
                color: '#f4ecd8',
                border: '1px solid rgba(201,162,75,0.3)',
              },
            }}
          />
        </EventSettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
