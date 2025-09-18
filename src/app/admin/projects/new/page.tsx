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
  coverImage?: {
    asset: {
      _ref: string
      _type: string
    }
  }
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
      const { getProjects, saveProjects } = await import('@/lib/data')
      const existingProjects = await getProjects()
      const updatedProjects = [...existingProjects, newProject]

      // Save to JSON file
      const success = await saveProjects(updatedProjects)

      if (!success) {
        alert('Proje kaydedilirken bir hata oluştu!')
        setIsLoading(false)
        return
      }

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
      const { getProjects, saveProjects } = await import('@/lib/data')
      const existingProjects = await getProjects()
      const updatedProjects = [...existingProjects, newProject]

      // Save to JSON file
      const success = await saveProjects(updatedProjects)

      if (!success) {
        alert('Proje yayınlanırken bir hata oluştu!')
        setIsLoading(false)
        return
      }

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
                href="/admin/projects"
                className="mr-4 text-black hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-4xl font-black tracking-wider">NEW PROJECT</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveProject}
                disabled={isLoading}
                className="inline-flex items-center px-6 py-3 border-2 border-black text-sm font-bold rounded-none text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 uppercase tracking-wide"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'SAVING...' : 'SAVE DRAFT'}
              </button>
              <button
                onClick={handlePublishProject}
                disabled={isLoading}
                className="inline-flex items-center px-6 py-3 border-2 border-transparent text-sm font-bold rounded-none text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 uppercase tracking-wide"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isLoading ? 'PUBLISHING...' : 'PUBLISH'}
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
          className="bg-white border-4 border-black rounded-none"
        >
          <div className="px-6 py-4 border-b-4 border-black">
            <h2 className="text-2xl font-black text-black uppercase tracking-wide">Project Information</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="block w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                  value={project.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Brutalist Brand Identity"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                  URL Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  required
                  className="block w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                  value={project.slug}
                  onChange={handleInputChange}
                  placeholder="brutalist-brand-identity"
                />
              </div>
            </div>

            <div>
              <label htmlFor="shortDescription" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                Short Description *
              </label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                rows={3}
                required
                className="block w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                value={project.shortDescription}
                onChange={handleInputChange}
                placeholder="Project short description..."
              />
            </div>

            <div>
              <label htmlFor="fullDescription" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                Detailed Description
              </label>
              <textarea
                id="fullDescription"
                name="fullDescription"
                rows={6}
                className="block w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                value={project.fullDescription}
                onChange={handleInputChange}
                placeholder="Project detailed description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="role" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                  Role *
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  required
                  className="block w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                  value={project.role}
                  onChange={handleInputChange}
                  placeholder="e.g. Art Direction / Brand Design"
                />
              </div>

              <div>
                <label htmlFor="backgroundColor" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                  Background Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="backgroundColor"
                    name="backgroundColor"
                    className="h-10 w-20 border-2 border-black rounded-none cursor-pointer bg-white"
                    value={project.backgroundColor}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    className="flex-1 px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                    value={project.backgroundColor}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="block w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                  value={project.date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="externalLink" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                External Link (Optional)
              </label>
              <input
                type="url"
                id="externalLink"
                name="externalLink"
                className="block w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                value={project.externalLink}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                Cover Image
              </label>
              <div className="border-2 border-dashed border-black rounded-none p-6 text-center">
                {project.coverImage ? (
                  <div className="space-y-4">
                    <img 
                      src={project.coverImage} 
                      alt="Cover image" 
                      className="mx-auto h-32 w-32 object-cover rounded-none border-2 border-black"
                    />
                    <div className="flex justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setProject(prev => ({ ...prev, coverImage: '' }))}
                        className="inline-flex items-center px-3 py-1 border-2 border-black shadow-sm text-sm font-bold rounded-none text-black bg-white hover:bg-black hover:text-white"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => document.getElementById('cover-upload')?.click()}
                        className="inline-flex items-center px-3 py-1 border-2 border-black shadow-sm text-sm font-bold rounded-none text-black bg-white hover:bg-black hover:text-white"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Change
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-black mx-auto mb-4" />
                    <p className="text-sm text-black mb-2 font-medium">
                      Click to upload image
                    </p>
                    <button
                      type="button"
                      onClick={() => document.getElementById('cover-upload')?.click()}
                      className="inline-flex items-center px-4 py-2 border-2 border-black shadow-sm text-sm font-bold rounded-none text-black bg-white hover:bg-black hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select Image
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
              <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                Gallery Images
              </label>
              
              {/* Current Gallery Images */}
              {project.gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {project.gallery.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Gallery ${index + 1}`} 
                        className="h-24 w-full object-cover rounded-none border-2 border-black"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newGallery = project.gallery.filter((_, i) => i !== index)
                          setProject(prev => ({ ...prev, gallery: newGallery }))
                        }}
                        className="absolute -top-2 -right-2 bg-black text-white rounded-none p-1 hover:bg-gray-800 border-2 border-black"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="border-2 border-dashed border-black rounded-none p-6 text-center">
                <Upload className="h-12 w-12 text-black mx-auto mb-4" />
                <p className="text-sm text-black mb-2 font-medium">
                  {project.gallery.length} images uploaded
                </p>
                <p className="text-xs text-gray-600 mb-4">
                  You can select multiple images
                </p>
                <button
                  type="button"
                  onClick={() => document.getElementById('gallery-upload')?.click()}
                  disabled={project.gallery.length >= 20}
                  className="inline-flex items-center px-4 py-2 border-2 border-black shadow-sm text-sm font-bold rounded-none text-black bg-white hover:bg-black hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {project.gallery.length === 0 ? 'Select Images' : 'Add More'}
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
                          setProject(prev => ({ 
                            ...prev, 
                            gallery: [...prev.gallery, e.target?.result as string]
                          }))
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
              <label htmlFor="status" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="block w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                value={project.status}
                onChange={handleInputChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}