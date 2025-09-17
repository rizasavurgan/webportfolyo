'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface ProjectCardProps {
  project: {
    _id: string
    title: string
    slug: { current: string }
    shortDescription: string
    role?: string
    coverImage?: {
      asset?: {
        _ref: string
        _type: string
      }
    } | string
    backgroundColor?: string
    date: string
    gallery?: string[]
  }
  index: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/work/${project.slug.current}`}>
        <div 
          className="folder-card cursor-pointer"
          style={{ 
            backgroundColor: project.backgroundColor || '#ffffff' 
          }}
        >
          <div className="p-6">
            <div className="relative mb-4 overflow-hidden rounded-lg">
              {project.gallery && project.gallery.length > 0 ? (
                        <div className="w-full h-48 relative overflow-hidden rounded-lg">
                          <Image 
                            src={project.gallery[0]} 
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={() => {
                              console.error('Proje görseli yüklenemedi:', project.title)
                            }}
                            onLoad={() => {
                              console.log('Proje görseli yüklendi:', project.title)
                            }}
                          />
                  <div className="hidden absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 font-medium">
                    {project.title}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                </div>
              ) : (
                <div 
                  className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 font-medium"
                  style={{ backgroundColor: project.backgroundColor || '#f3f4f6' }}
                >
                  {project.title}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {project.title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {project.shortDescription}
              </p>
              
              {project.role && (
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {project.role}
                </p>
              )}
              
              <p className="text-xs text-gray-400">
                {formatDate(project.date)}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
