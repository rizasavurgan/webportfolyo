import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getProjectBySlug, Project } from '@/lib/data'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params }: Props) {
  const resolvedParams = await params
  const project = await getProjectBySlug(resolvedParams.slug)

  if (!project) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Navigation */}
      <div className="lg:hidden px-8 py-6 border-b border-gray-200">
        <Navigation />
      </div>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="sticky top-0 z-10 bg-white border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/work"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Tüm Projelere Dön
            </Link>
            
            <div className="hidden lg:block">
              <Navigation />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h1 className="text-4xl lg:text-6xl xl:text-7xl text-brutal text-black leading-none mb-6">
                {project.title}
              </h1>
              
              <div className="space-y-4 text-lg text-gray-600">
                <div>
                  <span className="font-semibold text-gray-900">Rol:</span> {project.role}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Tarih:</span> {formatDate(project.date)}
                </div>
                {project.externalLink && (
                  <div>
                    <a
                      href={project.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-black hover:text-gray-600 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Projeyi İncele
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Proje Özeti</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {project.shortDescription}
                </p>
              </div>

              {project.fullDescription && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Detaylı Açıklama</h3>
                  <div className="text-gray-600 leading-relaxed space-y-4">
                    {typeof project.fullDescription === 'string' ? (
                      <p>{project.fullDescription}</p>
                    ) : (
                      <p>{project.fullDescription}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Project Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Proje Görselleri</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.gallery.map((image: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={image}
                      alt={`${project.title} - Görsel ${index + 1}`}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Project Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gray-50 rounded-lg p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Proje Türü</h3>
              <p className="text-gray-600">{project.role}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tamamlanma Tarihi</h3>
              <p className="text-gray-600">{formatDate(project.date)}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Durum</h3>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                project.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {project.status === 'published' ? 'Yayında' : 'Taslak'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}