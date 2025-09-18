// Data management utilities for admin panel and site
// Using JSON files for shared data that everyone can see

// Base URL for data files
const DATA_BASE_URL = '/data'

// Helper function to save data to JSON files
async function saveToFile(filename: string, data: any) {
  try {
    const response = await fetch(`/api/save-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename, data }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to save data')
    }
    
    return true
  } catch (error) {
    console.error('Error saving data:', error)
    return false
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
  try {
    const response = await fetch(`${DATA_BASE_URL}/projects.json`)
    if (!response.ok) {
      return []
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading projects:', error)
    return []
  }
}

// Save projects data
export async function saveProjects(projects: Project[]): Promise<boolean> {
  return await saveToFile('projects.json', projects)
}

// Get site settings
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const response = await fetch(`${DATA_BASE_URL}/site-settings.json`)
    if (!response.ok) {
      return {
        siteTitle: 'Rıza Savurgan',
        siteDescription: 'Designer & Developer based in Istanbul',
        logo: '',
        footerText: '© 2024 Rıza Savurgan. All rights reserved.',
        socialLinks: [],
        contactInfo: {
          email: '',
          phone: '',
          location: 'Istanbul, Turkey'
        },
        seo: {
          metaTitle: 'Rıza Savurgan - Designer',
          metaDescription: 'Brutalist and typography-focused portfolio of Rıza Savurgan, a designer based in Istanbul.',
          keywords: 'designer, portfolio, brutalist, typography, istanbul, freelance'
        }
      }
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading site settings:', error)
    return {
      siteTitle: 'Rıza Savurgan',
      siteDescription: 'Designer & Developer based in Istanbul',
      logo: '',
      footerText: '© 2024 Rıza Savurgan. All rights reserved.',
      socialLinks: [],
      contactInfo: {
        email: '',
        phone: '',
        location: 'Istanbul, Turkey'
      },
      seo: {
        metaTitle: 'Rıza Savurgan - Designer',
        metaDescription: 'Brutalist and typography-focused portfolio of Rıza Savurgan, a designer based in Istanbul.',
        keywords: 'designer, portfolio, brutalist, typography, istanbul, freelance'
      }
    }
  }
}

// Save site settings
export async function saveSiteSettings(settings: SiteSettings): Promise<boolean> {
  return await saveToFile('site-settings.json', settings)
}

// Get about content
export async function getAboutContent(): Promise<AboutContent> {
  try {
    const response = await fetch(`${DATA_BASE_URL}/about-content.json`)
    if (!response.ok) {
      return {
        name: 'Rıza Savurgan',
        bio: ['Creative designer based in Istanbul', 'Specialized in brutalist design and typography'],
        profileImage: '',
        skills: [],
        experience: [],
        education: []
      }
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading about content:', error)
    return {
      name: 'Rıza Savurgan',
      bio: ['Creative designer based in Istanbul', 'Specialized in brutalist design and typography'],
      profileImage: '',
      skills: [],
      experience: [],
      education: []
    }
  }
}

// Save about content
export async function saveAboutContent(content: AboutContent): Promise<boolean> {
  return await saveToFile('about-content.json', content)
}

// Initialize data if not exists
export function initializeData() {
  // This function is kept for compatibility but doesn't do anything
  // since we're using JSON files now
}