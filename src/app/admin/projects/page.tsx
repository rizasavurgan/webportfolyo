'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react'
import { getProjects, saveProjects, Project, initializeData } from '@/lib/data'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Wait for client-side hydration
    if (typeof window === 'undefined') return
    
    const auth = localStorage.getItem('adminAuth')
    if (!auth) {
      window.location.href = '/admin'
      return
    }
    setIsAuthenticated(true)

    // Load projects from localStorage
    const loadData = async () => {
      try {
        // Initialize data if not exists
        initializeData()

        const projectsData = getProjects()
        setProjects(projectsData)
      } catch (error) {
        console.error('Error loading projects:', error)
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDeleteProject = (id: string) => {
    if (confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      const updatedProjects = projects.filter(project => project._id !== id)
      setProjects(updatedProjects)
      saveProjects(updatedProjects)
      
      // Dispatch custom event to notify other tabs
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('dataUpdated'))
      }
    }
  }

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
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
              <h1 className="text-2xl font-bold text-gray-900">Proje Yönetimi</h1>
            </div>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Proje
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white shadow rounded-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Proje ara..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tüm Durumlar</option>
                <option value="published">Yayında</option>
                <option value="draft">Taslak</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-500">
              {filteredProjects.length} proje bulundu
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project) => (
            <div key={project._id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    project.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status === 'published' ? 'Yayında' : 'Taslak'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/work/${project.slug.current}`}
                      target="_blank"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/projects/edit/${project._id}`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {project.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4">
                  {project.shortDescription}
                </p>

                <div className="text-sm text-gray-500 mb-4">
                  <p><strong>Rol:</strong> {project.role}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Görüntülenme: {project.views || 0}</span>
                  <span>{new Date(project.date).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Plus className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Proje bulunamadı
            </h3>
            <p className="text-gray-500 mb-4">
              Arama kriterlerinize uygun proje bulunamadı.
            </p>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <Plus className="h-4 w-4 mr-2" />
              İlk Projeni Ekle
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
