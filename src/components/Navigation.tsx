'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const navItems = [
  { name: 'Index', href: '/' },
  { name: 'Work', href: '/work' },
  { name: 'Me', href: '/me' },
  { name: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <nav className={`space-y-2 lg:space-y-3 ${isHomePage ? 'text-left' : 'text-left lg:text-right'}`}>
      <div className={`${isHomePage ? 'grid grid-cols-1' : 'grid grid-cols-2 lg:grid-cols-1'} gap-4 lg:gap-0`}>
        {navItems.map((item) => {
          // Home sayfasında Index linkini gösterme
          if (isHomePage && item.name === 'Index') {
            return null
          }
          
          const isActive = pathname === item.href || (item.href === '/work' && pathname.startsWith('/work/'))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className="block group"
            >
              <motion.div
                className={`text-sm sm:text-base lg:text-lg font-semibold transition-colors duration-200 ${
                  isActive 
                    ? 'text-black' 
                    : 'text-gray-600 hover:text-black'
                }`}
                whileHover={{ x: 4 }}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    className="h-0.5 bg-black mt-1"
                    layoutId="activeIndicator"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
