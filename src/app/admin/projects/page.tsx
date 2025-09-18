'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'

interface Project {
  _id: string
  title: string
  slug: { current: string }
  shortDescription: string
  status: 'draft' | 'published'
  date: string
  views?: number
}

export default function AdminProjects() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const auth = localStorage.getItem('adminAuth')
    if (!auth) {
      window.location.href = '/admin'
      return
    }
    
    loadProjects()
    setIsAuthenticated(true)
  }, [])

  const loadProjects = async () => {
    try {
      const { getProjects } = await import('@/lib/data')
      const projectsData = await getProjects()
      setProjects(projectsData)
    } catch (error) {
      console.error('Error loading projects:', error)
      setProjects([])
    }
  }

  const deleteProject = async (id: string) => {
    if (confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      try {
        const { saveProjects } = await import('@/lib/data')
        const updatedProjects = projects.filter(project => project._id !== id)
        const success = await saveProjects(updatedProjects)
        
        if (success) {
          setProjects(updatedProjects)
        } else {
          alert('Proje silinirken bir hata oluştu!')
        }
      } catch (error) {
        console.error('Error deleting project:', error)
        alert('Proje silinirken bir hata oluştu!')
      }
    }
  }

  const toggleStatus = async (id: string) => {
    try {
      const { saveProjects } = await import('@/lib/data')
      const updatedProjects = projects.map(project => 
        project._id === id 
          ? { ...project, status: project.status === 'published' ? 'draft' : 'published' }
          : project
      )
      const success = await saveProjects(updatedProjects)
      
      if (success) {
        setProjects(updatedProjects)
      } else {
        alert('Proje durumu güncellenirken bir hata oluştu!')
      }
    } catch (error) {
      console.error('Error toggling project status:', error)
      alert('Proje durumu güncellenirken bir hata oluştu!')
    }
  }

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true
    return project.status === filter
  })

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
                ← Back
              </Link>
              <h1 className="text-4xl font-black tracking-wider">PROJECTS</h1>
            </div>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center px-6 py-3 border-2 border-black text-sm font-bold rounded-none text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 uppercase tracking-wide"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
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
          className="mb-8"
        >
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 border-2 border-black text-sm font-bold rounded-none uppercase tracking-wide ${
                filter === 'all' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black hover:bg-black hover:text-white'
              }`}
            >
              All ({projects.length})
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-6 py-3 border-2 border-black text-sm font-bold rounded-none uppercase tracking-wide ${
                filter === 'published' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black hover:bg-black hover:text-white'
              }`}
            >
              Published ({projects.filter(p => p.status === 'published').length})
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-6 py-3 border-2 border-black text-sm font-bold rounded-none uppercase tracking-wide ${
                filter === 'draft' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black hover:bg-black hover:text-white'
              }`}
            >
              Drafts ({projects.filter(p => p.status === 'draft').length})
            </button>
          </div>
        </motion.div>

        {/* Projects List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4"
        >
          {filteredProjects.length === 0 ? (
            <div className="bg-white border-4 border-black rounded-none p-12 text-center">
              <h3 className="text-xl font-black text-black mb-4 uppercase tracking-wide">No Projects Found</h3>
              <p className="text-gray-600 mb-6">Create your first project to get started.</p>
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center px-6 py-3 border-2 border-black text-sm font-bold rounded-none text-white bg-black hover:bg-gray-800 uppercase tracking-wide"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Link>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div key={project._id} className="bg-white border-4 border-black rounded-none p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-xl font-black text-black uppercase tracking-wide">
                        {project.title}
                      </h3>
                      <span className={`inline-flex px-3 py-1 text-xs font-black rounded-none border-2 ${
                        project.status === 'published' 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-black border-black'
                      }`}>
                        {project.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </div>
                    <p className="text-gray-600 font-medium mb-2">{project.shortDescription}</p>
                    <div className="flex items-center space-x-4 text-sm font-medium text-gray-500">
                      <span>Slug: {project.slug.current}</span>
                      <span>•</span>
                      <span>Date: {project.date}</span>
                      <span>•</span>
                      <span>Views: {project.views || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleStatus(project._id)}
                      className={`p-3 border-2 border-black rounded-none ${
                        project.status === 'published'
                          ? 'text-black hover:bg-black hover:text-white'
                          : 'text-black hover:bg-black hover:text-white'
                      }`}
                      title={project.status === 'published' ? 'Unpublish' : 'Publish'}
                    >
                      {project.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <Link
                      href={`/admin/projects/edit/${project._id}`}
                      className="p-3 border-2 border-black rounded-none text-black hover:bg-black hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => deleteProject(project._id)}
                      className="p-3 border-2 border-black rounded-none text-black hover:bg-black hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  )
}