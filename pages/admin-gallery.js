import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminGallery() {
  const [hampers, setHampers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    if (isAuthenticated) {
      fetchHampers()
    }
  }, [isAuthenticated, filter])

  const fetchHampers = async () => {
    try {
      const res = await fetch(`/api/admin/gallery?status=${filter}`)
      if (!res.ok) throw new Error('Failed to fetch hampers')
      const data = await res.json()
      setHampers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    // Simple password check (in production, use proper authentication)
    if (adminPassword === 'admin123') {
      setIsAuthenticated(true)
      setAdminPassword('')
    } else {
      alert('Invalid password')
    }
  }

  const handleApprove = async (hamperId) => {
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hamperId, action: 'approve' })
      })
      if (!res.ok) throw new Error('Failed to approve')
      fetchHampers()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const handleReject = async (hamperId) => {
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hamperId, action: 'reject' })
      })
      if (!res.ok) throw new Error('Failed to reject')
      fetchHampers()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="container">
        <div className="mt-20 max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Admin Gallery Control</h1>
          <div className="space-y-4">
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
            >
              Login
            </button>
          </div>
          <div className="mt-6">
            <Link href="/" className="text-gray-600 hover:underline">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container">
      <div className="mt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gallery Moderation</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Logout
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status)
                setLoading(true)
              }}
              className={`px-4 py-2 rounded capitalize ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
            Error: {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading hampers...</p>
        ) : hampers.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No hampers to review</p>
        ) : (
          <div className="space-y-6">
            {hampers.map((hamper) => (
              <div key={hamper.id} className="border border-gray-300 rounded p-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Image */}
                  <div>
                    <div className="bg-gray-200 h-48 rounded flex items-center justify-center">
                      {hamper.images ? (
                        <img src={hamper.images} alt={hamper.title} className="w-full h-full object-cover rounded" />
                      ) : (
                        <p className="text-gray-500">No Image</p>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <h3 className="text-xl font-bold mb-2">{hamper.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{hamper.description}</p>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-semibold">Client:</span> {hamper.clientName}
                      </p>
                      <p>
                        <span className="font-semibold">Price:</span> ${hamper.price}
                      </p>
                      <p>
                        <span className="font-semibold">Occasion:</span> {hamper.occasion}
                      </p>
                      <p>
                        <span className="font-semibold">Status:</span> {hamper.galleryStatus}
                      </p>
                    </div>
                  </div>

                  {/* Artists & Actions */}
                  <div>
                    <div className="mb-4">
                      <p className="font-semibold mb-2">Artists:</p>
                      <div className="space-y-1">
                        {hamper.artists?.map(({ artist }) => (
                          <p key={artist.id} className="text-sm text-gray-600">
                            • {artist.name}
                          </p>
                        ))}
                      </div>
                    </div>

                    {hamper.galleryStatus === 'pending' && (
                      <div className="space-y-2">
                        <button
                          onClick={() => handleApprove(hamper.id)}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleReject(hamper.id)}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-semibold"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 border-t border-gray-200 pt-6">
          <Link href="/" className="text-gray-600 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
