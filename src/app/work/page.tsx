import { motion } from 'framer-motion'
import ProjectCard from '@/components/ProjectCard'
import OverlayText from '@/components/OverlayText'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getProjects, getSiteSettings, Project, SiteSettings } from '@/lib/data'

export default async function WorkPage() {
  // Load data server-side
  const allProjects = await getProjects()
  const publishedProjects = allProjects.filter(project => project.status === 'published')
  const siteSettings = await getSiteSettings()

  return (
    <div className="min-h-screen bg-white">
      {/* Overlay Text */}
      <OverlayText text="WORK" className="top-20 right-10" />
      <OverlayText text="PROJECTS" className="bottom-20 left-10" />
      
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
              Featured Work
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              A collection of my recent design projects and creative work.
            </p>
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {publishedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {publishedProjects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No projects available yet.</p>
                <p className="text-gray-400 text-sm mt-2">Check back soon for updates!</p>
              </div>
            )}
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

      {/* Footer */}
      <Footer />
    </div>
  )
}