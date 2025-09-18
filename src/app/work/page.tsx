'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '@/components/ProjectCard'
import OverlayText from '@/components/OverlayText'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getProjects, getSiteSettings, Project, SiteSettings } from '@/lib/data'

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({})
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    try {
      // Load published projects and site settings
      const allProjects = await getProjects()
      const publishedProjects = allProjects.filter(project => project.status === 'published')
      const siteSettingsData = await getSiteSettings()
      setProjects(publishedProjects)
      setSiteSettings(siteSettingsData)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading projects:', error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      console.log('Work page - Storage changed:', e.key)
      if (e.key === 'refreshSite' || e.key?.includes('portfolio_')) {
        console.log('Work page - Refreshing data...')
        loadData()
      }
    }

    const handleCustomEvent = () => {
      console.log('Work page - Custom event received')
      loadData()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('dataUpdated', handleCustomEvent)

    // Check for refresh token every second
    const refreshInterval = setInterval(() => {
      const refreshToken = localStorage.getItem('refreshSite')
      if (refreshToken) {
        localStorage.removeItem('refreshSite')
        console.log('Work page - Refresh token found, reloading data...')
        loadData()
      }
    }, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('dataUpdated', handleCustomEvent)
      clearInterval(refreshInterval)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Overlay Text */}
      <OverlayText text="PORTFOLIO" className="top-20 right-10" />
      <OverlayText text="DESIGN" className="bottom-20 left-10" />
      
      {/* Mobile Navigation */}
      <div className="lg:hidden px-8 py-6 border-b border-gray-200">
        <Navigation />
      </div>
      
      <div className="flex min-h-screen">
        {/* Left Content Column */}
        <div className="w-full lg:w-2/3 px-8 py-12 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h1 className="text-4xl lg:text-6xl xl:text-7xl text-brutal text-black leading-none mb-6">
              Selected Work
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl">
              {siteSettings.siteDescription || 'A collection of projects that showcase my approach to design, from brand identity to digital experiences.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {projects.map((project, index) => (
              <ProjectCard
                key={project._id}
                project={project}
                index={index}
              />
            ))}
          </motion.div>
        </div>

        {/* Right Navigation Column */}
        <div className="hidden lg:block w-1/3 px-6 py-12 lg:py-20">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="sticky top-20"
          >
            <Navigation />
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
