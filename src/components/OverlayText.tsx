'use client'

import { motion } from 'framer-motion'

interface OverlayTextProps {
  text: string
  className?: string
}

export default function OverlayText({ text, className = '' }: OverlayTextProps) {
  return (
    <motion.div
      className={`overlay-text ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.1, scale: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      {text}
    </motion.div>
  )
}
