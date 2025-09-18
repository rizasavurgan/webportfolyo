'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, User, Eye } from 'lucide-react'

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Basit authentication
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      localStorage.setItem('adminAuth', 'true')
      window.location.href = '/admin/dashboard'
    } else {
      alert('Geçersiz kullanıcı adı veya şifre')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white border-4 border-black rounded-none shadow-2xl p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-black mb-2 tracking-wider">ADMIN</h1>
            <p className="text-gray-600 font-medium">Portfolio Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-black" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-4 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                  placeholder="Enter username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-black" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full pl-10 pr-10 py-4 border-2 border-black rounded-none bg-white text-black font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
                  placeholder="Enter password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Eye className="h-5 w-5 text-black hover:text-gray-600" />
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center py-4 px-4 border-2 border-black rounded-none shadow-lg text-lg font-black text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
            >
              {isLoading ? 'LOGGING IN...' : 'LOGIN'}
            </motion.button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600 font-medium">
            <p className="uppercase tracking-wide">Demo Credentials</p>
            <p className="font-bold">Username: <span className="text-black">admin</span></p>
            <p className="font-bold">Password: <span className="text-black">admin123</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}