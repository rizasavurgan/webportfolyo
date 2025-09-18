'use client'

import { useState, useEffect } from 'react'

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Wait for client-side hydration
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    } else {
      // Redirect to login if not authenticated
      window.location.href = '/admin'
    }
    
    setIsLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem('adminAuth')
    window.location.href = '/admin'
  }

  return {
    isAuthenticated,
    isLoading,
    logout
  }
}
