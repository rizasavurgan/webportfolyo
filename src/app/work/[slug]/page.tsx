'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Navigation from '@/components/Navigation'

// Mock data - will be replaced with Sanity CMS data
const mockProject = {
  _id: '1',
  title: 'Brutalist Brand Identity',
  slug: { current: 'brutalist-brand-identity' },
  shortDescription: 'A bold and uncompromising brand identity system for a contemporary art gallery.',
  fullDescription: [
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'This project explores the intersection of brutalist design principles and contemporary brand identity. The challenge was to create a visual system that would stand out in the competitive art world while maintaining accessibility and functionality.',
        },
      ],
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'The solution involved developing a modular typography system, a bold color palette, and a flexible grid system that could adapt to various applications from digital platforms to physical installations.',
        },
      ],
    },
  ],
  role: 'Art Direction / Brand Design',
  coverImage: {
    asset: {
      _ref: 'image-1',
      _type: 'reference'
    }
  },
  gallery: [
    {
      asset: {
        _ref: 'image-1',
        _type: 'reference'
      }
    },
    {
      asset: {
        _ref: 'image-2',
        _type: 'reference'
      }
    },
    {
      asset: {
        _ref: 'image-3',
        _type: 'reference'
      }
    },
  ],
  backgroundColor: '#FFD700',
  date: '2024-01-15',
  externalLink: 'https://example.com',
}

interface ProjectDetailPageProps {
  params: {
    slug: string
  }
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
        <div className="container mx-auto px-8 py-6">
          <Link
            href="/work"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Work</span>
          </Link>
        </div>
      </motion.div>

      <div className="container mx-auto px-8 py-12">
        {/* Cover Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative overflow-hidden rounded-lg">
            <div 
              className="w-full h-96 lg:h-[500px] flex items-center justify-center text-white font-bold text-4xl"
              style={{ backgroundColor: mockProject.backgroundColor || '#f3f4f6' }}
            >
              {mockProject.title}
            </div>
          </div>
        </motion.div>

        {/* Project Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16"
        >
          <div className="lg:col-span-2">
            <h1 className="text-4xl lg:text-6xl text-brutal text-black leading-none mb-6">
              {mockProject.title}
            </h1>
            
            <div className="prose prose-lg max-w-none">
              {mockProject.fullDescription.map((block, index) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                  {block.children[0].text}
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Role
              </h3>
              <p className="text-gray-900 font-medium">
                {mockProject.role}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Date
              </h3>
              <p className="text-gray-900 font-medium">
                {formatDate(mockProject.date)}
              </p>
            </div>

            {mockProject.externalLink && (
              <div>
                <a
                  href={mockProject.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  <span className="font-medium">View Project</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </motion.div>

        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-8"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            Project Gallery
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mockProject.gallery.map((image, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg">
                <div 
                  className="w-full h-64 lg:h-80 flex items-center justify-center text-gray-500 font-medium hover:scale-105 transition-transform duration-300"
                  style={{ backgroundColor: mockProject.backgroundColor || '#f3f4f6' }}
                >
                  {mockProject.title} - Image {index + 1}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 pt-8 border-t border-gray-200"
        >
          <div className="flex justify-between items-center mb-8">
            <Link
              href="/work"
              className="text-gray-600 hover:text-black transition-colors duration-200"
            >
              ← All Projects
            </Link>
            
            <div className="text-sm text-gray-500">
              Next: Typography Experiment →
            </div>
          </div>
          
          <Navigation />
        </motion.div>
      </div>
    </div>
  )
}
