// Firebase-based data management
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore'
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage'
import { db, storage } from './firebase'

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
  coverImage?: string
  gallery?: string[]
  externalLink?: string
  views?: number
  createdAt?: Date
  updatedAt?: Date
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

// Projects
export async function getProjects(): Promise<Project[]> {
  try {
    const projectsRef = collection(db, 'projects')
    const q = query(projectsRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    })) as Project[]
  } catch (error) {
    console.error('Error getting projects:', error)
    return []
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const projectRef = doc(db, 'projects', id)
    const snapshot = await getDoc(projectRef)
    
    if (snapshot.exists()) {
      return {
        _id: snapshot.id,
        ...snapshot.data()
      } as Project
    }
    return null
  } catch (error) {
    console.error('Error getting project:', error)
    return null
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const projectsRef = collection(db, 'projects')
    const q = query(projectsRef, where('slug.current', '==', slug))
    const snapshot = await getDocs(q)
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0]
      return {
        _id: doc.id,
        ...doc.data()
      } as Project
    }
    return null
  } catch (error) {
    console.error('Error getting project by slug:', error)
    return null
  }
}

export async function saveProject(project: Omit<Project, '_id'>): Promise<string | null> {
  try {
    const projectsRef = collection(db, 'projects')
    const docRef = await addDoc(projectsRef, {
      ...project,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return docRef.id
  } catch (error) {
    console.error('Error saving project:', error)
    return null
  }
}

export async function updateProject(id: string, project: Partial<Project>): Promise<boolean> {
  try {
    const projectRef = doc(db, 'projects', id)
    await updateDoc(projectRef, {
      ...project,
      updatedAt: new Date()
    })
    return true
  } catch (error) {
    console.error('Error updating project:', error)
    return false
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    const projectRef = doc(db, 'projects', id)
    await deleteDoc(projectRef)
    return true
  } catch (error) {
    console.error('Error deleting project:', error)
    return false
  }
}

// Image upload
export async function uploadImage(file: File, path: string): Promise<string | null> {
  try {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

export async function deleteImage(url: string): Promise<boolean> {
  try {
    const imageRef = ref(storage, url)
    await deleteObject(imageRef)
    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}

// Site Settings
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settingsRef = doc(db, 'settings', 'site')
    const snapshot = await getDoc(settingsRef)
    
    if (snapshot.exists()) {
      return snapshot.data() as SiteSettings
    }
    
    // Return default settings if not found
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
  } catch (error) {
    console.error('Error getting site settings:', error)
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

export async function saveSiteSettings(settings: SiteSettings): Promise<boolean> {
  try {
    const settingsRef = doc(db, 'settings', 'site')
    await updateDoc(settingsRef, settings)
    return true
  } catch (error) {
    console.error('Error saving site settings:', error)
    return false
  }
}

// About Content
export async function getAboutContent(): Promise<AboutContent> {
  try {
    const aboutRef = doc(db, 'content', 'about')
    const snapshot = await getDoc(aboutRef)
    
    if (snapshot.exists()) {
      return snapshot.data() as AboutContent
    }
    
    // Return default content if not found
    return {
      name: 'Designer',
      bio: ['A creative designer'],
      profileImage: '',
      skills: [],
      experience: [],
      education: []
    }
  } catch (error) {
    console.error('Error getting about content:', error)
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

export async function saveAboutContent(content: AboutContent): Promise<boolean> {
  try {
    const aboutRef = doc(db, 'content', 'about')
    await updateDoc(aboutRef, content)
    return true
  } catch (error) {
    console.error('Error saving about content:', error)
    return false
  }
}
