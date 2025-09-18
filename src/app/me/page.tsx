'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Edit } from 'lucide-react'
import SocialLinks from '@/components/SocialLinks'
import OverlayText from '@/components/OverlayText'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getSiteSettings, getAboutContent, SiteSettings, AboutContent } from '@/lib/data'

// This will be replaced with data from admin panel


export default function MePage() {
  const [socialLinks, setSocialLinks] = useState<Array<{platform: string, url: string}>>([])
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)

  const loadData = async () => {
    try {
      // Load site settings and about content
      const [siteSettingsData, aboutData] = await Promise.all([
        getSiteSettings(),
        getAboutContent()
      ])
      setSocialLinks(siteSettingsData.socialLinks)
      setAboutContent(aboutData)
    } catch (error) {
      console.error('Error loading about data:', error)
    }
  }

  useEffect(() => {
    loadData()

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      console.log('About page - Storage changed:', e.key)
      if (e.key === 'refreshSite' || e.key?.includes('portfolio_')) {
        console.log('About page - Refreshing data...')
        loadData()
      }
    }

    const handleCustomEvent = () => {
      console.log('About page - Custom event received')
      loadData()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('dataUpdated', handleCustomEvent)

    // Check for refresh token every second
    const refreshInterval = setInterval(() => {
      const refreshToken = localStorage.getItem('refreshSite')
      if (refreshToken) {
        localStorage.removeItem('refreshSite')
        console.log('About page - Refresh token found, reloading data...')
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
    <div className="min-h-screen bg-white">
      {/* Overlay Text */}
      <OverlayText text="ABOUT" className="top-20 right-10" />
      <OverlayText text="ME" className="bottom-20 left-10" />
      
      {/* Mobile Navigation */}
      <div className="lg:hidden px-8 py-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <Navigation />
          <Link
            href="/admin/content"
            className="inline-flex items-center px-3 py-2 border border-black text-sm font-bold rounded-none text-black bg-white hover:bg-black hover:text-white transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </div>
      </div>
      
      <div className="flex min-h-screen">
        {/* Left Content Column */}
        <div className="w-full lg:w-2/3 px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="relative">
                <div className="w-full h-96 lg:h-[500px] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 font-medium text-2xl rounded-lg">
                  {aboutContent?.name || 'Rıza Savurgan'}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
              </div>
            </motion.div>

            {/* Bio Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 lg:order-2 space-y-8"
            >
              <div>
                <h1 className="text-4xl lg:text-6xl text-brutal text-black leading-none mb-6">
                  {aboutContent?.name || 'Rıza Savurgan'}
                </h1>
                <p className="text-lg text-gray-600 font-medium">
                  Designer & Creative Director
                </p>
              </div>

              <div className="prose prose-lg max-w-none">
                {aboutContent?.bio?.map((bioText, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-6">
                    {bioText}
                  </p>
                )) || (
                  <p className="text-gray-700 leading-relaxed mb-6">
                    I am a designer based in Istanbul, specializing in brutalist design principles and typography-focused solutions.
                  </p>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {aboutContent?.skills?.map((skill) => (
                      <span
                        key={skill.name}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full"
                      >
                        {skill.name}
                      </span>
                    )) || ['Brand Identity', 'Typography', 'Web Design', 'Art Direction', 'UI/UX Design', 'Editorial Design'].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Connect
                  </h3>
                  <SocialLinks links={socialLinks} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <h3 className="text-3xl font-bold text-black mb-2">5+</h3>
              <p className="text-gray-600">Years Experience</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-black mb-2">50+</h3>
              <p className="text-gray-600">Projects Completed</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-black mb-2">100%</h3>
              <p className="text-gray-600">Client Satisfaction</p>
            </div>
          </motion.div>
        </div>

        {/* Right Navigation Column */}
        <div className="hidden lg:block w-1/3 px-6 py-12 lg:py-20">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="sticky top-20 space-y-4"
          >
            <Navigation />
            <Link
              href="/admin/content"
              className="inline-flex items-center px-4 py-2 border-2 border-black text-sm font-bold rounded-none text-black bg-white hover:bg-black hover:text-white transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Content
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
