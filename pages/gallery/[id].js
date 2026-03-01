import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function GalleryDetail() {
  const router = useRouter()
  const { id } = router.query
  const [hamper, setHamper] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    const fetchHamper = async () => {
      try {
        const res = await fetch(`/api/gallery/${id}`)
        if (!res.ok) throw new Error('Hamper not found')
        const data = await res.json()
        setHamper(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHamper()
  }, [id])

  if (!id) {
    return <main className="min-h-screen pt-20"><p className="text-center mt-8">Loading...</p></main>
  }

  return (
    <main className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <Link href="/gallery" className="navbar-link text-lg mb-8 inline-block">
          ← Back to Gallery
        </Link>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500" style={{ animation: 'pulse 2s infinite' }}>Loading hamper details...</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-800 font-semibold">Error: {error}</p>
          </div>
        ) : hamper ? (
          <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Image */}
              <div>
                <div className="gallery-card overflow-hidden">
                  {hamper.images ? (
                    <img 
                      src={hamper.images} 
                      alt={hamper.title} 
                      className="w-full h-96 lg:h-full object-cover"
                    />
                  ) : (
                    <div className="h-96 lg:h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                      <div className="text-center">
                        <div className="text-8xl mb-4">🎨</div>
                        <p className="text-gray-500 text-lg">No Image Available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div>
                <h1 
                  className="text-4xl lg:text-5xl font-bold mb-6" 
                  style={{ fontFamily: 'Playfair Display' }}
                >
                  {hamper.title}
                </h1>

                {/* Price and Occasion */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <p className="text-5xl font-bold gradient-text mb-4">${hamper.price}</p>
                  <span className="badge text-base">
                    📅 {hamper.occasion}
                  </span>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">About This Hamper</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">{hamper.description}</p>
                </div>

                {/* Artists */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <h3 className="text-xl font-bold mb-6">Created By</h3>
                  <div className="space-y-4">
                    {hamper.artists?.map(({ artist }) => (
                      <div key={artist.id} className="card">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold">{artist.name}</p>
                            <a
                              href={`https://instagram.com/${artist.instagramId.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-800 font-semibold inline-flex items-center gap-2"
                            >
                              📷 {artist.instagramId}
                            </a>
                          </div>
                          <div className="text-3xl">✨</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reproducible Badge */}
                {hamper.isReproducible && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
                    <p className="text-green-800 font-semibold text-lg">
                      ✓ This hamper can be customized and recreated for you!
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button className="w-full hero-btn text-center py-4 text-lg">
                    🛒 Purchase This Hamper
                  </button>
                  <button className="w-full btn-secondary py-4 text-lg font-bold">
                    ✨ Request Customization
                  </button>
                </div>
              </div>
            </div>

            {/* Related Info Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-12 text-center mb-12 border border-purple-100">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display' }}>
                Love This Hamper?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Connect directly with the artist to discuss customizations, delivery options, and create your perfect gift.
              </p>
              <button className="btn-primary inline-block">
                Contact Artist
              </button>
            </div>

            {/* Back to Gallery */}
            <div className="text-center">
              <Link href="/gallery" className="navbar-link text-lg">
                ← Continue Browsing Gallery
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">Hamper not found</p>
            <Link href="/gallery" className="btn-primary inline-block mt-6">
              Back to Gallery
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
