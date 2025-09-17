// Data management utilities for admin panel and site
import { safeSetItem, STORAGE_KEYS, cleanupOldData } from './storage-utils'

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
    percentage: number
  }>
  stats: Array<{
    label: string
    value: string
  }>
}

export interface ContactContent {
  title: string
  description: string
  formTitle: string
  formFields: {
    name: string
    email: string
    message: string
  }
  submitText: string
}

// Default data
const defaultProjects: Project[] = [
  {
    _id: '1',
    title: 'Brutalist Brand Identity',
    slug: { current: 'brutalist-brand-identity' },
    shortDescription: 'A bold and uncompromising brand identity system for a contemporary art gallery.',
    fullDescription: 'This project explores the intersection of brutalist design principles and contemporary brand identity. The challenge was to create a visual system that would appeal to both traditional art enthusiasts and a younger, more digitally-savvy audience.',
    role: 'Art Direction / Brand Design',
    backgroundColor: '#FFD700',
    date: '2024-01-15',
    status: 'published',
    coverImage: {
      asset: {
        _ref: 'image-1',
        _type: 'reference'
      }
    },
    gallery: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop'
    ],
    externalLink: 'https://example.com',
    views: 450
  },
  {
    _id: '2',
    title: 'Typography Experiment',
    slug: { current: 'typography-experiment' },
    shortDescription: 'Exploring the boundaries of digital typography through experimental layouts.',
    fullDescription: 'A comprehensive exploration of how typography can be used to create emotional connections and guide user attention in digital interfaces.',
    role: 'Web Design / Typography',
    backgroundColor: '#00FF00',
    date: '2024-02-20',
    status: 'published',
    coverImage: {
      asset: {
        _ref: 'image-2',
        _type: 'reference'
      }
    },
    gallery: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop'
    ],
    externalLink: '',
    views: 230
  },
  {
    _id: '3',
    title: 'Minimalist Web Design',
    slug: { current: 'minimalist-web-design' },
    shortDescription: 'Clean and functional web design focusing on user experience and content hierarchy.',
    fullDescription: 'This project demonstrates how minimalism can be used to create powerful, user-focused web experiences that prioritize content and functionality over decoration.',
    role: 'UI/UX Design',
    backgroundColor: '#FF6B35',
    date: '2024-03-10',
    status: 'published',
    coverImage: {
      asset: {
        _ref: 'image-3',
        _type: 'reference'
      }
    },
    gallery: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop'
    ],
    externalLink: '',
    views: 570
  }
]

const defaultSiteSettings: SiteSettings = {
  siteTitle: 'Rıza Savurgan',
  siteDescription: 'Designer & Developer based in Istanbul',
  logo: '',
  footerText: '© 2024 Rıza Savurgan. All rights reserved.',
  socialLinks: [
    { platform: 'instagram', url: 'https://instagram.com/rizasavurgan' },
    { platform: 'behance', url: 'https://behance.net/rizasavurgan' },
    { platform: 'linkedin', url: 'https://linkedin.com/in/rizasavurgan' },
    { platform: 'twitter', url: 'https://twitter.com/rizasavurgan' }
  ],
  contactInfo: {
    email: 'hello@rizasavurgan.com',
    phone: '+90 555 123 45 67',
    location: 'Istanbul, Turkey'
  },
  seo: {
    metaTitle: 'Rıza Savurgan - Designer & Developer',
    metaDescription: 'Portfolio of Rıza Savurgan, a designer and developer based in Istanbul.',
    keywords: 'design, development, portfolio, istanbul, designer, developer'
  }
}

const defaultAboutContent: AboutContent = {
  name: 'Rıza Savurgan',
  bio: [
    'I am a passionate designer and developer based in Istanbul, Turkey.',
    'With over 5 years of experience in digital design, I specialize in creating user-centered experiences that combine aesthetic appeal with functional design.',
    'My approach is rooted in understanding user needs and translating them into beautiful, intuitive interfaces.',
    'When I\'m not designing, you can find me exploring the vibrant streets of Istanbul or experimenting with new technologies.'
  ],
  profileImage: '',
  skills: [
    { name: 'UI/UX Design', percentage: 95 },
    { name: 'Frontend Development', percentage: 90 },
    { name: 'Brand Identity', percentage: 85 },
    { name: 'Motion Design', percentage: 80 }
  ],
  stats: [
    { label: 'Projects Completed', value: '50+' },
    { label: 'Happy Clients', value: '30+' },
    { label: 'Years Experience', value: '5+' },
    { label: 'Client Satisfaction', value: '100%' }
  ]
}

const defaultContactContent: ContactContent = {
  title: 'Let\'s work together',
  description: 'I\'m always interested in new projects and opportunities. Whether you have a question or just want to say hi, I\'ll try my best to get back to you!',
  formTitle: 'Send me a message',
  formFields: {
    name: 'Name',
    email: 'Email',
    message: 'Message'
  },
  submitText: 'Send Message'
}

// Data management functions
export const getProjects = (): Project[] => {
  if (typeof window === 'undefined') return defaultProjects
  
  const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return defaultProjects
    }
  }
  return defaultProjects
}

export const getPublishedProjects = (): Project[] => {
  return getProjects().filter(project => project.status === 'published')
}

export const getProjectBySlug = (slug: string): Project | null => {
  const projects = getProjects()
  return projects.find(project => project.slug.current === slug) || null
}

export const saveProjects = (projects: Project[]): boolean => {
  if (typeof window === 'undefined') return false
  
  const success = safeSetItem(STORAGE_KEYS.PROJECTS, projects)
  
  if (success) {
    // Force storage event to trigger in same tab
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEYS.PROJECTS,
      newValue: JSON.stringify(projects),
      oldValue: localStorage.getItem(STORAGE_KEYS.PROJECTS),
      storageArea: localStorage,
      url: window.location.href
    }))
  }
  
  return success
}

export const getSiteSettings = (): SiteSettings => {
  if (typeof window === 'undefined') return defaultSiteSettings
  
  const stored = localStorage.getItem(STORAGE_KEYS.SITE_SETTINGS)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return defaultSiteSettings
    }
  }
  return defaultSiteSettings
}

export const saveSiteSettings = (settings: SiteSettings): boolean => {
  if (typeof window === 'undefined') return false
  
  const success = safeSetItem(STORAGE_KEYS.SITE_SETTINGS, settings)
  
  if (success) {
    // Force storage event to trigger in same tab
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEYS.SITE_SETTINGS,
      newValue: JSON.stringify(settings),
      oldValue: localStorage.getItem(STORAGE_KEYS.SITE_SETTINGS),
      storageArea: localStorage,
      url: window.location.href
    }))
  }
  
  return success
}

export const getAboutContent = (): AboutContent => {
  if (typeof window === 'undefined') return defaultAboutContent
  
  const stored = localStorage.getItem('portfolio_about_content')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return defaultAboutContent
    }
  }
  return defaultAboutContent
}

export const saveAboutContent = (content: AboutContent): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('portfolio_about_content', JSON.stringify(content))
  
  // Force storage event to trigger in same tab
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'portfolio_about_content',
    newValue: JSON.stringify(content),
    oldValue: localStorage.getItem('portfolio_about_content'),
    storageArea: localStorage,
    url: window.location.href
  }))
}

export const getContactContent = (): ContactContent => {
  if (typeof window === 'undefined') return defaultContactContent
  
  const stored = localStorage.getItem('portfolio_contact_content')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return defaultContactContent
    }
  }
  return defaultContactContent
}

export const saveContactContent = (content: ContactContent): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('portfolio_contact_content', JSON.stringify(content))
  
  // Force storage event to trigger in same tab
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'portfolio_contact_content',
    newValue: JSON.stringify(content),
    oldValue: localStorage.getItem('portfolio_contact_content'),
    storageArea: localStorage,
    url: window.location.href
  }))
}

// Initialize data if not exists
export const initializeData = (): void => {
  if (typeof window === 'undefined') return
  
  if (!localStorage.getItem('portfolio_projects')) {
    saveProjects(defaultProjects)
  }
  
  if (!localStorage.getItem('portfolio_site_settings')) {
    saveSiteSettings(defaultSiteSettings)
  }
  
  if (!localStorage.getItem('portfolio_about_content')) {
    saveAboutContent(defaultAboutContent)
  }
  
  if (!localStorage.getItem('portfolio_contact_content')) {
    saveContactContent(defaultContactContent)
  }
}
