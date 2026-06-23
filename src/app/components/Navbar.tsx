'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      <Link href="/" className="text-blue-700 font-bold text-xl">🎓 CollegeDiscovery</Link>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-gray-600 text-sm">Hi, {session.user?.name}</span>
            <Link href="/saved" className="text-blue-600 hover:underline text-sm">Saved Colleges</Link>
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-blue-600 hover:underline text-sm">Login</Link>
            <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}