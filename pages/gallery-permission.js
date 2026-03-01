import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function GalleryPermission() {
  const router = useRouter()
  const { orderId } = router.query
  const [order, setOrder] = useState(null)
  const [price, setPrice] = useState('')
  const [isReproducible, setIsReproducible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!orderId) return

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/hamper-orders`)
        if (!res.ok) throw new Error('Failed to fetch order')
        const orders = await res.json()
        const current = orders.find((o) => o.id === orderId)
        if (!current) throw new Error('Order not found')
        setOrder(current)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const handleYes = async () => {
    if (!price) {
      setError('Please enter a price for your hamper')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/gallery-permission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          isPublic: true,
          price,
          isReproducible
        })
      })

      if (!res.ok) throw new Error('Failed to update permission')
      alert('Thank you! Your hamper will be reviewed and added to the gallery soon.')
      router.push('/hamper-orders')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleNo = async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/gallery-permission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          isPublic: false
        })
      })

      if (!res.ok) throw new Error('Failed to update permission')
      router.push('/hamper-orders')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!orderId) {
    return (
      <main className="container">
        <p className="mt-8">Loading...</p>
      </main>
    )
  }

  return (
    <main className="container">
      <div className="mt-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Share Your Hamper with Our Community</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading order details...</p>
        ) : order ? (
          <div className="bg-blue-50 border-2 border-blue-300 rounded p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">🎨 Gallery Showcase Opportunity</h2>
            <p className="text-gray-700 mb-4">
              Your custom hamper "{order.title}" looks amazing! Would you like to showcase it in our public gallery?
            </p>

            <p className="text-gray-600 text-sm mb-6">
              When you showcase your hamper:
            </p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2 mb-6">
              <li>✨ Other clients can see and get inspired by your creation</li>
              <li>🎯 It will be reviewed by our team before going live</li>
              <li>💰 You can set a price to offer this hamper for sale</li>
              <li>🔄 You choose if it can be recreated or is a one-time piece</li>
            </ul>

            {/* Option Yes */}
            <div className="border border-green-300 rounded p-4 mb-4 bg-green-50">
              <h3 className="font-semibold mb-4">✓ YES, I want to showcase my hamper</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selling Price (USD) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g., 1500"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Suggested based on budget: ${order.budget}
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="reproducible"
                    checked={isReproducible}
                    onChange={(e) => setIsReproducible(e.target.checked)}
                    className="mr-3"
                  />
                  <label htmlFor="reproducible" className="text-sm text-gray-700">
                    Others can request a similar customized version of this hamper
                  </label>
                </div>

                <button
                  onClick={handleYes}
                  disabled={submitting || !price}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 font-semibold"
                >
                  {submitting ? 'Processing...' : '✓ Showcase My Hamper'}
                </button>
              </div>
            </div>

            {/* Option No */}
            <div className="border border-gray-300 rounded p-4 bg-gray-50">
              <h3 className="font-semibold mb-4">✕ NO, keep it private</h3>
              <p className="text-sm text-gray-600 mb-4">
                Your hamper will be kept private and only visible to you.
              </p>
              <button
                onClick={handleNo}
                disabled={submitting}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 font-semibold"
              >
                {submitting ? 'Processing...' : '✕ Keep It Private'}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-red-600">Order not found</p>
        )}

        <div className="border-t border-gray-200 pt-6">
          <Link href="/" className="text-gray-600 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
