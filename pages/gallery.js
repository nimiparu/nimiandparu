import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Gallery() {
  const [hampers, setHampers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState('all')
  const [occasion, setOccasion] = useState('all')
  const [artist, setArtist] = useState('all')

  const [artists, setArtists] = useState([])

  useEffect(() => {
    fetchHampers()
    fetchArtists()
  }, [])

  const fetchHampers = async () => {
    try {
      const res = await fetch('/api/gallery')
      if (!res.ok) throw new Error('Failed to fetch hampers')
      const data = await res.json()
      setHampers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchArtists = async () => {
    try {
      const res = await fetch('/api/artists')
      if (!res.ok) throw new Error('Failed to fetch artists')
      const data = await res.json()
      setArtists(data)
    } catch (err) {
      console.error(err)
    }
  }

  const filteredHampers = hampers.filter((hamper) => {
    // Search filter
    if (
      searchQuery &&
      !hamper.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !hamper.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Price filter
    if (priceRange !== 'all') {
      const price = parseInt(hamper.price) || 0
      if (priceRange === 'low' && price > 500) return false
      if (priceRange === 'medium' && (price < 500 || price > 2000)) return false
      if (priceRange === 'high' && price < 2000) return false
    }

    // Occasion filter
    if (occasion !== 'all' && hamper.occasion !== occasion) return false

    // Artist filter
    if (artist !== 'all') {
      const hasArtist = hamper.artists?.some((a) => a.artist.id === artist)
      if (!hasArtist) return false
    }

    return true
  })

  const occasions = [...new Set(hampers.map((h) => h.occasion).filter(Boolean))]

  return (
    <main className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Playfair Display' }}>
            Gallery <span className="gradient-text">Marketplace</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">Explore beautiful custom-made art hampers from talented artists worldwide</p>
        </div>

        {error && (
          <div className="mb-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg" style={{ animation: 'fadeInUp 0.6s ease-out 0.1s backwards' }}>
            <p className="text-red-800 font-semibold">Error: {error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-12" style={{ animation: 'fadeInUp 0.6s ease-out 0.2s backwards' }}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-6">Search & Filter</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hampers..."
                  className="w-full"
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold mb-3">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full"
                >
                  <option value="all">All Prices</option>
                  <option value="low">Under $500</option>
                  <option value="medium">$500 - $2000</option>
                  <option value="high">$2000+</option>
                </select>
              </div>

              {/* Occasion */}
              <div>
                <label className="block text-sm font-semibold mb-3">Occasion</label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full"
                >
                  <option value="all">All Occasions</option>
                  {occasions.map((occ) => (
                    <option key={occ} value={occ}>
                      {occ}
                    </option>
                  ))}
                </select>
              </div>

              {/* Artist */}
              <div>
                <label className="block text-sm font-semibold mb-3">Artist</label>
                <select
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full"
                >
                  <option value="all">All Artists</option>
                  {artists.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                setSearchQuery('')
                setPriceRange('all')
                setOccasion('all')
                setArtist('all')
              }}
              className="mt-6 btn-outline"
            >
              ↻ Clear All Filters
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500" style={{ animation: 'pulse 2s infinite' }}>Loading exquisite hampers...</p>
          </div>
        ) : filteredHampers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 mb-6">No hampers found matching your filters.</p>
            <Link href="/hamper-order" className="btn-primary inline-block">
              Create a Custom Hamper →
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-gray-600">
                Showing <span className="font-bold text-purple-600">{filteredHampers.length}</span> hamper{filteredHampers.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHampers.map((hamper, index) => (
                <div 
                  key={hamper.id} 
                  className="gallery-card"
                  style={{ animation: `fadeInUp 0.6s ease-out ${0.1 * index}s backwards` }}
                >
                  {/* Image */}
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 h-72 flex items-center justify-center overflow-hidden">
                    {hamper.images ? (
                      <img 
                        src={hamper.images} 
                        alt={hamper.title} 
                        className="gallery-image w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-5xl mb-2">🎨</div>
                        <p className="text-gray-400">No Image</p>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3 gap-3">
                      <h3 className="text-xl font-bold flex-1">{hamper.title}</h3>
                      <span className="badge text-xs whitespace-nowrap">
                        {hamper.occasion}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">{hamper.description}</p>

                    {/* Price */}
                    <div className="mb-5 pb-5 border-b border-gray-200">
                      <span className="text-3xl font-bold gradient-text">${hamper.price}</span>
                    </div>

                    {/* Artists */}
                    {hamper.artists && hamper.artists.length > 0 && (
                      <div className="mb-6">
                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Artists</p>
                        <div className="flex flex-wrap gap-2">
                          {hamper.artists?.map(({ artist }) => (
                            <span key={artist.id} className="badge text-xs">
                              ✨ {artist.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <Link
                        href={`/gallery/${hamper.id}`}
                        className="flex-1 btn-primary text-center py-2 text-base"
                      >
                        View Details
                      </Link>
                      <button className="flex-1 btn-secondary text-center py-2 text-base">
                        💝 Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer Navigation */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <Link href="/" className="navbar-link text-lg">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
