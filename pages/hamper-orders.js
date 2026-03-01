import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HamperOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/hamper-orders')
        if (!res.ok) throw new Error('Failed to fetch orders')
        const data = await res.json()
        setOrders(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const statusBadges = {
    DRAFT: { bg: 'bg-gray-100', text: 'text-gray-800', icon: '📝' },
    PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' },
    CONFIRMED: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '✓' },
    SHIPPED: { bg: 'bg-green-100', text: 'text-green-800', icon: '📦' },
    CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', icon: '✗' }
  }

  return (
    <main className="min-h-screen pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display' }}>
            Your <span className="gradient-text">Hamper Orders</span>
          </h1>
          <p className="text-xl text-gray-600">Manage your custom art hamper collaborations</p>
        </div>

        {error && (
          <div className="mb-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg" style={{ animation: 'fadeInUp 0.6s ease-out 0.1s backwards' }}>
            <p className="text-red-800 font-semibold">Error: {error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500" style={{ animation: 'pulse 2s infinite' }}>
              Loading your orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="card text-center py-20">
            <p className="text-2xl text-gray-500 mb-6">No hamper orders yet.</p>
            <Link href="/hamper-order" className="btn-primary inline-block">
              Create Your First Hamper Order
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, index) => {
              const statusBadge = statusBadges[order.status] || statusBadges.DRAFT
              return (
                <div
                  key={order.id}
                  className="card"
                  style={{ animation: `fadeInUp 0.6s ease-out ${0.1 * index}s backwards` }}
                >
                  {/* Top Section */}
                  <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-bold">{order.clientName}'s Hamper</h2>
                        <span
                          className={`badge ${statusBadge.bg} ${statusBadge.text} px-4 py-2`}
                        >
                          {statusBadge.icon} {order.status}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">Order ID: <code className="font-mono">{order.id.substring(0, 8)}...</code></p>
                    </div>
                    <Link
                      href={`/order-chat-new?orderId=${order.id}`}
                      className="hero-btn px-6 py-3 inline-flex items-center gap-2"
                    >
                      💬 Open Chat
                    </Link>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-gray-200">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Phone</p>
                      <p className="text-lg font-bold text-gray-700">
                        {order.phoneNumber || 'Not provided'}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Occasion</p>
                      <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                        {order.occasion || 'Not specified'}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Budget</p>
                      <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                        {order.budget || 'TBD'}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Created</p>
                      <p className="text-lg font-bold text-gray-700">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {order.deliveryAddress && (
                    <div className="mb-8 pb-8 border-b border-gray-200">
                      <h3 className="text-xl font-bold mb-4">Delivery Address</h3>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{order.deliveryAddress}</p>
                      </div>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div className="mb-8 pb-8 border-b border-gray-200">
                    <h3 className="text-xl font-bold mb-4">Payment Details</h3>
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-100 space-y-2">
                      <p className="text-gray-700"><span className="font-semibold">Payment Method:</span> 💰 Cash on Delivery</p>
                      <p className="text-gray-700"><span className="font-semibold">Amount to Pay:</span> {order.budget || 'TBD'}</p>
                      <p className="text-sm text-gray-600">Payment will be collected upon delivery to your address</p>
                    </div>
                  </div>

                  {/* Artist Team */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Your Artist Team</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {order.artists.map(({ artist }) => (
                        <div
                          key={artist.id}
                          className="card group"
                        >
                          <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">👨‍🎨</div>
                          <p className="font-bold text-lg mb-2">{artist.name}</p>
                          <a
                            href={`https://instagram.com/${artist.instagramId.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-800 font-semibold inline-flex items-center gap-1 text-sm"
                          >
                            📷 {artist.instagramId}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* CTA Section */}
        {orders.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-12 text-center border border-purple-200">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display' }}>
              Ready for Another Hamper?
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Create custom art hampers with new artist teams
            </p>
            <Link href="/hamper-order" className="btn-primary inline-block">
              ✨ Create New Hamper
            </Link>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-12 text-center space-y-4">
          <Link href="/hamper-order" className="navbar-link block text-lg">
            Create New Hamper Order
          </Link>
          <Link href="/gallery" className="navbar-link block text-lg">
            Browse Gallery
          </Link>
          <Link href="/" className="navbar-link block text-lg">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
