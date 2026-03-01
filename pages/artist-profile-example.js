/**
 * Example: Artist Profile Page
 * Demonstrates how to display Instagram link in different contexts
 * 
 * This is a reference implementation showing best practices
 * for integrating InstagramLink component into artist profiles.
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import InstagramLink, { 
  InstagramLinkProfile, 
  InstagramLinkInline 
} from '../components/InstagramLink'

export default function ArtistProfilePage({ artistId }) {
  const [artist, setArtist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        // Fetch artist by ID from your API
        const res = await fetch(`/api/artists/${artistId}`)
        if (!res.ok) throw new Error('Artist not found')
        
        const data = await res.json()
        setArtist(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (artistId) {
      fetchArtist()
    }
  }, [artistId])

  if (loading) {
    return <div className="text-center py-20">Loading artist profile...</div>
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">Error: {error}</div>
  }

  if (!artist) {
    return <div className="text-center py-20">Artist not found</div>
  }

  return (
    <main className="min-h-screen pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Hero Section - Artist Info */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left: Artist Avatar/Photo */}
          <div className="md:col-span-1">
            <div className="text-center">
              <div 
                className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-6xl mb-6 mx-auto shadow-lg"
              >
                👨‍🎨
              </div>
              
              {/* Instagram Link - Prominent display */}
              <div className="mb-4">
                <InstagramLinkProfile username={artist.instagramId} />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-2xl font-bold text-purple-600">12</p>
                  <p className="text-xs text-gray-600">Orders</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">4.8</p>
                  <p className="text-xs text-gray-600">Rating</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">2yr</p>
                  <p className="text-xs text-gray-600">Member</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Artist Bio */}
          <div className="md:col-span-2">
            <h1 
              className="text-5xl font-bold mb-4" 
              style={{ fontFamily: 'Playfair Display' }}
            >
              {artist.name}
            </h1>

            {/* Bio Section */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3">About</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Creative artist specializing in custom art hampers and personalized gift presentations. 
                With over 2 years of experience, I bring a unique blend of traditional art techniques 
                and modern design sensibilities to every project.
              </p>
              
              {/* Specialty Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="badge">🎨 Paper Art</span>
                <span className="badge">🌸 Floral Design</span>
                <span className="badge">🎁 Gift Curation</span>
                <span className="badge">✨ Custom Orders</span>
              </div>
            </div>

            {/* Contact/Action Section */}
            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <h3 className="font-bold mb-4">Interested in Working Together?</h3>
              <div className="flex gap-3">
                <button className="hero-btn flex-1">
                  💬 Message {artist.name}
                </button>
                <a 
                  href={`https://instagram.com/${artist.instagramId.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex-1 text-center"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <section className="mb-16">
          <h2 
            className="text-4xl font-bold mb-8" 
            style={{ fontFamily: 'Playfair Display' }}
          >
            Portfolio
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Portfolio Items - Replace with actual data */}
            {[1, 2, 3, 4, 5, 6].map(item => (
              <div 
                key={item}
                className="card overflow-hidden cursor-pointer group"
              >
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                  🎨
                </div>
                <h3 className="text-lg font-bold mt-4">Custom Hamper #{item}</h3>
                <p className="text-sm text-gray-600">A beautiful creation for special occasions</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mb-16">
          <h2 
            className="text-4xl font-bold mb-8" 
            style={{ fontFamily: 'Playfair Display' }}
          >
            Client Reviews
          </h2>

          <div className="space-y-4">
            {[1, 2, 3].map(review => (
              <div key={review} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold">Happy Client {review}</p>
                    <p className="text-xs text-gray-500">3 months ago</p>
                  </div>
                  <p className="text-lg">⭐⭐⭐⭐⭐</p>
                </div>
                <p className="text-gray-700">
                  {artist.name} created the most beautiful custom hamper! Attention to detail was incredible. 
                  Highly recommended for anyone looking for personalized gift solutions.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-12 text-center text-white mb-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Collaborate?</h2>
          <p className="text-lg mb-6 opacity-90">
            Start your custom art hamper project with {artist.name} today
          </p>
          <button className="hero-btn bg-white text-purple-600 hover:bg-gray-100">
            Create a New Order
          </button>
        </section>

        {/* Footer Links */}
        <div className="text-center space-y-4 border-t border-gray-200 pt-8">
          <Link href="/artists" className="block navbar-link">
            ← Back to Artists List
          </Link>
          
          {/* Example: Inline Instagram link in text */}
          <p className="text-gray-600">
            Follow {artist.name} on {' '}
            <InstagramLinkInline username={artist.instagramId} />
            {' '} for daily inspiration
          </p>
        </div>
      </div>

      <style jsx>{`
        .badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background-color: #f3e8ff;
          color: #6b21a8;
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 500;
        }
      `}</style>
    </main>
  )
}

/**
 * To use this in your application:
 * 
 * 1. Get artistId from URL params:
 *    import { useRouter } from 'next/router'
 *    const router = useRouter()
 *    const { artistId } = router.query
 * 
 * 2. Pass artistId to component:
 *    <ArtistProfilePage artistId={artistId} />
 * 
 * 3. Create corresponding API endpoint if needed:
 *    GET /api/artists/[id]
 * 
 * 4. The component displays InstagramLink in multiple ways:
 *    - InstagramLinkProfile: Prominent, large version
 *    - InstagramLinkInline: Embedded in text
 *    - Direct link with href: In CTA buttons
 */
