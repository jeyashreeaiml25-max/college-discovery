'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

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

export default function Home() {
  const { data: session, status } = useSession()
  const [colleges, setColleges] = useState<College[]>([])
  const [search, setSearch] = useState('')
  const [state, setState] = useState('')
  const [loading, setLoading] = useState(true)
  const [compareList, setCompareList] = useState<string[]>([])
  const [savedList, setSavedList] = useState<string[]>([])
  const [savingId, setSavingId] = useState<string | null>(null)

  const states = ['Maharashtra', 'Tamil Nadu', 'Delhi', 'Rajasthan', 'Karnataka']

  useEffect(() => {
    fetchColleges()
  }, [search, state])

  useEffect(() => {
    if (session) fetchSaved()
  }, [session])

  async function fetchColleges() {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (state) params.set('state', state)
    const res = await fetch(`/api/colleges?${params}`)
    const data = await res.json()
    setColleges(data)
    setLoading(false)
  }

  async function fetchSaved() {
    const res = await fetch('/api/saved')
    const data = await res.json()
    setSavedList(data.map((c: College) => c.id))
  }

  async function toggleSave(collegeId: string) {
    if (!session) {
      window.location.href = '/login'
      return
    }
    setSavingId(collegeId)
    const res = await fetch('/api/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collegeId })
    })
    const data = await res.json()
    setSavedList(prev =>
      data.saved
        ? [...prev, collegeId]
        : prev.filter(id => id !== collegeId)
    )
    setSavingId(null)
  }

  function toggleCompare(id: string) {
    setCompareList(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : prev.length < 3 ? [...prev, id] : prev
    )
  }
  if (status === 'unauthenticated') {
  return (
    <main className="min-h-screen bg-blue-700 flex flex-col items-center justify-center text-white px-4">
      <h1 className="text-5xl font-bold mb-4">🎓 College Discovery</h1>
      <p className="text-blue-100 text-xl mb-8">Find your perfect college in India</p>
      <div className="flex gap-4">
        <a href="/login" className="bg-white text-blue-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50">
          Login
        </a>
        <a href="/register" className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-600">
          Register
        </a>
      </div>
    </main>
  )
  }

  if (status === 'loading') {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-xl">Loading...</p>
    </main>
  )
  }
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-700 text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">🎓 College Discovery</h1>
        <p className="text-blue-100 mb-6">Find your perfect college in India</p>
        <input
          type="text"
          placeholder="Search colleges..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-xl px-4 py-3 rounded-lg text-gray-800 bg-white text-lg outline-none placeholder-gray-400 shadow"
        />
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-4 flex gap-4 flex-wrap items-center">
        <select
          value={state}
          onChange={e => setState(e.target.value)}
          className="border px-4 py-2 rounded-lg bg-white text-gray-800"
        >
          <option value="">All States</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {compareList.length >= 2 && (
          <Link
            href={`/compare?ids=${compareList.join(',')}`}
            className="ml-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Compare {compareList.length} Colleges →
          </Link>
        )}
      </div>

      {/* College Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-3 text-center text-gray-500 py-12">Loading colleges...</p>
        ) : colleges.map(college => (
          <div key={college.id} className="bg-white rounded-xl shadow hover:shadow-md transition p-6">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-bold text-gray-800">{college.name}</h2>
              <span className="bg-yellow-100 text-yellow-700 text-sm font-semibold px-2 py-1 rounded">
                ⭐ {college.rating}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-1">📍 {college.location}, {college.state}</p>
            <p className="text-gray-500 text-sm mb-3">💰 ₹{college.fees.toLocaleString()} / year</p>
            <p className="text-gray-600 text-sm mb-4">{college.overview}</p>
            <div className="flex gap-2 flex-wrap mb-4">
              {college.courses.slice(0, 3).map(c => (
                <span key={c} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">{c}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <Link
                href={`/college/${college.id}`}
                className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                View Details
              </Link>
              <button
                onClick={() => toggleSave(college.id)}
                disabled={savingId === college.id}
                className={`px-3 py-2 rounded-lg text-sm border ${
                  savedList.includes(college.id)
                    ? 'bg-red-500 text-white border-red-500'
                    : 'border-gray-300 text-gray-600 hover:border-red-400'
                }`}
              >
                {savingId === college.id ? '...' : savedList.includes(college.id) ? '❤️' : '🤍'}
              </button>
              <button
                onClick={() => toggleCompare(college.id)}
                className={`px-3 py-2 rounded-lg text-sm border ${
                  compareList.includes(college.id)
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                {compareList.includes(college.id) ? '✓' : '+'} Compare
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}