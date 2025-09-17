// LocalStorage utility functions for managing data size and quota

export const STORAGE_KEYS = {
  PROJECTS: 'portfolio_projects',
  SITE_SETTINGS: 'portfolio_site_settings',
  ADMIN_AUTH: 'adminAuth',
  REFRESH_TOKEN: 'refreshSite'
}

export const MAX_STORAGE_SIZE = 5 * 1024 * 1024 // 5MB limit

// Check if we're approaching storage quota
export function checkStorageQuota(): { used: number, available: boolean } {
  if (typeof window === 'undefined') return { used: 0, available: true }
  
  let used = 0
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length + key.length
    }
  }
  
  return {
    used,
    available: used < MAX_STORAGE_SIZE
  }
}

// Compress and optimize data before storing
export function optimizeDataForStorage(data: any): any {
  if (!data) return data
  
  // If it's an array of projects, optimize each project
  if (Array.isArray(data)) {
    return data.map(project => optimizeProject(project))
  }
  
  // If it's a single project, optimize it
  if (data._id && data.title) {
    return optimizeProject(data)
  }
  
  return data
}

function optimizeProject(project: any): any {
  if (!project) return project
  
  const optimized = { ...project }
  
  // Compress gallery images (reduce quality for storage)
  if (optimized.gallery && Array.isArray(optimized.gallery)) {
    optimized.gallery = optimized.gallery.map((image: string) => {
      if (image && image.startsWith('data:image')) {
        // Keep only first 3 images for storage optimization
        return image
      }
      return image
    }).slice(0, 3) // Limit to 3 images for storage
  }
  
  // Optimize cover image
  if (optimized.coverImage && typeof optimized.coverImage === 'string' && optimized.coverImage.startsWith('data:image')) {
    // Keep cover image as is for now, but could compress here
  }
  
  return optimized
}

// Safe storage with quota checking
export function safeSetItem(key: string, value: any): boolean {
  try {
    const optimizedValue = optimizeDataForStorage(value)
    const stringValue = JSON.stringify(optimizedValue)
    
    // Check if adding this data would exceed quota
    const currentQuota = checkStorageQuota()
    if (currentQuota.used + stringValue.length > MAX_STORAGE_SIZE) {
      console.warn('Storage quota would be exceeded, cleaning up old data...')
      cleanupOldData()
    }
    
    localStorage.setItem(key, stringValue)
    return true
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded, attempting cleanup...')
      cleanupOldData()
      
      // Try again after cleanup
      try {
        localStorage.setItem(key, JSON.stringify(optimizeDataForStorage(value)))
        return true
      } catch (retryError) {
        console.error('Still quota exceeded after cleanup:', retryError)
        return false
      }
    }
    console.error('Storage error:', error)
    return false
  }
}

// Clean up old or unnecessary data
export function cleanupOldData(): void {
  try {
    // Remove refresh tokens
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    
    // Get current projects and optimize them
    const projects = localStorage.getItem(STORAGE_KEYS.PROJECTS)
    if (projects) {
      const projectsData = JSON.parse(projects)
      const optimizedProjects = optimizeDataForStorage(projectsData)
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(optimizedProjects))
    }
    
    // Clear any temporary data
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.includes('temp_') || key.includes('cache_'))) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
    
    console.log('Storage cleanup completed')
  } catch (error) {
    console.error('Error during storage cleanup:', error)
  }
}

// Get storage usage info
export function getStorageInfo(): { used: string, available: string, percentage: number } {
  const quota = checkStorageQuota()
  const usedMB = (quota.used / (1024 * 1024)).toFixed(2)
  const availableMB = ((MAX_STORAGE_SIZE - quota.used) / (1024 * 1024)).toFixed(2)
  const percentage = Math.round((quota.used / MAX_STORAGE_SIZE) * 100)
  
  return {
    used: `${usedMB} MB`,
    available: `${availableMB} MB`,
    percentage
  }
}
