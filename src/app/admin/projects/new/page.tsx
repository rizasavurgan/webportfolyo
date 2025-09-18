'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, Upload, X } from 'lucide-react'
import { getProjects, saveProjects, Project, initializeData } from '@/lib/data'

export default function NewProjectPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [project, setProject] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    role: '',
    backgroundColor: '#FFD700',
    date: new Date().toISOString().split('T')[0],
    status: 'draft' as 'draft' | 'published',
    coverImage: '',
    gallery: [] as string[],
    externalLink: '',
    views: 0
  })

  useEffect(() => {
    // Wait for client-side hydration
    if (typeof window === 'undefined') return
    
    const auth = localStorage.getItem('adminAuth')
    if (!auth) {
      window.location.href = '/admin'
      return
    }
    
    // Initialize data if not exists
    initializeData()
    
    setIsAuthenticated(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProject(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setProject(prev => ({
        ...prev,
        slug: slug
      }))
    }
  }

  const handleSaveProject = async () => {
    if (!project.title || !project.slug || !project.shortDescription || !project.role) {
      alert('Lütfen tüm zorunlu alanları doldurun!')
      return
    }

    setIsLoading(true)
    
    try {
      // Generate unique ID
      const newId = Date.now().toString()
      
      // Create project object
      const newProject: Project = {
        _id: newId,
        title: project.title,
        slug: { current: project.slug },
        shortDescription: project.shortDescription,
        fullDescription: project.fullDescription,
        role: project.role,
        backgroundColor: project.backgroundColor,
        date: project.date,
        status: project.status,
        coverImage: project.coverImage ? {
          asset: {
            _ref: project.coverImage,
            _type: 'reference'
          }
        } : undefined,
        gallery: project.gallery,
        externalLink: project.externalLink,
        views: project.views
      }
      
      // Get existing projects and add new one
      const existingProjects = getProjects()
      const updatedProjects = [...existingProjects, newProject]
      
      // Save to localStorage with quota checking
      const success = saveProjects(updatedProjects)
      
      if (!success) {
        alert('Storage quota exceeded! Please clean up old data or reduce image sizes.')
        setIsLoading(false)
        return
      }
      
      // Dispatch custom event to notify other tabs
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('dataUpdated'))
        // Also try to refresh other tabs
        localStorage.setItem('refreshSite', Date.now().toString())
      }
      
      alert('Proje başarıyla kaydedildi!\n\nSite sayfasını yenilemek için:\n1. Site sekmesine geçin\n2. Sayfayı yenileyin (F5)\n3. Yeni projeyi göreceksiniz!')
      window.location.href = '/admin/projects'
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Proje kaydedilirken bir hata oluştu!')
    }
    
    setIsLoading(false)
  }

  const handlePublishProject = async () => {
    if (!project.title || !project.slug || !project.shortDescription || !project.role) {
      alert('Lütfen tüm zorunlu alanları doldurun!')
      return
    }

    setIsLoading(true)
    
    try {
      // Generate unique ID
      const newId = Date.now().toString()
      
      // Create project object with published status
      const newProject: Project = {
        _id: newId,
        title: project.title,
        slug: { current: project.slug },
        shortDescription: project.shortDescription,
        fullDescription: project.fullDescription,
        role: project.role,
        backgroundColor: project.backgroundColor,
        date: project.date,
        status: 'published',
        coverImage: project.coverImage ? {
          asset: {
            _ref: project.coverImage,
            _type: 'reference'
          }
        } : undefined,
        gallery: project.gallery,
        externalLink: project.externalLink,
        views: project.views
      }
      
      // Get existing projects and add new one
      const existingProjects = getProjects()
      const updatedProjects = [...existingProjects, newProject]
      
      // Save to localStorage with quota checking
      const success = saveProjects(updatedProjects)
      
      if (!success) {
        alert('Storage quota exceeded! Please clean up old data or reduce image sizes.')
        setIsLoading(false)
        return
      }
      
      // Dispatch custom event to notify other tabs
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('dataUpdated'))
        // Also try to refresh other tabs
        localStorage.setItem('refreshSite', Date.now().toString())
      }
      
      alert('Proje başarıyla yayınlandı!\n\nSite sayfasını yenilemek için:\n1. Site sekmesine geçin\n2. Sayfayı yenileyin (F5)\n3. Yeni projeyi göreceksiniz!')
      window.location.href = '/admin/projects'
    } catch (error) {
      console.error('Error publishing project:', error)
      alert('Proje yayınlanırken bir hata oluştu!')
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
                href="/admin/projects"
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Yeni Proje</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveProject}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                Taslak Kaydet
              </button>
              <button
                onClick={handlePublishProject}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                Yayınla
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white shadow rounded-lg"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Proje Bilgileri</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Proje Başlığı *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  value={project.title}
                  onChange={handleInputChange}
                  placeholder="Örn: Brutalist Brand Identity"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  value={project.slug}
                  onChange={handleInputChange}
                  placeholder="brutalist-brand-identity"
                />
              </div>
            </div>

            <div>
              <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Kısa Açıklama *
              </label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                rows={3}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                value={project.shortDescription}
                onChange={handleInputChange}
                placeholder="Projenin kısa açıklaması..."
              />
            </div>

            <div>
              <label htmlFor="fullDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Detaylı Açıklama
              </label>
              <textarea
                id="fullDescription"
                name="fullDescription"
                rows={6}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                value={project.fullDescription}
                onChange={handleInputChange}
                placeholder="Projenin detaylı açıklaması..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Rol *
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  value={project.role}
                  onChange={handleInputChange}
                  placeholder="Örn: Art Direction / Brand Design"
                />
              </div>

              <div>
                <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700 mb-2">
                  Arka Plan Rengi
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="backgroundColor"
                    name="backgroundColor"
                    className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                    value={project.backgroundColor}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    value={project.backgroundColor}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Tarih
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  value={project.date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="externalLink" className="block text-sm font-medium text-gray-700 mb-2">
                Dış Bağlantı (İsteğe Bağlı)
              </label>
              <input
                type="url"
                id="externalLink"
                name="externalLink"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                value={project.externalLink}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kapak Görseli
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {project.coverImage ? (
                  <div className="space-y-4">
                    <img 
                      src={project.coverImage} 
                      alt="Kapak görseli" 
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <div className="flex justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setProject(prev => ({ ...prev, coverImage: '' }))}
                        className="inline-flex items-center px-3 py-1 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Kaldır
                      </button>
                      <button
                        type="button"
                        onClick={() => document.getElementById('cover-upload')?.click()}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Değiştir
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Görsel yüklemek için tıklayın
                    </p>
                    <button
                      type="button"
                      onClick={() => document.getElementById('cover-upload')?.click()}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Görsel Seç
                    </button>
                  </div>
                )}
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (e) => {
                        setProject(prev => ({ ...prev, coverImage: e.target?.result as string }))
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </div>
            </div>

            {/* Gallery Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Galeri Görselleri
              </label>
              
              {/* Current Gallery Images */}
              {project.gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {project.gallery.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Galeri ${index + 1}`} 
                        className="h-24 w-full object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          console.error('Görsel yüklenemedi:', image)
                          e.currentTarget.style.display = 'none'
                        }}
                        onLoad={() => {
                          console.log('Görsel başarıyla yüklendi:', index + 1)
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newGallery = project.gallery.filter((_, i) => i !== index)
                          setProject(prev => ({ ...prev, gallery: newGallery }))
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  {project.gallery.length} görsel yüklendi
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Birden fazla görsel seçebilirsiniz
                </p>
                <button
                  type="button"
                  onClick={() => document.getElementById('gallery-upload')?.click()}
                  disabled={project.gallery.length >= 20}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {project.gallery.length === 0 ? 'Görselleri Seç' : 'Daha Fazla Ekle'}
                </button>
                <input
                  id="gallery-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    if (files.length > 0) {
                      files.forEach(file => {
                        // Dosya tipini kontrol et
                        if (!file.type.startsWith('image/')) {
                          alert('Lütfen sadece görsel dosyaları seçin!')
                          return
                        }
                        
                        // Dosya boyutunu kontrol et (5MB limit)
                        if (file.size > 5 * 1024 * 1024) {
                          alert('Görsel dosyası çok büyük! Maksimum 5MB olmalı.')
                          return
                        }
                        
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          const result = e.target?.result as string
                          if (result) {
                            console.log('Görsel yüklendi:', file.name, 'Boyut:', result.length)
                            setProject(prev => ({ 
                              ...prev, 
                              gallery: [...prev.gallery, result]
                            }))
                          }
                        }
                        reader.onerror = () => {
                          console.error('Görsel yüklenirken hata oluştu:', file.name)
                          alert('Görsel yüklenirken hata oluştu!')
                        }
                        reader.readAsDataURL(file)
                      })
                    }
                  }}
                />
              </div>
              
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Durum
              </label>
              <select
                id="status"
                name="status"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                value={project.status}
                onChange={handleInputChange}
              >
                <option value="draft">Taslak</option>
                <option value="published">Yayında</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
