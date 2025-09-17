'use client'

import { useState, useEffect } from 'react'
import { getStorageInfo, cleanupOldData } from '@/lib/storage-utils'

export default function StorageInfo() {
  const [storageInfo, setStorageInfo] = useState({ used: '0 MB', available: '5 MB', percentage: 0 })
  const [isCleaning, setIsCleaning] = useState(false)

  const updateStorageInfo = () => {
    setStorageInfo(getStorageInfo())
  }

  useEffect(() => {
    updateStorageInfo()
    const interval = setInterval(updateStorageInfo, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const handleCleanup = async () => {
    setIsCleaning(true)
    try {
      cleanupOldData()
      updateStorageInfo()
      alert('Storage cleanup completed!')
    } catch (error) {
      alert('Error during cleanup: ' + error)
    } finally {
      setIsCleaning(false)
    }
  }

  const getStatusColor = () => {
    if (storageInfo.percentage > 80) return 'text-red-600'
    if (storageInfo.percentage > 60) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getStatusText = () => {
    if (storageInfo.percentage > 80) return 'Storage almost full!'
    if (storageInfo.percentage > 60) return 'Storage getting full'
    return 'Storage OK'
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Storage Status</h3>
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Used: {storageInfo.used}</span>
          <span>Available: {storageInfo.available}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              storageInfo.percentage > 80 ? 'bg-red-500' : 
              storageInfo.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${storageInfo.percentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {storageInfo.percentage}% used
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={updateStorageInfo}
          className="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Refresh
        </button>
        <button
          onClick={handleCleanup}
          disabled={isCleaning}
          className="flex-1 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors disabled:opacity-50"
        >
          {isCleaning ? 'Cleaning...' : 'Clean Up'}
        </button>
      </div>
      
      {storageInfo.percentage > 70 && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Warning:</strong> Storage is getting full. Consider cleaning up old data or reducing image sizes.
          </p>
        </div>
      )}
    </div>
  )
}
