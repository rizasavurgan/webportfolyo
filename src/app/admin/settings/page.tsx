'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'

interface SiteSettings {
  siteTitle: string
  siteDescription: string
  logo: string
  footerText: string
  socialLinks: Array<{
    platform: string
    url: string
  }>
  contactInfo: {
    email: string
    phone: string
    location: string
  }
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string
  }
}

export default function AdminSettings() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: 'Rıza Savurgan',
    siteDescription: 'Designer & Developer based in Istanbul',
    logo: '',
    footerText: '© 2024 Rıza Savurgan. All rights reserved.',
    socialLinks: [],
    contactInfo: {
      email: '',
      phone: '',
      location: 'Istanbul, Turkey'
    },
    seo: {
      metaTitle: 'Rıza Savurgan - Designer',
      metaDescription: 'Brutalist and typography-focused portfolio of Rıza Savurgan, a designer based in Istanbul.',
      keywords: 'designer, portfolio, brutalist, typography, istanbul, freelance'
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const auth = localStorage.getItem('adminAuth')
    if (!auth) {
      window.location.href = '/admin'
      return
    }
    
    // Load existing settings
    const savedSettings = localStorage.getItem('portfolio_settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
    
    setIsAuthenticated(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [name]: value
      }
    }))
  }

  const handleSeoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [name]: value
      }
    }))
  }

  const addSocialLink = () => {
    setSettings(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', url: '' }]
    }))
  }

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }))
  }

  const removeSocialLink = (index: number) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }))
  }

  const handleSave = () => {
    setIsLoading(true)
    
    try {
      localStorage.setItem('portfolio_settings', JSON.stringify(settings))
      alert('Ayarlar başarıyla kaydedildi!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Ayarlar kaydedilirken bir hata oluştu!')
    }
    
    setIsLoading(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/admin/dashboard"
                className="mr-4 text-black hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-4xl font-black tracking-wider">SITE SETTINGS</h1>
            </div>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 border-2 border-black text-sm font-bold rounded-none text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 uppercase tracking-wide"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'SAVING...' : 'SAVE SETTINGS'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Basic Information */}
          <div className="bg-white border-4 border-black rounded-none p-8">
            <h2 className="text-2xl font-black text-black mb-6 uppercase tracking-wide">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="siteTitle" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                  Site Title
                </label>
                <input
                  type="text"
                  id="siteTitle"
                  name="siteTitle"
                  className="block w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                  value={settings.siteTitle}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="siteDescription" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                  Site Description
                </label>
                <input
                  type="text"
                  id="siteDescription"
                  name="siteDescription"
                  className="block w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                  value={settings.siteDescription}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="footerText" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                Footer Text
              </label>
              <input
                type="text"
                id="footerText"
                name="footerText"
                className="block w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                value={settings.footerText}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white border-4 border-black rounded-none p-8">
            <h2 className="text-2xl font-black text-black mb-6 uppercase tracking-wide">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="block w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                  value={settings.contactInfo.email}
                  onChange={handleContactChange}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="block w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                  value={settings.contactInfo.phone}
                  onChange={handleContactChange}
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="block w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                  value={settings.contactInfo.location}
                  onChange={handleContactChange}
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white border-4 border-black rounded-none p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-black uppercase tracking-wide">Social Links</h2>
              <button
                onClick={addSocialLink}
                className="inline-flex items-center px-4 py-2 border-2 border-black text-sm font-bold rounded-none text-black hover:bg-black hover:text-white uppercase tracking-wide"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </button>
            </div>
            
            <div className="space-y-4">
              {settings.socialLinks.map((link, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Platform (e.g., Instagram, LinkedIn)"
                    className="flex-1 px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                    value={link.platform}
                    onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    className="flex-1 px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                  />
                  <button
                    onClick={() => removeSocialLink(index)}
                    className="p-3 border-2 border-black rounded-none text-black hover:bg-black hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white border-4 border-black rounded-none p-8">
            <h2 className="text-2xl font-black text-black mb-6 uppercase tracking-wide">SEO Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="metaTitle" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                  Meta Title
                </label>
                <input
                  type="text"
                  id="metaTitle"
                  name="metaTitle"
                  className="block w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                  value={settings.seo.metaTitle}
                  onChange={handleSeoChange}
                />
              </div>

              <div>
                <label htmlFor="metaDescription" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                  Meta Description
                </label>
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  rows={3}
                  className="block w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                  value={settings.seo.metaDescription}
                  onChange={handleSeoChange}
                />
              </div>

              <div>
                <label htmlFor="keywords" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                  Keywords
                </label>
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  className="block w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                  value={settings.seo.keywords}
                  onChange={handleSeoChange}
                  placeholder="designer, portfolio, brutalist, typography, istanbul, freelance"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}