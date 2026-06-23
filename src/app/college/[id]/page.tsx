'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface College {
  id: string
  name: string
  location: string
  state: string
  fees: number
  rating: number
  overview: string
  courses: string[]
  placements: string
}

export default function CollegeDetail() {
  const { id } = useParams()
  const [college, setCollege] = useState<College | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

   useEffect(() => {
    if (!id) return
    fetch(`/api/colleges/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(data => {
        setCollege(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
        console.error('Failed to fetch college')
      })
    }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
  if (!college) return <div className="min-h-screen flex items-center justify-center text-red-500">College not found</div>

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-700 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-blue-200 hover:text-white text-sm mb-4 inline-block">← Back to Search</Link>
          <h1 className="text-3xl font-bold">{college.name}</h1>
          <p className="text-blue-100 mt-1">📍 {college.location}, {college.state}</p>
          <div className="flex gap-4 mt-3">
            <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">⭐ {college.rating}/5</span>
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">₹{college.fees.toLocaleString()}/year</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overview */}
        <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-3">📋 Overview</h2>
          <p className="text-gray-600">{college.overview}</p>
        </div>

        {/* Courses */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">📚 Courses Offered</h2>
          <div className="flex flex-wrap gap-2">
            {college.courses.map(course => (
              <span key={course} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">{course}</span>
            ))}
          </div>
        </div>

        {/* Placements */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">💼 Placements</h2>
          <p className="text-gray-600">{college.placements}</p>
        </div>

        {/* Fees */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">💰 Fee Structure</h2>
          <p className="text-3xl font-bold text-blue-700">₹{college.fees.toLocaleString()}</p>
          <p className="text-gray-500 text-sm">per year</p>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">⭐ Rating</h2>
          <p className="text-3xl font-bold text-yellow-500">{college.rating} / 5.0</p>
          <p className="text-gray-500 text-sm">Overall rating</p>
        </div>
      </div>
    </main>
   )
}