'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import SocialLinks from '@/components/SocialLinks'
import OverlayText from '@/components/OverlayText'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getSiteSettings, initializeData, SiteSettings } from '@/lib/data'

// Mock data - will be replaced with Sanity CMS data
const mockAbout = {
  name: 'Rıza Savurgan',
  bio: [
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'I am a designer based in Istanbul, specializing in brutalist design principles and typography-focused solutions. With over 5 years of experience in the creative industry, I have worked with clients ranging from startups to established brands.',
        },
      ],
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'My approach to design is rooted in the belief that form should follow function, but not at the expense of visual impact. I create bold, uncompromising designs that challenge conventional aesthetics while maintaining usability and accessibility.',
        },
      ],
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'Currently, I am freelancing and open to new projects that push the boundaries of design. I believe in the power of design to communicate complex ideas and create meaningful connections between brands and their audiences.',
        },
      ],
    },
  ],
  profileImage: {
    asset: {
      _ref: 'profile-image',
      _type: 'reference'
    }
  },
}


export default function MePage() {
  const [socialLinks, setSocialLinks] = useState<Array<{platform: string, url: string}>>([])

  const loadData = () => {
    try {
      // Initialize data if not exists
      initializeData()
      
      // Load site settings
      const siteSettingsData = getSiteSettings()
      setSocialLinks(siteSettingsData.socialLinks)
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
        <Navigation />
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
                  {mockAbout.name}
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
                  {mockAbout.name}
                </h1>
                <p className="text-lg text-gray-600 font-medium">
                  Designer & Creative Director
                </p>
              </div>

              <div className="prose prose-lg max-w-none">
                {mockAbout.bio.map((block, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-6">
                    {block.children[0].text}
                  </p>
                ))}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Brand Identity', 'Typography', 'Web Design', 'Art Direction', 'UI/UX Design', 'Editorial Design'].map((skill) => (
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
