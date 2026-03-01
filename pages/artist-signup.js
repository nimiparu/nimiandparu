import { useState } from 'react'
import Link from 'next/link'
import { validateInstagramUsername } from '../lib/instagram'

export default function ArtistSignup() {
  const [name, setName] = useState('')
  const [instagramId, setInstagramId] = useState('')
  const [artistCategory, setArtistCategory] = useState('digital')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})

  // Validate form in real-time
  const validateForm = () => {
    const errors = {}

    // Validate name
    if (!name || name.trim().length === 0) {
      errors.name = 'Full name is required'
    } else if (name.length < 2) {
      errors.name = 'Name must be at least 2 characters'
    } else if (name.length > 50) {
      errors.name = 'Name must be less than 50 characters'
    }

    // Validate Instagram
    if (!instagramId || instagramId.trim().length === 0) {
      errors.instagram = 'Instagram handle is required'
    } else {
      const validation = validateInstagramUsername(instagramId)
      if (!validation.isValid) {
        errors.instagram = validation.error
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInstagramChange = (e) => {
    const value = e.target.value
    setInstagramId(value)

    // Clear error when user starts typing
    if (validationErrors.instagram) {
      setValidationErrors(prev => ({ ...prev, instagram: '' }))
    }

    // Show suggestion if user enters just characters
    if (value && !value.includes('instagram.com')) {
      const validation = validateInstagramUsername(value)
      if (validation.isValid) {
        // Validation passed
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate before submitting
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name.trim(), 
          instagramId: instagramId.trim(),
          artistCategory: artistCategory
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign up')
      }

      // Success!
      setSuccess(true)
      setName('')
      setInstagramId('')
      setArtistCategory('digital')
      setValidationErrors({})
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen pt-20 pb-20 flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        {/* Header */}
        <div className="text-center mb-12" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <h1 
            className="text-5xl font-bold mb-3 gradient-text" 
            style={{ fontFamily: 'Playfair Display' }}
          >
            ART HAMPER
          </h1>
          <p className="text-xl text-gray-600">Join Our Creative Community</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-6 bg-green-50 border-l-4 border-green-500 rounded-lg" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
            <p className="text-green-800 font-semibold mb-2">✓ Welcome to ART HAMPER!</p>
            <p className="text-green-700 text-sm">Your artist profile is ready. We can't wait to collaborate with you!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
            <p className="text-red-800 font-semibold mb-1">✗ Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="card" style={{ animation: 'fadeInUp 0.6s ease-out 0.1s backwards' }}>
          <h2 className="text-2xl font-bold mb-2">Sign Up as an Artist</h2>
          <p className="text-gray-600 mb-8">Tell us about yourself and start creating beautiful hampers</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                Full Name
              </label>
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (validationErrors.name) {
                      setValidationErrors(prev => ({ ...prev, name: '' }))
                    }
                  }}
                  required
                  placeholder="Your creative name"
                  autoComplete="off"
                  className={validationErrors.name ? 'border-red-500 border-2' : ''}
                />
              </div>
              {validationErrors.name && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  ⚠️ {validationErrors.name}
                </p>
              )}
            </div>

            {/* Instagram Field */}
            <div>
              <label className="block text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                Instagram Handle
              </label>
              <div>
                <input
                  type="text"
                  value={instagramId}
                  onChange={handleInstagramChange}
                  required
                  placeholder="@yourinstagram or yourinstagram"
                  autoComplete="off"
                  className={validationErrors.instagram ? 'border-red-500 border-2' : ''}
                />
              </div>
              {validationErrors.instagram && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  ⚠️ {validationErrors.instagram}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                💡 Tip: Enter just your handle (e.g., @creative_artist or creative_artist)
              </p>
            </div>

            {/* Artist Category Field */}
            <div>
              <label className="block text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                Art Category
              </label>
              <select
                value={artistCategory}
                onChange={(e) => setArtistCategory(e.target.value)}
                className="w-full"
              >
                <option value="digital">🖥️ Digital Art (Graphic Design, Digital Illustration, etc.)</option>
                <option value="non-digital">✏️ Non-Digital (Drawings, Sketches, Paintings, etc.)</option>
                <option value="craft">🎨 Craft (Pottery, Jewelry, Handmade Items, etc.)</option>
              </select>
              <p className="text-gray-500 text-xs mt-2">
                Select the category that best describes your art style
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="hero-btn w-full py-3 text-lg font-bold disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Creating Account...' : '✨ Join ART HAMPER'}
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Why join us?</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Partner with clients on creative projects</li>
              <li>✓ Showcase your work in our gallery</li>
              <li>✓ Build your creative network</li>
              <li>✓ Get compensated for your artistry</li>
            </ul>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center space-y-4">
          <Link href="/artists" className="navbar-link block">
            View Other Artists
          </Link>
          <Link href="/" className="navbar-link block">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
