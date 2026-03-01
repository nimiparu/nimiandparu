import { useState, useEffect } from 'react'
import Link from 'next/link'
import InstagramLink from '../components/InstagramLink'

export default function ArtistsList() {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await fetch('/api/artists')
        if (!res.ok) throw new Error('Failed to fetch artists')
        const data = await res.json()
        setArtists(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchArtists()
  }, [])

  return (
    <main className="min-h-screen pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-12" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display' }}>
            Meet Our <span className="gradient-text">Creative Artists</span>
          </h1>
          <p className="text-xl text-gray-600">Talented artists bringing your custom hamper dreams to life</p>
        </div>

        {error && (
          <div className="mb-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg" style={{ animation: 'fadeInUp 0.6s ease-out 0.1s backwards' }}>
            <p className="text-red-800 font-semibold">Error: {error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500" style={{ animation: 'pulse 2s infinite' }}>Loading artists...</p>
          </div>
        ) : artists.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No artists have signed up yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Digital Art Section */}
            {artists.filter(a => a.artistCategory === 'digital').length > 0 && (
              <div className="mb-16">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <span className="text-4xl">🖥️</span>Digital Art Artists
                  </h2>
                  <p className="text-gray-600">
                    <span className="font-bold text-purple-600">{artists.filter(a => a.artistCategory === 'digital').length}</span> talented digital artists creating amazing designs
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {artists.filter(a => a.artistCategory === 'digital').map((artist, index) => (
                    <div 
                      key={artist.id} 
                      className="card group"
                      style={{ animation: `fadeInUp 0.6s ease-out ${0.05 * index}s backwards` }}
                    >
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        👨‍🎨
                      </div>
                      <div className="mb-6 pb-4 border-b border-gray-200">
                        <h3 className="text-2xl font-bold mb-3">{artist.name}</h3>
                        <div className="flex items-center justify-center">
                          <InstagramLink 
                            username={artist.instagramId}
                            size="md"
                            showLabel={true}
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 pb-4 border-b border-gray-200 text-center">
                        Joined {new Date(artist.signedUpAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <button className="w-full mt-4 btn-secondary py-2">
                        ✨ Partner With This Artist
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Non-Digital Art Section */}
            {artists.filter(a => a.artistCategory === 'non-digital').length > 0 && (
              <div className="mb-16">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <span className="text-4xl">✏️</span>Non-Digital Artists
                  </h2>
                  <p className="text-gray-600">
                    <span className="font-bold text-purple-600">{artists.filter(a => a.artistCategory === 'non-digital').length}</span> talented traditional artists creating beautiful artwork
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {artists.filter(a => a.artistCategory === 'non-digital').map((artist, index) => (
                    <div 
                      key={artist.id} 
                      className="card group"
                      style={{ animation: `fadeInUp 0.6s ease-out ${0.05 * index}s backwards` }}
                    >
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        👨‍🎨
                      </div>
                      <div className="mb-6 pb-4 border-b border-gray-200">
                        <h3 className="text-2xl font-bold mb-3">{artist.name}</h3>
                        <div className="flex items-center justify-center">
                          <InstagramLink 
                            username={artist.instagramId}
                            size="md"
                            showLabel={true}
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 pb-4 border-b border-gray-200 text-center">
                        Joined {new Date(artist.signedUpAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <button className="w-full mt-4 btn-secondary py-2">
                        ✨ Partner With This Artist
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Craft Section */}
            {artists.filter(a => a.artistCategory === 'craft').length > 0 && (
              <div className="mb-16">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <span className="text-4xl">🎨</span>Craft Artists
                  </h2>
                  <p className="text-gray-600">
                    <span className="font-bold text-purple-600">{artists.filter(a => a.artistCategory === 'craft').length}</span> talented craftspeople creating unique handmade items
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {artists.filter(a => a.artistCategory === 'craft').map((artist, index) => (
                    <div 
                      key={artist.id} 
                      className="card group"
                      style={{ animation: `fadeInUp 0.6s ease-out ${0.05 * index}s backwards` }}
                    >
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        👨‍🎨
                      </div>
                      <div className="mb-6 pb-4 border-b border-gray-200">
                        <h3 className="text-2xl font-bold mb-3">{artist.name}</h3>
                        <div className="flex items-center justify-center">
                          <InstagramLink 
                            username={artist.instagramId}
                            size="md"
                            showLabel={true}
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 pb-4 border-b border-gray-200 text-center">
                        Joined {new Date(artist.signedUpAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <button className="w-full mt-4 btn-secondary py-2">
                        ✨ Partner With This Artist
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer Navigation */}
        <div className="mt-12 text-center">
          <div className="space-y-4">
            <Link href="/hamper-order" className="navbar-link text-lg block">
              Create Hamper Order
            </Link>
            <Link href="/" className="navbar-link text-lg block">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
