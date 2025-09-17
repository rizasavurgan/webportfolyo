'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

interface SocialLink {
  platform: string
  url: string
}

interface SocialLinksProps {
  links: SocialLink[]
  className?: string
}

const platformIcons: Record<string, string> = {
  instagram: 'IG',
  twitter: 'TW',
  linkedin: 'LI',
  behance: 'BE',
  dribbble: 'DR',
  github: 'GH',
}

export default function SocialLinks({ links, className = '' }: SocialLinksProps) {
  if (!links || links.length === 0) return null

  return (
    <div className={`flex space-x-4 ${className}`}>
      {links.map((link, index) => (
        <motion.a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">
            {platformIcons[link.platform] || 'LINK'}
          </span>
          <span className="text-sm font-medium capitalize">
            {link.platform}
          </span>
          <ExternalLink className="w-3 h-3" />
        </motion.a>
      ))}
    </div>
  )
}
