'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Plus, 
  FolderOpen, 
  Settings, 
  FileText, 
  LogOut,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

interface Project {
  _id: string
  title: string
  slug: { current: string }
  shortDescription: string
  status: 'draft' | 'published'
  date: string
  views?: number
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])

  // Authentication check
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      loadProjects()
    } else {
      window.location.href = '/admin'
    }
    
    setIsLoading(false)
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

  const logout = () => {
    localStorage.removeItem('adminAuth')
    window.location.href = '/admin'
  }

  const deleteProject = (id: string) => {
    if (confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      const updatedProjects = projects.filter(project => project._id !== id)
      localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects))
      setProjects(updatedProjects)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-4xl font-black tracking-wider">ADMIN PANEL</h1>
              <p className="text-gray-600 font-medium mt-1">Portfolio Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center px-6 py-3 border-2 border-black text-sm font-bold rounded-none text-black hover:bg-black hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 uppercase tracking-wide"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Link>
              <button
                onClick={logout}
                className="inline-flex items-center px-6 py-3 border-2 border-black text-sm font-bold rounded-none text-black hover:bg-black hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 uppercase tracking-wide"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white border-4 border-black rounded-none p-6">
            <div className="flex items-center">
              <FolderOpen className="h-8 w-8 text-black" />
              <div className="ml-4">
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Total Projects</p>
                <p className="text-3xl font-black text-black">{projects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-black rounded-none p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-black" />
              <div className="ml-4">
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Published</p>
                <p className="text-3xl font-black text-black">
                  {projects.filter(p => p.status === 'published').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-black rounded-none p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-black" />
              <div className="ml-4">
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Drafts</p>
                <p className="text-3xl font-black text-black">
                  {projects.filter(p => p.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Link
            href="/admin/projects/new"
            className="bg-white border-4 border-black rounded-none p-6 hover:bg-black hover:text-white transition-all group"
          >
            <div className="flex items-center">
              <Plus className="h-8 w-8 text-black group-hover:text-white" />
              <div className="ml-4">
                <h3 className="text-lg font-black text-black group-hover:text-white uppercase tracking-wide">New Project</h3>
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-300">Create project</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/projects"
            className="bg-white border-4 border-black rounded-none p-6 hover:bg-black hover:text-white transition-all group"
          >
            <div className="flex items-center">
              <FolderOpen className="h-8 w-8 text-black group-hover:text-white" />
              <div className="ml-4">
                <h3 className="text-lg font-black text-black group-hover:text-white uppercase tracking-wide">Projects</h3>
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-300">Manage projects</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="bg-white border-4 border-black rounded-none p-6 hover:bg-black hover:text-white transition-all group"
          >
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-black group-hover:text-white" />
              <div className="ml-4">
                <h3 className="text-lg font-black text-black group-hover:text-white uppercase tracking-wide">Settings</h3>
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-300">Site settings</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white border-4 border-black rounded-none"
        >
          <div className="px-6 py-4 border-b-4 border-black">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-black uppercase tracking-wide">Recent Projects</h3>
              <Link
                href="/admin/projects"
                className="text-sm font-bold text-black hover:text-gray-600 uppercase tracking-wide"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y-4 divide-black">
            {projects.slice(0, 5).map((project) => (
              <div key={project._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-black text-black uppercase tracking-wide">
                      {project.title}
                    </h4>
                    <div className="mt-2 flex items-center space-x-4 text-sm font-medium text-gray-600">
                      <span>Views: {project.views || 0}</span>
                      <span>•</span>
                      <span>{project.date}</span>
                      <span className={`inline-flex px-3 py-1 text-xs font-black rounded-none border-2 ${
                        project.status === 'published' 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-black border-black'
                      }`}>
                        {project.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/projects/edit/${project._id}`}
                      className="p-2 border-2 border-black rounded-none text-black hover:bg-black hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button 
                      onClick={() => deleteProject(project._id)}
                      className="p-2 border-2 border-black rounded-none text-black hover:bg-black hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="px-6 py-12 text-center">
                <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-4">No projects yet</p>
                <Link
                  href="/admin/projects/new"
                  className="inline-flex items-center px-6 py-3 border-2 border-black text-sm font-bold rounded-none text-black hover:bg-black hover:text-white uppercase tracking-wide"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Project
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}