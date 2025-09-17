'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import SocialLinks from '@/components/SocialLinks'
import ProjectCard from '@/components/ProjectCard'
import OverlayText from '@/components/OverlayText'

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
]

const mockSocialLinks = [
  { platform: 'instagram', url: 'https://instagram.com/rizasavurgan' },
  { platform: 'behance', url: 'https://behance.net/rizasavurgan' },
  { platform: 'linkedin', url: 'https://linkedin.com/in/rizasavurgan' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Overlay Text */}
      <OverlayText text="CASE STUDIES" className="top-20 right-10" />
      <OverlayText text="GRAPHIC" className="bottom-20 left-10" />
      
      <div className="flex min-h-screen">
        {/* Left Fixed Column */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between">
          <div className="space-y-8">
            {/* Intro Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h1 className="text-4xl lg:text-6xl xl:text-7xl text-brutal text-black leading-none">
                Rıza is a designer based in Istanbul.
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 font-medium">
                Currently freelancing for a bit ;)
              </p>
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Navigation />
            </motion.div>
          </div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <SocialLinks links={mockSocialLinks} />
          </motion.div>
        </div>

        {/* Right Scrollable Column */}
        <div className="hidden lg:block w-1/2 overflow-y-auto">
          <div className="p-8 lg:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Featured Work
              </h2>
              
              <div className="grid gap-8">
                {mockProjects.map((project, index) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-8"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Work
          </h2>
          
          <div className="grid gap-6">
            {mockProjects.map((project, index) => (
              <ProjectCard
                key={project._id}
                project={project}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
