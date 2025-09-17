'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  BarChart3, 
  FolderOpen, 
  Settings, 
  FileText, 
  Users, 
  Mail,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Eye
} from 'lucide-react'
import { getProjects, initializeData } from '@/lib/data'
import StorageInfo from '@/components/StorageInfo'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalMessages: 12,
    totalViews: 0,
    lastUpdate: '2 saat önce'
  })

  useEffect(() => {
    // Authentication kontrolü
    const auth = localStorage.getItem('adminAuth')
    if (!auth) {
      window.location.href = '/admin'
      return
    }
    
    setIsAuthenticated(true)

    // Load projects data
    const loadData = async () => {
      try {
        // Initialize data if not exists
        initializeData()
        
        const projectsData = getProjects()
        setProjects(projectsData)
        setStats({
          totalProjects: projectsData.length,
          totalMessages: 12,
          totalViews: projectsData.reduce((sum, project) => sum + (project.views || 0), 0),
          lastUpdate: '2 saat önce'
        })
      } catch (error) {
        console.error('Error loading projects:', error)
        setProjects([])
      }
    }

    loadData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    window.location.href = '/admin'
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
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <Eye className="h-4 w-4 mr-2" />
                Siteyi Görüntüle
              </Link>
              <button
                onClick={() => {
                  // Force refresh all site tabs
                  localStorage.setItem('refreshSite', Date.now().toString())
                  window.dispatchEvent(new CustomEvent('dataUpdated'))
                  alert('Site sayfaları yenilenmek üzere işaretlendi!\n\nEğer otomatik yenilenmezse, site sekmesine geçip F5 ile manuel yenileyin.')
                }}
                className="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm leading-4 font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                🔄 Siteyi Yenile
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Storage Info */}
        <StorageInfo />
        
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FolderOpen className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Toplam Projeler
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalProjects}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Mail className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Mesajlar
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalMessages}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Toplam Görüntülenme
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalViews.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Son Güncelleme
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.lastUpdate}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Link
            href="/admin/projects/new"
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-6 text-center">
              <Plus className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">Yeni Proje</h3>
              <p className="text-sm text-gray-500">Proje ekle</p>
            </div>
          </Link>

          <Link
            href="/admin/projects"
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-6 text-center">
              <FolderOpen className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">Projeler</h3>
              <p className="text-sm text-gray-500">Projeleri yönet</p>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-6 text-center">
              <Settings className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">Ayarlar</h3>
              <p className="text-sm text-gray-500">Site ayarları</p>
            </div>
          </Link>

          <Link
            href="/admin/content"
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-6 text-center">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">İçerik</h3>
              <p className="text-sm text-gray-500">İçerik yönetimi</p>
            </div>
          </Link>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white shadow rounded-lg"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Son Projeler</h3>
              <Link
                href="/admin/projects"
                className="text-sm text-black hover:text-gray-600"
              >
                Tümünü Gör
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {projects.slice(0, 5).map((project) => (
              <div key={project._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {project.title}
                    </h4>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Görüntülenme: {project.views || 0}</span>
                      <span>•</span>
                      <span>{project.date}</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        project.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status === 'published' ? 'Yayında' : 'Taslak'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/projects/edit/${project._id}`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button className="text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
