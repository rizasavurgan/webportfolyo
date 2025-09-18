'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye, Upload, X } from 'lucide-react'
import { getProjects, saveProjects, Project, initializeData } from '@/lib/data'

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [project, setProject] = useState<Project & { coverImage: string; gallery: string[] } | null>(null)

  useEffect(() => {
    // Wait for client-side hydration
    if (typeof window === 'undefined') return
    
    const auth = localStorage.getItem('adminAuth')
    if (!auth) {
      window.location.href = '/admin'
      return
    }
    setIsAuthenticated(true)

    // Load project data
    const loadData = async () => {
      try {
        // Initialize data if not exists
        initializeData()
        
        const projects = getProjects()
        const foundProject = projects.find(p => p._id === projectId)
        
        if (!foundProject) {
          alert('Proje bulunamadı!')
          router.push('/admin/projects')
          return
        }

        setProject({
          ...foundProject,
          coverImage: typeof foundProject.coverImage === 'string' 
            ? foundProject.coverImage 
            : foundProject.coverImage?.asset?._ref || '',
          gallery: foundProject.gallery || []
        } as Project & { coverImage: string; gallery: string[] })
      } catch (error) {
        console.error('Error loading project:', error)
        alert('Proje yüklenirken bir hata oluştu!')
        router.push('/admin/projects')
      }
    }

    loadData()
  }, [projectId, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!project) return
    
    const { name, value } = e.target
    setProject(prev => prev ? ({
      ...prev,
      [name]: value
    }) : null)
  }

  const handleSaveProject = async () => {
    if (!project) return

    if (!project.title || !project.slug?.current || !project.shortDescription || !project.role) {
      alert('Lütfen tüm zorunlu alanları doldurun!')
      return
    }

    // Görsel zorunluluğu kaldırıldı

    setIsLoading(true)
    
    try {
      // Update project object
      const updatedProject: Project = {
        ...project,
        coverImage: project.coverImage ? {
          asset: {
            _ref: project.coverImage,
            _type: 'reference'
          }
        } : undefined,
        gallery: project.gallery || []
      }
      
      // Get existing projects and update the specific one
      const existingProjects = getProjects()
      const updatedProjects = existingProjects.map(p => 
        p._id === projectId ? updatedProject : p
      )
      
      // Save to localStorage
      saveProjects(updatedProjects)
      
      // Dispatch custom event to notify other tabs
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('dataUpdated'))
      }
      
      alert('Proje başarıyla güncellendi!')
      router.push('/admin/projects')
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Proje güncellenirken bir hata oluştu!')
    }
    
    setIsLoading(false)
  }

  const handlePublishProject = async () => {
    if (!project) return

    if (!project.title || !project.slug?.current || !project.shortDescription || !project.role) {
      alert('Lütfen tüm zorunlu alanları doldurun!')
      return
    }

    // Görsel zorunluluğu kaldırıldı

    setIsLoading(true)
    
    try {
      // Update project object with published status
      const updatedProject: Project = {
        ...project,
        status: 'published',
        coverImage: project.coverImage ? {
          asset: {
            _ref: project.coverImage,
            _type: 'reference'
          }
        } : undefined,
        gallery: project.gallery || []
      }
      
      // Get existing projects and update the specific one
      const existingProjects = getProjects()
      const updatedProjects = existingProjects.map(p => 
        p._id === projectId ? updatedProject : p
      )
      
      // Save to localStorage
      saveProjects(updatedProjects)
      
      // Dispatch custom event to notify other tabs
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('dataUpdated'))
      }
      
      alert('Proje başarıyla yayınlandı!')
      router.push('/admin/projects')
    } catch (error) {
      console.error('Error publishing project:', error)
      alert('Proje yayınlanırken bir hata oluştu!')
    }
    
    setIsLoading(false)
  }

  if (!isAuthenticated) {
    return <div>Yükleniyor...</div>
  }

  if (!project) {
    return <div>Proje yükleniyor...</div>
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
              <h1 className="text-2xl font-bold text-gray-900">Proje Düzenle</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveProject}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                Değişiklikleri Kaydet
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
                  value={project.slug?.current || ''}
                  onChange={(e) => setProject(prev => prev ? ({
                    ...prev,
                    slug: { current: e.target.value }
                  }) : null)}
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
                value={project.fullDescription || ''}
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
                value={project.externalLink || ''}
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
                        onClick={() => setProject(prev => prev ? ({ ...prev, coverImage: '' }) : null)}
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
                        setProject(prev => prev ? ({ ...prev, coverImage: e.target?.result as string }) : null)
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
              {project.gallery && project.gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {project.gallery.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Galeri ${index + 1}`} 
                        className="h-24 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newGallery = project.gallery.filter((_, i) => i !== index)
                          setProject(prev => prev ? ({ ...prev, gallery: newGallery }) : null)
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
                  {project.gallery?.length || 0} görsel yüklendi
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Birden fazla görsel seçebilirsiniz
                </p>
                <button
                  type="button"
                  onClick={() => document.getElementById('gallery-upload')?.click()}
                  disabled={(project.gallery?.length || 0) >= 20}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {(project.gallery?.length || 0) === 0 ? 'Görselleri Seç' : 'Daha Fazla Ekle'}
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
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          setProject(prev => prev ? ({ 
                            ...prev, 
                            gallery: [...(prev.gallery || []), e.target?.result as string]
                          }) : null)
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
