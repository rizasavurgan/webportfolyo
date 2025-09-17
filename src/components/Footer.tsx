'use client'

import { getSiteSettings } from '@/lib/data'
import { useState, useEffect } from 'react'

export default function Footer() {
  const [footerText, setFooterText] = useState('© 2024 Rıza Savurgan. All rights reserved.')

  const loadData = () => {
    try {
      const siteSettings = getSiteSettings()
      setFooterText(siteSettings.footerText)
    } catch (error) {
      console.error('Error loading footer text:', error)
    }
  }

  useEffect(() => {
    loadData()

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'refreshSite' || e.key?.includes('portfolio_')) {
        loadData()
      }
    }

    const handleCustomEvent = () => {
      loadData()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('dataUpdated', handleCustomEvent)

    // Check for refresh token every second
    const refreshInterval = setInterval(() => {
      const refreshToken = localStorage.getItem('refreshSite')
      if (refreshToken) {
        localStorage.removeItem('refreshSite')
        loadData()
      }
    }, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('dataUpdated', handleCustomEvent)
      clearInterval(refreshInterval)
    }
  }, [])

  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {footerText}
          </p>
        </div>
      </div>
    </footer>
  )
}
