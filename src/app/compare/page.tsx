'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

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

function CompareContent() {
  const searchParams = useSearchParams()
  const ids = searchParams.get('ids')?.split(',') || []
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all(ids.map(id => fetch(`/api/colleges/${id}`).then(r => r.json())))
      .then(data => { setColleges(data); setLoading(false) })
  }, [])

  if (loading) return <div className="text-center py-12 text-gray-500">Loading comparison...</div>

  const rows = [
    { label: '📍 Location', key: 'location' },
    { label: '🏛️ State', key: 'state' },
    { label: '💰 Fees/year', key: 'fees' },
    { label: '⭐ Rating', key: 'rating' },
    { label: '💼 Placements', key: 'placements' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 hover:underline text-sm mb-6 inline-block">← Back to Search</Link>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">College Comparison</h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-xl shadow">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="p-4 text-left">Feature</th>
              {colleges.map(c => (
                <th key={c.id} className="p-4 text-center">{c.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.key} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="p-4 font-medium text-gray-700">{row.label}</td>
                {colleges.map(c => (
                  <td key={c.id} className="p-4 text-center text-gray-600">
                    {row.key === 'fees'
                      ? `₹${(c[row.key as keyof College] as number).toLocaleString()}`
                      : String(c[row.key as keyof College])}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td className="p-4 font-medium text-gray-700">📚 Courses</td>
              {colleges.map(c => (
                <td key={c.id} className="p-4 text-center">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {c.courses.map(course => (
                      <span key={course} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">{course}</span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-blue-700 text-white py-8 px-4 text-center">
        <h1 className="text-3xl font-bold">⚖️ Compare Colleges</h1>
      </div>
      <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
        <CompareContent />
      </Suspense>
    </main>
  )
}