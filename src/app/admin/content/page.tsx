'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'

interface AboutContent {
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

export default function AdminContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState<AboutContent>({
    name: 'Rıza Savurgan',
    bio: ['Creative designer based in Istanbul', 'Specialized in brutalist design and typography'],
    profileImage: '',
    skills: [],
    experience: [],
    education: []
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const auth = localStorage.getItem('adminAuth')
    if (!auth) {
      window.location.href = '/admin'
      return
    }
    
    // Load existing content
    const savedContent = localStorage.getItem('portfolio_about')
    if (savedContent) {
      setContent(JSON.parse(savedContent))
    }
    
    setIsAuthenticated(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContent(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBioChange = (index: number, value: string) => {
    setContent(prev => ({
      ...prev,
      bio: prev.bio.map((item, i) => i === index ? value : item)
    }))
  }

  const addBioLine = () => {
    setContent(prev => ({
      ...prev,
      bio: [...prev.bio, '']
    }))
  }

  const removeBioLine = (index: number) => {
    setContent(prev => ({
      ...prev,
      bio: prev.bio.filter((_, i) => i !== index)
    }))
  }

  const addSkill = () => {
    setContent(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', level: 50 }]
    }))
  }

  const updateSkill = (index: number, field: 'name' | 'level', value: string | number) => {
    setContent(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }))
  }

  const removeSkill = (index: number) => {
    setContent(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const addExperience = () => {
    setContent(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', period: '', description: '' }]
    }))
  }

  const updateExperience = (index: number, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const removeExperience = (index: number) => {
    setContent(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  const addEducation = () => {
    setContent(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', school: '', year: '' }]
    }))
  }

  const updateEducation = (index: number, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const removeEducation = (index: number) => {
    setContent(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  const handleSave = () => {
    setIsLoading(true)
    
    try {
      localStorage.setItem('portfolio_about', JSON.stringify(content))
      alert('İçerik başarıyla kaydedildi!')
    } catch (error) {
      console.error('Error saving content:', error)
      alert('İçerik kaydedilirken bir hata oluştu!')
    }
    
    setIsLoading(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/admin/dashboard"
                className="mr-4 text-black hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-4xl font-black tracking-wider">CONTENT MANAGEMENT</h1>
            </div>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 border-2 border-black text-sm font-bold rounded-none text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 uppercase tracking-wide"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'SAVING...' : 'SAVE CONTENT'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Personal Information */}
          <div className="bg-white border-4 border-black rounded-none p-8">
            <h2 className="text-2xl font-black text-black mb-6 uppercase tracking-wide">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="block w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                  value={content.name}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="profileImage" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  id="profileImage"
                  name="profileImage"
                  className="block w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                  value={content.profileImage}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white border-4 border-black rounded-none p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-black uppercase tracking-wide">Bio</h2>
              <button
                onClick={addBioLine}
                className="inline-flex items-center px-4 py-2 border-2 border-black text-sm font-bold rounded-none text-black hover:bg-black hover:text-white uppercase tracking-wide"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Line
              </button>
            </div>
            
            <div className="space-y-4">
              {content.bio.map((line, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <input
                    type="text"
                    className="flex-1 px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                    value={line}
                    onChange={(e) => handleBioChange(index, e.target.value)}
                    placeholder="Bio line..."
                  />
                  <button
                    onClick={() => removeBioLine(index)}
                    className="p-3 border-2 border-black rounded-none text-black hover:bg-black hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white border-4 border-black rounded-none p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-black uppercase tracking-wide">Skills</h2>
              <button
                onClick={addSkill}
                className="inline-flex items-center px-4 py-2 border-2 border-black text-sm font-bold rounded-none text-black hover:bg-black hover:text-white uppercase tracking-wide"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </button>
            </div>
            
            <div className="space-y-4">
              {content.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Skill name"
                    className="flex-1 px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                    value={skill.name}
                    onChange={(e) => updateSkill(index, 'name', e.target.value)}
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Level (0-100)"
                    className="w-32 px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                    value={skill.level}
                    onChange={(e) => updateSkill(index, 'level', parseInt(e.target.value) || 0)}
                  />
                  <button
                    onClick={() => removeSkill(index)}
                    className="p-3 border-2 border-black rounded-none text-black hover:bg-black hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white border-4 border-black rounded-none p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-black uppercase tracking-wide">Experience</h2>
              <button
                onClick={addExperience}
                className="inline-flex items-center px-4 py-2 border-2 border-black text-sm font-bold rounded-none text-black hover:bg-black hover:text-white uppercase tracking-wide"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </button>
            </div>
            
            <div className="space-y-6">
              {content.experience.map((exp, index) => (
                <div key={index} className="border-2 border-gray-300 p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Job Title"
                      className="px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                      value={exp.title}
                      onChange={(e) => updateExperience(index, 'title', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      className="px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Period (e.g., 2020-2024)"
                    className="w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                    value={exp.period}
                    onChange={(e) => updateExperience(index, 'period', e.target.value)}
                  />
                  <textarea
                    placeholder="Description"
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  />
                  <button
                    onClick={() => removeExperience(index)}
                    className="p-2 border-2 border-black rounded-none text-black hover:bg-black hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white border-4 border-black rounded-none p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-black uppercase tracking-wide">Education</h2>
              <button
                onClick={addEducation}
                className="inline-flex items-center px-4 py-2 border-2 border-black text-sm font-bold rounded-none text-black hover:bg-black hover:text-white uppercase tracking-wide"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </button>
            </div>
            
            <div className="space-y-4">
              {content.education.map((edu, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Degree"
                    className="flex-1 px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="School"
                    className="flex-1 px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                    value={edu.school}
                    onChange={(e) => updateEducation(index, 'school', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Year"
                    className="w-32 px-4 py-3 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                    value={edu.year}
                    onChange={(e) => updateEducation(index, 'year', e.target.value)}
                  />
                  <button
                    onClick={() => removeEducation(index)}
                    className="p-3 border-2 border-black rounded-none text-black hover:bg-black hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}