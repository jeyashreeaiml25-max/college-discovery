'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface College {
  id: string
  name: string
  location: string
  state: string
  fees: number
  rating: number
  overview: string
}

export default function SavedColleges() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') {
      fetch('/api/saved')
        .then(res => res.json())
        .then(data => { setColleges(data); setLoading(false) })
    }
  }, [status])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Loading saved colleges...
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-blue-700 text-white py-10 px-4 text-center">
        <h1 className="text-3xl font-bold">❤️ Saved Colleges</h1>
        <p className="text-blue-100 mt-2">Colleges you have bookmarked</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {colleges.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl mb-4">No saved colleges yet!</p>
            <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Browse Colleges
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map(college => (
              <div key={college.id} className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-bold text-gray-800">{college.name}</h2>
                  <span className="bg-yellow-100 text-yellow-700 text-sm font-semibold px-2 py-1 rounded">
                    ⭐ {college.rating}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-1">📍 {college.location}, {college.state}</p>
                <p className="text-gray-500 text-sm mb-4">💰 ₹{college.fees.toLocaleString()} / year</p>
                <Link
                  href={`/college/${college.id}`}
                  className="block text-center bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}