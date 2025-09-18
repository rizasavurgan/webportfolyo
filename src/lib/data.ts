// Data management utilities for admin panel and site
// Using server-side JSON files for shared data

import { promises as fs } from 'fs'
import path from 'path'

// Data directory path
const DATA_DIR = path.join(process.cwd(), 'public', 'data')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Helper function to save data to JSON files
async function saveToFile(filename: string, data: any) {
  // Check if we're on the server or client
  if (typeof window === 'undefined') {
    // Server-side: use file system
    try {
      await ensureDataDir()
      const filePath = path.join(DATA_DIR, filename)
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
      console.log(`Data saved to ${filePath}`)
      return true
    } catch (error) {
      console.error('Error saving data:', error)
      return false
    }
  } else {
    // Client-side: use API route
    try {
      const response = await fetch('/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename, data }),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to save data: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('Data saved via API:', result)
      return true
    } catch (error) {
      console.error('Error saving data via API:', error)
      return false
    }
  }
}

// Helper function to read data from JSON files
async function readFromFile<T>(filename: string, defaultValue: T): Promise<T> {
  // Check if we're on the server or client
  if (typeof window === 'undefined') {
    // Server-side: use file system
    try {
      await ensureDataDir()
      const filePath = path.join(DATA_DIR, filename)
      const data = await fs.readFile(filePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.log(`File ${filename} not found, using default data`)
      return defaultValue
    }
  } else {
    // Client-side: use fetch
    try {
      const response = await fetch(`/data/${filename}`)
      if (!response.ok) {
        console.log(`File ${filename} not found, using default data`)
        return defaultValue
      }
      return await response.json()
    } catch (error) {
      console.log(`Error loading ${filename}, using default data`)
      return defaultValue
    }
  }
}

export interface Project {
  _id: string
  title: string
  slug: { current: string }
  shortDescription: string
  fullDescription?: string
  role: string
  backgroundColor: string
  date: string
  status: 'draft' | 'published'
  coverImage?: {
    asset: {
      _ref: string
      _type: string
    }
  }
  gallery?: string[]
  externalLink?: string
  views?: number
}

export interface SiteSettings {
  siteTitle: string
  siteDescription: string
  logo: string
  footerText: string
  socialLinks: Array<{
    platform: string
    url: string
  }>
  contactInfo: {
    email: string
    phone: string
    location: string
  }
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string
  }
}

export interface AboutContent {
  name: string
  bio: string[]
  profileImage: string
  skills: Array<{
    name: string
    level: number
  }>
  experience: Array<{
    title: string
    company: string
    period: string
    description: string
  }>
  education: Array<{
    degree: string
    school: string
    year: string
  }>
}

// Get projects data
export async function getProjects(): Promise<Project[]> {
  return await readFromFile('projects.json', [])
}

// Save projects data
export async function saveProjects(projects: Project[]): Promise<boolean> {
  return await saveToFile('projects.json', projects)
}

// Get site settings
export async function getSiteSettings(): Promise<SiteSettings> {
  const defaultSettings: SiteSettings = {
    siteTitle: 'Rıza Savurgan',
    siteDescription: 'Designer & Developer based in Istanbul',
    logo: '',
    footerText: '© 2024 Rıza Savurgan. All rights reserved.',
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/rizasavurgan' },
      { platform: 'Behance', url: 'https://behance.net/rizasavurgan' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/rizasavurgan' },
      { platform: 'Twitter', url: 'https://twitter.com/rizasavurgan' }
    ],
    contactInfo: {
      email: 'hello@rizasavurgan.com',
      phone: '+90 555 123 45 67',
      location: 'Istanbul, Turkey'
    },
    seo: {
      metaTitle: 'Rıza Savurgan - Designer',
      metaDescription: 'Brutalist and typography-focused portfolio of Rıza Savurgan, a designer based in Istanbul.',
      keywords: 'designer, portfolio, brutalist, typography, istanbul, freelance'
    }
  }

  return await readFromFile('site-settings.json', defaultSettings)
}

// Save site settings
export async function saveSiteSettings(settings: SiteSettings): Promise<boolean> {
  return await saveToFile('site-settings.json', settings)
}

// Get about content
export async function getAboutContent(): Promise<AboutContent> {
  const defaultContent: AboutContent = {
    name: 'Rıza Savurgan',
    bio: [
      'I am a designer based in Istanbul, specializing in brutalist design principles and typography-focused solutions. With over 5 years of experience in the creative industry, I have worked with clients ranging from startups to established brands.',
      'My approach to design is rooted in the belief that form should follow function, but not at the expense of visual impact. I create bold, uncompromising designs that challenge conventional aesthetics while maintaining usability and accessibility.',
      'Currently, I am freelancing and open to new projects that push the boundaries of design. I believe in the power of design to communicate complex ideas and create meaningful connections between brands and their audiences.'
    ],
    profileImage: '',
    skills: [
      { name: 'Brand Identity', level: 95 },
      { name: 'Typography', level: 90 },
      { name: 'Web Design', level: 85 },
      { name: 'Art Direction', level: 88 },
      { name: 'UI/UX Design', level: 82 },
      { name: 'Editorial Design', level: 80 }
    ],
    experience: [
      {
        title: 'Senior Designer',
        company: 'Creative Studio Istanbul',
        period: '2020-2024',
        description: 'Led design projects for major brands, focusing on brand identity and digital experiences.'
      },
      {
        title: 'Freelance Designer',
        company: 'Self-Employed',
        period: '2019-Present',
        description: 'Working with various clients on brand identity, web design, and print projects.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Fine Arts',
        school: 'Istanbul University',
        year: '2019'
      }
    ]
  }

  return await readFromFile('about-content.json', defaultContent)
}

// Save about content
export async function saveAboutContent(content: AboutContent): Promise<boolean> {
  return await saveToFile('about-content.json', content)
}

// Get project by slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const projects = await getProjects()
    const project = projects.find(p => p.slug?.current === slug)
    return project || null
  } catch (error) {
    console.error('Error loading project by slug:', error)
    return null
  }
}

// Initialize data if not exists
export function initializeData() {
  // This function is kept for compatibility but doesn't do anything
  // since we're using JSON files now
}