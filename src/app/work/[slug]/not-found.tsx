import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Proje Bulunamadı</h1>
        <p className="text-gray-600 mb-8">Aradığınız proje mevcut değil.</p>
        <Link
          href="/work"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tüm Projelere Dön
        </Link>
      </div>
    </div>
  )
}
