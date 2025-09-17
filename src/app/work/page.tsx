'use client'

import { motion } from 'framer-motion'
import ProjectCard from '@/components/ProjectCard'
import OverlayText from '@/components/OverlayText'
import Navigation from '@/components/Navigation'

// Mock data - will be replaced with Sanity CMS data
const mockProjects = [
  {
    _id: '1',
    title: 'Brutalist Brand Identity',
    slug: { current: 'brutalist-brand-identity' },
    shortDescription: 'A bold and uncompromising brand identity system for a contemporary art gallery.',
    role: 'Art Direction / Brand Design',
    coverImage: {
      asset: {
        _ref: 'image-1',
        _type: 'reference'
      }
    },
    backgroundColor: '#FFD700',
    date: '2024-01-15',
  },
  {
    _id: '2',
    title: 'Typography Experiment',
    slug: { current: 'typography-experiment' },
    shortDescription: 'Exploring the boundaries of digital typography through experimental layouts.',
    role: 'Web Design / Typography',
    coverImage: {
      asset: {
        _ref: 'image-2',
        _type: 'reference'
      }
    },
    backgroundColor: '#00FF00',
    date: '2024-02-20',
  },
  {
    _id: '3',
    title: 'Minimalist Web Design',
    slug: { current: 'minimalist-web-design' },
    shortDescription: 'Clean and functional web design focusing on user experience and content hierarchy.',
    role: 'UI/UX Design',
    coverImage: {
      asset: {
        _ref: 'image-3',
        _type: 'reference'
      }
    },
    backgroundColor: '#FF6B35',
    date: '2024-03-10',
  },
  {
    _id: '4',
    title: 'Digital Art Installation',
    slug: { current: 'digital-art-installation' },
    shortDescription: 'Interactive digital art installation combining technology and traditional design principles.',
    role: 'Creative Direction / Interactive Design',
    coverImage: {
      asset: {
        _ref: 'image-4',
        _type: 'reference'
      }
    },
    backgroundColor: '#808080',
    date: '2024-04-05',
  },
  {
    _id: '5',
    title: 'Editorial Design System',
    slug: { current: 'editorial-design-system' },
    shortDescription: 'Comprehensive editorial design system for a modern lifestyle magazine.',
    role: 'Editorial Design / Art Direction',
    coverImage: {
      asset: {
        _ref: 'image-5',
        _type: 'reference'
      }
    },
    backgroundColor: '#FFD700',
    date: '2024-05-12',
  },
  {
    _id: '6',
    title: 'Mobile App Interface',
    slug: { current: 'mobile-app-interface' },
    shortDescription: 'Intuitive mobile app interface design focusing on user engagement and accessibility.',
    role: 'UI/UX Design / Mobile Design',
    coverImage: {
      asset: {
        _ref: 'image-6',
        _type: 'reference'
      }
    },
    backgroundColor: '#00FF00',
    date: '2024-06-18',
  },
]

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Overlay Text */}
      <OverlayText text="PORTFOLIO" className="top-20 right-10" />
      <OverlayText text="DESIGN" className="bottom-20 left-10" />
      
      {/* Mobile Navigation */}
      <div className="lg:hidden px-8 py-6 border-b border-gray-200">
        <Navigation />
      </div>
      
      <div className="flex min-h-screen">
        {/* Left Content Column */}
        <div className="w-full lg:w-2/3 px-8 py-12 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h1 className="text-4xl lg:text-6xl xl:text-7xl text-brutal text-black leading-none mb-6">
              Selected Work
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl">
              A collection of projects that showcase my approach to design, 
              from brand identity to digital experiences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {mockProjects.map((project, index) => (
              <ProjectCard
                key={project._id}
                project={project}
                index={index}
              />
            ))}
          </motion.div>
        </div>

        {/* Right Navigation Column */}
        <div className="hidden lg:block w-1/3 px-6 py-12 lg:py-20">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="sticky top-20"
          >
            <Navigation />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
