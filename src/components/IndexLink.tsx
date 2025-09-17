'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function IndexLink() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  if (isHomePage) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-8 right-8 z-50"
    >
      <Link href="/" className="group">
        <motion.div
          className="text-lg font-bold text-gray-600 hover:text-black transition-colors duration-200"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          Index
        </motion.div>
      </Link>
    </motion.div>
  )
}
