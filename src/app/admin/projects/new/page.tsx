'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, Upload, X } from 'lucide-react'

interface Project {
  _id: string
  title: string
  slug: { current: string }
  shortDescription: string
  fullDescription?: string
  role: string
  backgroundColor: string
  date: string
  status: 'draft' | 'published'
  coverImage?: string
  gallery?: string[]
  externalLink?: string
  views?: number
}

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
    if (typeof window === 'undefined') return
    
    const auth = localStorage.getItem('adminAuth')
    if (!auth) {
      window.location.href = '/admin'
      return
    }
    
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
        coverImage: project.coverImage,
        gallery: project.gallery,
        externalLink: project.externalLink,
        views: project.views
      }
      
      // Get existing projects and add new one
      const existingProjects = JSON.parse(localStorage.getItem('portfolio_projects') || '[]')
      const updatedProjects = [...existingProjects, newProject]
      
      // Save to localStorage
      localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects))
      
      alert('Proje başarıyla kaydedildi!')
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
        coverImage: project.coverImage,
        gallery: project.gallery,
        externalLink: project.externalLink,
        views: project.views
      }
      
      // Get existing projects and add new one
      const existingProjects = JSON.parse(localStorage.getItem('portfolio_projects') || '[]')
      const updatedProjects = [...existingProjects, newProject]
      
      // Save to localStorage
      localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects))
      
      alert('Proje başarıyla yayınlandı!')
      window.location.href = '/admin/projects'
    } catch (error) {
      console.error('Error publishing project:', error)
      alert('Proje yayınlanırken bir hata oluştu!')
    }
    
    setIsLoading(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/admin/projects"
                className="mr-4 text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-bold">Yeni Proje</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveProject}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                Taslak Kaydet
              </button>
              <button
                onClick={handlePublishProject}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
          className="bg-gray-900 rounded-lg p-8"
        >
          <h2 className="text-xl font-medium text-white mb-6">Proje Bilgileri</h2>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Proje Başlığı *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="block w-full px-3 py-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={project.title}
                  onChange={handleInputChange}
                  placeholder="Örn: Brutalist Brand Identity"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  required
                  className="block w-full px-3 py-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={project.slug}
                  onChange={handleInputChange}
                  placeholder="brutalist-brand-identity"
                />
              </div>
            </div>

            <div>
              <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-300 mb-2">
                Kısa Açıklama *
              </label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                rows={3}
                required
                className="block w-full px-3 py-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={project.shortDescription}
                onChange={handleInputChange}
                placeholder="Projenin kısa açıklaması..."
              />
            </div>

            <div>
              <label htmlFor="fullDescription" className="block text-sm font-medium text-gray-300 mb-2">
                Detaylı Açıklama
              </label>
              <textarea
                id="fullDescription"
                name="fullDescription"
                rows={6}
                className="block w-full px-3 py-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={project.fullDescription}
                onChange={handleInputChange}
                placeholder="Projenin detaylı açıklaması..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                  Rol *
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  required
                  className="block w-full px-3 py-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={project.role}
                  onChange={handleInputChange}
                  placeholder="Örn: Art Direction / Brand Design"
                />
              </div>

              <div>
                <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-300 mb-2">
                  Arka Plan Rengi
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="backgroundColor"
                    name="backgroundColor"
                    className="h-12 w-20 border border-gray-600 rounded cursor-pointer"
                    value={project.backgroundColor}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    className="flex-1 px-3 py-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={project.backgroundColor}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
                  Tarih
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="block w-full px-3 py-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={project.date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="externalLink" className="block text-sm font-medium text-gray-300 mb-2">
                Dış Bağlantı (İsteğe Bağlı)
              </label>
              <input
                type="url"
                id="externalLink"
                name="externalLink"
                className="block w-full px-3 py-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={project.externalLink}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                Durum
              </label>
              <select
                id="status"
                name="status"
                className="block w-full px-3 py-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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