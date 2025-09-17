'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, Globe, Mail, Phone, MapPin } from 'lucide-react'
import { getSiteSettings, saveSiteSettings, SiteSettings, initializeData } from '@/lib/data'

export default function SettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    siteTitle: 'Rıza Savurgan',
    siteDescription: 'Designer & Developer based in Istanbul',
    logo: '',
    footerText: '© 2024 Rıza Savurgan. All rights reserved.',
    socialLinks: [
      { platform: 'instagram', url: 'https://instagram.com/rizasavurgan' },
      { platform: 'behance', url: 'https://behance.net/rizasavurgan' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/rizasavurgan' },
      { platform: 'twitter', url: 'https://twitter.com/rizasavurgan' }
    ],
    contactInfo: {
      email: 'hello@rizasavurgan.com',
      phone: '+90 555 123 45 67',
      location: 'Istanbul, Turkey'
    },
    seo: {
      metaTitle: 'Rıza Savurgan - Designer & Developer',
      metaDescription: 'Portfolio of Rıza Savurgan, a designer and developer based in Istanbul.',
      keywords: 'design, development, portfolio, istanbul, designer, developer'
    }
  })

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (!auth) {
      window.location.href = '/admin'
      return
    }
    setIsAuthenticated(true)

    // Load settings from localStorage
    const loadData = async () => {
      try {
        // Initialize data if not exists
        initializeData()
        
        const siteSettings = getSiteSettings()
        setSettings(siteSettings)
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }

    loadData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSocialLinkChange = (index: number, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }))
  }

  const addSocialLink = () => {
    setSettings(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', url: '' }]
    }))
  }

  const removeSocialLink = (index: number) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setSettings(prev => ({
          ...prev,
          logo: result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    
    try {
      // Save settings to localStorage with quota checking
      const success = saveSiteSettings(settings)
      
      if (!success) {
        alert('Storage quota exceeded! Please clean up old data or reduce content size.')
        setIsLoading(false)
        return
      }
      
      // Dispatch custom event to notify other tabs
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('dataUpdated'))
        // Also try to refresh other tabs
        localStorage.setItem('refreshSite', Date.now().toString())
      }
      
      alert('Ayarlar başarıyla kaydedildi!\n\nSite sayfasını yenilemek için:\n1. Site sekmesine geçin\n2. Sayfayı yenileyin (F5)\n3. Yeni ayarları göreceksiniz!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Ayarlar kaydedilirken bir hata oluştu!')
    }
    
    setIsLoading(false)
  }

  if (!isAuthenticated) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link
                href="/admin/dashboard"
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Site Ayarları</h1>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              Ayarları Kaydet
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* General Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white shadow rounded-lg"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Genel Ayarlar
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="siteTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Site Başlığı (Ana Sayfa Başlığı)
                  </label>
                  <input
                    type="text"
                    id="siteTitle"
                    name="siteTitle"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    value={settings.siteTitle}
                    onChange={handleInputChange}
                    placeholder="Örn: Rıza Savurgan is a designer based in Istanbul"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Bu metin ana sayfanın büyük başlığında görünür
                  </p>
                </div>
                <div>
                  <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Site Açıklaması (Alt Başlık)
                  </label>
                  <textarea
                    id="siteDescription"
                    name="siteDescription"
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    value={settings.siteDescription}
                    onChange={handleInputChange}
                    placeholder="Örn: Currently freelancing for a bit ;)"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Bu metin ana sayfa başlığının altında görünür
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {settings.logo ? (
                    <div className="space-y-4">
                      <img 
                        src={settings.logo} 
                        alt="Logo" 
                        className="mx-auto h-20 w-20 object-contain rounded-lg"
                      />
                      <div className="flex justify-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setSettings(prev => ({ ...prev, logo: '' }))}
                          className="inline-flex items-center px-3 py-1 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                        >
                          Kaldır
                        </button>
                        <button
                          type="button"
                          onClick={() => document.getElementById('logo-upload')?.click()}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Değiştir
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-2">
                        Logo yüklemek için tıklayın
                      </p>
                      <button
                        type="button"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Logo Seç
                      </button>
                    </div>
                  )}
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="footerText" className="block text-sm font-medium text-gray-700 mb-2">
                  Footer Metni
                </label>
                <textarea
                  id="footerText"
                  name="footerText"
                  rows={2}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  value={settings.footerText}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white shadow rounded-lg"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                İletişim Bilgileri
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    value={settings.contactInfo.email}
                    onChange={handleContactInfoChange}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    value={settings.contactInfo.phone}
                    onChange={handleContactInfoChange}
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Konum
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    value={settings.contactInfo.location}
                    onChange={handleContactInfoChange}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white shadow rounded-lg"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Sosyal Medya Bağlantıları</h2>
                <button
                  onClick={addSocialLink}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Ekle
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {settings.socialLinks.map((link, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform
                    </label>
                    <select
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                      value={link.platform}
                      onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                    >
                      <option value="">Platform Seçin</option>
                      <option value="instagram">Instagram</option>
                      <option value="twitter">Twitter</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="behance">Behance</option>
                      <option value="github">GitHub</option>
                      <option value="dribbble">Dribbble</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL
                    </label>
                    <input
                      type="url"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <button
                      onClick={() => removeSocialLink(index)}
                      className="w-full inline-flex items-center justify-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SEO Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white shadow rounded-lg"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">SEO Ayarları</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Başlık
                </label>
                <input
                  type="text"
                  id="metaTitle"
                  name="metaTitle"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  value={settings.seo.metaTitle}
                  onChange={handleSeoChange}
                />
              </div>
              <div>
                <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Açıklama
                </label>
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  value={settings.seo.metaDescription}
                  onChange={handleSeoChange}
                />
              </div>
              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                  Anahtar Kelimeler
                </label>
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  value={settings.seo.keywords}
                  onChange={handleSeoChange}
                  placeholder="virgül ile ayırın"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
