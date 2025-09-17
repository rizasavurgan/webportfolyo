'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, User, Mail, FileText } from 'lucide-react'
import { getAboutContent, saveAboutContent, getContactContent, saveContactContent, AboutContent, ContactContent, initializeData } from '@/lib/data'

export default function ContentPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('about')
  
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    name: 'Rıza Savurgan',
    bio: [
      'I am a passionate designer and developer based in Istanbul, Turkey.',
      'With over 5 years of experience in digital design, I specialize in creating user-centered experiences that combine aesthetic appeal with functional design.',
      'My approach is rooted in understanding user needs and translating them into beautiful, intuitive interfaces.',
      'When I\'m not designing, you can find me exploring the vibrant streets of Istanbul or experimenting with new technologies.'
    ],
    profileImage: '',
    skills: [
      { name: 'UI/UX Design', percentage: 95 },
      { name: 'Frontend Development', percentage: 90 },
      { name: 'Brand Identity', percentage: 85 },
      { name: 'Motion Design', percentage: 80 }
    ],
    stats: [
      { label: 'Projects Completed', value: '50+' },
      { label: 'Happy Clients', value: '30+' },
      { label: 'Years Experience', value: '5+' },
      { label: 'Client Satisfaction', value: '100%' }
    ]
  })

  const [contactContent, setContactContent] = useState<ContactContent>({
    title: 'Let\'s work together',
    description: 'I\'m always interested in new projects and opportunities. Whether you have a question or just want to say hi, I\'ll try my best to get back to you!',
    formTitle: 'Send me a message',
    formFields: {
      name: 'Name',
      email: 'Email',
      message: 'Message'
    },
    submitText: 'Send Message'
  })

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (!auth) {
      window.location.href = '/admin'
      return
    }
    setIsAuthenticated(true)

    // Load content from localStorage
    const loadData = async () => {
      try {
        // Initialize data if not exists
        initializeData()
        
        const aboutData = getAboutContent()
        const contactData = getContactContent()
        setAboutContent(aboutData)
        setContactContent(contactData)
      } catch (error) {
        console.error('Error loading content:', error)
      }
    }

    loadData()
  }, [])

  const handleAboutChange = (field: string, value: string) => {
    setAboutContent(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleBioChange = (index: number, value: string) => {
    const newBio = [...aboutContent.bio]
    newBio[index] = value
    setAboutContent(prev => ({
      ...prev,
      bio: newBio
    }))
  }

  const addBioParagraph = () => {
    setAboutContent(prev => ({
      ...prev,
      bio: [...prev.bio, '']
    }))
  }

  const removeBioParagraph = (index: number) => {
    setAboutContent(prev => ({
      ...prev,
      bio: prev.bio.filter((_, i) => i !== index)
    }))
  }

  const handleSkillChange = (index: number, field: string, value: string | number) => {
    setAboutContent(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }))
  }

  const addSkill = () => {
    setAboutContent(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', percentage: 0 }]
    }))
  }

  const removeSkill = (index: number) => {
    setAboutContent(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const handleContactChange = (field: string, value: string | object) => {
    setContactContent(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveContent = async () => {
    setIsLoading(true)
    
    // Save content to localStorage
    saveAboutContent(aboutContent)
    saveContactContent(contactContent)
    
    // Dispatch custom event to notify other tabs
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dataUpdated'))
    }
    
    alert('İçerik başarıyla kaydedildi!')
    
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
              <h1 className="text-2xl font-bold text-gray-900">İçerik Yönetimi</h1>
            </div>
            <button
              onClick={handleSaveContent}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              İçeriği Kaydet
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('about')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'about'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <User className="h-4 w-4 inline mr-2" />
                Hakkımda
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'contact'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Mail className="h-4 w-4 inline mr-2" />
                İletişim
              </button>
            </nav>
          </div>
        </div>

        {/* About Tab */}
        {activeTab === 'about' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white shadow rounded-lg"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Hakkımda İçeriği</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    value={aboutContent.name}
                    onChange={(e) => handleAboutChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profil Fotoğrafı
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Profil fotoğrafı yükleyin
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Fotoğraf Seç
                    </button>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Biyografi
                  </label>
                  <button
                    onClick={addBioParagraph}
                    className="text-sm text-black hover:text-gray-600"
                  >
                    Paragraf Ekle
                  </button>
                </div>
                {aboutContent.bio.map((paragraph, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Paragraf {index + 1}</span>
                      {aboutContent.bio.length > 1 && (
                        <button
                          onClick={() => removeBioParagraph(index)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Sil
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={3}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                      value={paragraph}
                      onChange={(e) => handleBioChange(index, e.target.value)}
                      placeholder="Paragraf içeriği..."
                    />
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Yetenekler
                  </label>
                  <button
                    onClick={addSkill}
                    className="text-sm text-black hover:text-gray-600"
                  >
                    Yetenek Ekle
                  </button>
                </div>
                <div className="space-y-4">
                  {aboutContent.skills.map((skill, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Yetenek Adı
                        </label>
                        <input
                          type="text"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                          value={skill.name}
                          onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                          placeholder="Örn: UI/UX Design"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Yüzde (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                          value={skill.percentage}
                          onChange={(e) => handleSkillChange(index, 'percentage', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <button
                          onClick={() => removeSkill(index)}
                          className="w-full inline-flex items-center justify-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white shadow rounded-lg"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">İletişim İçeriği</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="contactTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  id="contactTitle"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  value={contactContent.title}
                  onChange={(e) => handleContactChange('title', e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="contactDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  id="contactDescription"
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  value={contactContent.description}
                  onChange={(e) => handleContactChange('description', e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="formTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Form Başlığı
                </label>
                <input
                  type="text"
                  id="formTitle"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  value={contactContent.formTitle}
                  onChange={(e) => handleContactChange('formTitle', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="nameField" className="block text-sm font-medium text-gray-700 mb-2">
                    İsim Alanı Etiketi
                  </label>
                  <input
                    type="text"
                    id="nameField"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    value={contactContent.formFields.name}
                    onChange={(e) => handleContactChange('formFields', { ...contactContent.formFields, name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="emailField" className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta Alanı Etiketi
                  </label>
                  <input
                    type="text"
                    id="emailField"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    value={contactContent.formFields.email}
                    onChange={(e) => handleContactChange('formFields', { ...contactContent.formFields, email: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="messageField" className="block text-sm font-medium text-gray-700 mb-2">
                    Mesaj Alanı Etiketi
                  </label>
                  <input
                    type="text"
                    id="messageField"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    value={contactContent.formFields.message}
                    onChange={(e) => handleContactChange('formFields', { ...contactContent.formFields, message: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="submitText" className="block text-sm font-medium text-gray-700 mb-2">
                  Gönder Butonu Metni
                </label>
                <input
                  type="text"
                  id="submitText"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  value={contactContent.submitText}
                  onChange={(e) => handleContactChange('submitText', e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
