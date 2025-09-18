// Data management utilities for admin panel and site
// Now using JSON files for shared data instead of localStorage

// Base URL for data files
const DATA_BASE_URL = '/data'

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

// Cache for data
let projectsCache: Project[] | null = null
let siteSettingsCache: SiteSettings | null = null
let aboutContentCache: AboutContent | null = null

// Fetch data from JSON files
async function fetchData<T>(filename: string): Promise<T> {
  try {
    const response = await fetch(`${DATA_BASE_URL}/${filename}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filename}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${filename}:`, error)
    throw error
  }
}

// Get projects from JSON file
export async function getProjects(): Promise<Project[]> {
  if (projectsCache) {
    return projectsCache
  }
  
  try {
    projectsCache = await fetchData<Project[]>('projects.json')
    return projectsCache
  } catch (error) {
    console.error('Error loading projects:', error)
    return []
  }
}

// Get site settings from JSON file
export async function getSiteSettings(): Promise<SiteSettings> {
  if (siteSettingsCache) {
    return siteSettingsCache
  }
  
  try {
    siteSettingsCache = await fetchData<SiteSettings>('site-settings.json')
    return siteSettingsCache
  } catch (error) {
    console.error('Error loading site settings:', error)
    return {
      siteTitle: 'Portfolio',
      siteDescription: 'Design Portfolio',
      logo: '',
      footerText: '© 2024 Portfolio',
      socialLinks: [],
      contactInfo: {
        email: '',
        phone: '',
        location: ''
      },
      seo: {
        metaTitle: 'Portfolio',
        metaDescription: 'Design Portfolio',
        keywords: ''
      }
    }
  }
}

// Get about content from JSON file
export async function getAboutContent(): Promise<AboutContent> {
  if (aboutContentCache) {
    return aboutContentCache
  }
  
  try {
    aboutContentCache = await fetchData<AboutContent>('about-content.json')
    return aboutContentCache
  } catch (error) {
    console.error('Error loading about content:', error)
    return {
      name: 'Designer',
      bio: ['A creative designer'],
      profileImage: '',
      skills: [],
      experience: [],
      education: []
    }
  }
}

// Get project by slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects()
  return projects.find(project => project.slug.current === slug) || null
}

// Get project by ID
export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getProjects()
  return projects.find(project => project._id === id) || null
}

// Initialize data (now just clears cache)
export function initializeData(): void {
  projectsCache = null
  siteSettingsCache = null
  aboutContentCache = null
}

// Save projects (for admin panel - updates JSON file via API)
export async function saveProjects(projects: Project[]): Promise<boolean> {
  try {
    // In a real implementation, this would call an API endpoint
    // For now, we'll update the cache and localStorage as fallback
    projectsCache = projects
    
    // Update localStorage as backup
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_projects', JSON.stringify(projects))
    }
    
    return true
  } catch (error) {
    console.error('Error saving projects:', error)
    return false
  }
}

// Save site settings
export async function saveSiteSettings(settings: SiteSettings): Promise<boolean> {
  try {
    siteSettingsCache = settings
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_site_settings', JSON.stringify(settings))
    }
    
    return true
  } catch (error) {
    console.error('Error saving site settings:', error)
    return false
  }
}

// Save about content
export async function saveAboutContent(content: AboutContent): Promise<boolean> {
  try {
    aboutContentCache = content
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_about_content', JSON.stringify(content))
    }
    
    return true
  } catch (error) {
    console.error('Error saving about content:', error)
    return false
  }
}
