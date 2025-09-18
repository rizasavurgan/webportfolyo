import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import SocialLinks from '@/components/SocialLinks'
import ProjectCard from '@/components/ProjectCard'
import OverlayText from '@/components/OverlayText'
import Footer from '@/components/Footer'
import { getProjects, getSiteSettings, Project } from '@/lib/data'

export default async function Home() {
  // Load data server-side
  const allProjects = await getProjects()
  const publishedProjects = allProjects.filter(project => project.status === 'published')
  const siteSettings = await getSiteSettings()

  return (
    <div className="min-h-screen bg-white">
      {/* Overlay Text */}
      <OverlayText text="PORTFOLIO" className="top-20 right-10" />
      <OverlayText text="WORK" className="bottom-20 left-10" />
      
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
              {siteSettings.siteTitle}
            </h1>
            <p className="text-lg text-gray-600 font-medium mb-8">
              {siteSettings.siteDescription}
            </p>
            <SocialLinks links={siteSettings.socialLinks} />
          </motion.div>

          {/* Featured Work Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Work</h2>
            
            {publishedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {publishedProjects.slice(0, 4).map((project, index) => (
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

            {publishedProjects.length > 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-center pt-8"
              >
                <a
                  href="/work"
                  className="inline-flex items-center px-6 py-3 border-2 border-black text-sm font-bold rounded-none text-black hover:bg-black hover:text-white transition-all uppercase tracking-wide"
                >
                  View All Projects
                </a>
              </motion.div>
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