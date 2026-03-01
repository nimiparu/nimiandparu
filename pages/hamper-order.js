import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HamperOrder() {
  const [artists, setArtists] = useState([])
  const [selected, setSelected] = useState([])
  const [clientName, setClientName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [budget, setBudget] = useState('')
  const [occasion, setOccasion] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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

  const toggleArtist = (artistId) => {
    setSelected((prev) => {
      if (prev.includes(artistId)) {
        return prev.filter((id) => id !== artistId)
      } else if (prev.length < 5) {
        return [...prev, artistId]
      }
      return prev
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (selected.length !== 5) {
      setError('Please select exactly 5 artists')
      return
    }

    if (!clientName || !phoneNumber || !budget || !occasion || !street || !city || !state || !postalCode || !country) {
      setError('Please fill in all fields including phone number')
      return
    }

    setSubmitLoading(true)

    try {
      const res = await fetch('/api/hamper-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          phoneNumber,
          budget,
          occasion,
          address: { street, city, state, postalCode, country },
          artistIds: selected
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create order')
      }

      const order = await res.json()
      setSuccess(`Order created! Your order ID: ${order.id}`)
      setClientName('')
      setPhoneNumber('')
      setBudget('')
      setOccasion('')
      setStreet('')
      setCity('')
      setState('')
      setPostalCode('')
      setCountry('')
      setSelected([])
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <main className="min-h-screen pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-12" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display' }}>
            Create Your <span className="gradient-text">Art Hamper</span>
          </h1>
          <p className="text-xl text-gray-600">Curate the perfect gift by selecting five talented artists</p>
        </div>

        {error && (
          <div className="mb-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg" style={{ animation: 'fadeInUp 0.6s ease-out 0.1s backwards' }}>
            <p className="text-red-800 font-semibold">✗ {error}</p>
          </div>
        )}

        {success && (
          <div className="mb-8 p-6 bg-green-50 border-l-4 border-green-500 rounded-lg" style={{ animation: 'fadeInUp 0.6s ease-out 0.1s backwards' }}>
            <p className="text-green-800 font-semibold">✓ {success}</p>
            <Link href="/hamper-orders" className="text-green-700 underline mt-2 inline-block">
              View your orders →
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Client Info Card */}
          <div className="card" style={{ animation: 'fadeInUp 0.6s ease-out 0.2s backwards' }}>
            <h2 className="text-2xl font-bold mb-6">Your Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  placeholder="e.g., +1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                  Budget <span className="text-xs text-gray-500">(To be paid on delivery)</span>
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                  placeholder="e.g., $500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                  Occasion
                </label>
                <input
                  type="text"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  required
                  placeholder="e.g., Corporate gift"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="card" style={{ animation: 'fadeInUp 0.6s ease-out 0.25s backwards' }}>
            <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                  Street Address
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  placeholder="123 Main Street, Apt 4B"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                    State / Province
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    placeholder="NY"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                    placeholder="10001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="card bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200" style={{ animation: 'fadeInUp 0.6s ease-out 0.27s backwards' }}>
            <div className="flex items-center gap-4">
              <div className="text-5xl">💳</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Payment Method</h2>
                <p className="text-lg font-semibold text-gray-800 mb-2">💰 Cash on Delivery</p>
                <p className="text-gray-700">
                  Pay the full amount when your hamper is delivered to your address. No advance payment required. Our delivery team will collect payment upon delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Artist Selection */}
          <div className="card" style={{ animation: 'fadeInUp 0.6s ease-out 0.3s backwards' }}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold">Select Your Artists</h2>
                <p className="text-gray-600 mt-1">Choose exactly 5 artists for your hamper</p>
              </div>
              <div className="text-center px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border-2 border-purple-200">
                <p className="text-sm uppercase tracking-wider font-bold" style={{ color: 'var(--color-primary)' }}>
                  {selected.length}<span className="text-gray-500">/5</span>
                </p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500" style={{ animation: 'pulse 2s infinite' }}>Loading artists...</p>
              </div>
            ) : artists.length === 0 ? (
              <p className="text-center py-12 text-gray-500 text-lg">No artists available yet. Come back soon!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artists.map((artist, index) => (
                  <label
                    key={artist.id}
                    className={`card cursor-pointer transition-all ${
                      selected.includes(artist.id)
                        ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-50 to-pink-50'
                        : 'hover:shadow-lg'
                    } ${selected.length === 5 && !selected.includes(artist.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ animation: `fadeInUp 0.6s ease-out ${0.05 * index}s backwards` }}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(artist.id)}
                        onChange={() => toggleArtist(artist.id)}
                        disabled={selected.length === 5 && !selected.includes(artist.id)}
                        className="mt-2 w-5 h-5 accent-purple-600"
                      />
                      <div className="flex-1">
                        <div className="text-lg font-bold">{artist.name}</div>
                        <a
                          href={`https://instagram.com/${artist.instagramId.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800 font-semibold text-sm inline-flex items-center gap-1 mt-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          📷 {artist.instagramId}
                        </a>
                      </div>
                      {selected.includes(artist.id) && (
                        <div className="text-2xl">✓</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Access Chat Section */}
          <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200" style={{ animation: 'fadeInUp 0.6s ease-out 0.35s backwards' }}>
            <div className="flex items-start gap-6">
              <div className="text-5xl">💬</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Need to Discuss?</h3>
                <p className="text-gray-700 mb-4">Start collaborating with your artist team right now! Access the chat to share ideas, ask questions, and get real-time updates on your hamper creation.</p>
                <Link 
                  href="/hamper-orders"
                  className="hero-btn inline-flex items-center gap-2"
                >
                  💬 Go to Chat
                </Link>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitLoading || selected.length !== 5}
            className="hero-btn w-full py-4 text-lg font-bold"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.4s backwards' }}
          >
            {submitLoading ? '⏳ Creating Your Hamper...' : '✨ Create Hamper Order'}
          </button>
        </form>

        {/* Back Navigation */}
        <div className="mt-12 space-y-6">
          <div className="text-center">
            <Link href="/" className="navbar-link text-lg">
              ← Back to Home
            </Link>
          </div>

          {/* Order Status Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-3">📦</div>
              <h3 className="font-bold text-lg mb-2">Order Placed</h3>
              <p className="text-sm text-gray-600 mb-4">View your placed orders and track their status</p>
              <Link href="/hamper-orders" className="btn-secondary inline-block py-2 px-4">
                View Orders
              </Link>
            </div>
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-3">✅</div>
              <h3 className="font-bold text-lg mb-2">Order Received</h3>
              <p className="text-sm text-gray-600 mb-4">Check your received and completed hampers</p>
              <Link href="/hamper-orders" className="btn-secondary inline-block py-2 px-4">
                View Completed
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
