'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import SocialLinks from '@/components/SocialLinks'
import ProjectCard from '@/components/ProjectCard'
import OverlayText from '@/components/OverlayText'
import Footer from '@/components/Footer'
import { getPublishedProjects, getSiteSettings, initializeData } from '@/lib/data'

export default function Home() {
  const [projects, setProjects] = useState<any[]>([])
  const [socialLinks, setSocialLinks] = useState<any[]>([])
  const [siteTitle, setSiteTitle] = useState('Rıza Savurgan')
  const [siteDescription, setSiteDescription] = useState('Designer & Developer based in Istanbul')
  const [isLoading, setIsLoading] = useState(true)

  const loadData = () => {
    try {
      // Initialize data if not exists
      initializeData()
      
      // Load projects and settings
      const publishedProjects = getPublishedProjects()
      const siteSettings = getSiteSettings()
      
      setProjects(publishedProjects)
      setSocialLinks(siteSettings.socialLinks)
      setSiteTitle(siteSettings.siteTitle)
      setSiteDescription(siteSettings.siteDescription)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()

    // Listen for storage changes (when admin panel updates data)
    const handleStorageChange = (e: any) => {
      console.log('Storage changed:', e.key)
      if (e.key === 'refreshSite' || e.key?.includes('portfolio_')) {
        console.log('Refreshing data...')
        loadData()
      }
    }

    const handleCustomEvent = () => {
      console.log('Custom event received')
      loadData()
    }

    // Listen for localStorage changes
    window.addEventListener('storage', handleStorageChange)
    
    // Listen for custom events from admin panel
    window.addEventListener('dataUpdated', handleCustomEvent)

    // Check for refresh token every second
    const refreshInterval = setInterval(() => {
      const refreshToken = localStorage.getItem('refreshSite')
      if (refreshToken) {
        localStorage.removeItem('refreshSite')
        console.log('Refresh token found, reloading data...')
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
      <OverlayText text="CASE STUDIES" className="top-20 right-10" />
      <OverlayText text="GRAPHIC" className="bottom-20 left-10" />
      
      <div className="flex min-h-screen">
        {/* Left Fixed Column */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between">
          <div className="space-y-8">
            {/* Intro Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
                      <h1 className="text-4xl lg:text-6xl xl:text-7xl text-brutal text-black leading-none">
                        {siteTitle}
                      </h1>
              <p className="text-lg lg:text-xl text-gray-600 font-medium">
                {siteDescription}
              </p>
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Navigation />
            </motion.div>
          </div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <SocialLinks links={socialLinks} />
          </motion.div>
        </div>

        {/* Right Scrollable Column */}
        <div className="hidden lg:block w-1/2 overflow-y-auto">
          <div className="p-8 lg:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Featured Work
              </h2>
              
              <div className="grid gap-8">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-8"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Work
          </h2>
          
          <div className="grid gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project._id}
                project={project}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
