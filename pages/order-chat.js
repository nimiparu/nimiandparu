import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function OrderChat() {
  const router = useRouter()
  const { orderId } = router.query

  const [order, setOrder] = useState(null)
  const [messages, setMessages] = useState([])
  const [senderName, setSenderName] = useState('')
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sendingLoading, setSendingLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!orderId) return

    const fetchData = async () => {
      try {
        // Fetch order details
        const orderRes = await fetch(`/api/hamper-orders?orderId=${orderId}`)
        if (orderRes.ok) {
          const orders = await orderRes.json()
          const currentOrder = orders.find((o) => o.id === orderId)
          setOrder(currentOrder)
        }

        // Fetch messages
        const messagesRes = await fetch(`/api/messages?orderId=${orderId}`)
        if (!messagesRes.ok) throw new Error('Failed to fetch messages')
        const data = await messagesRes.json()
        setMessages(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [orderId])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    setError('')

    if (!senderName || !messageText) {
      setError('Please enter your name and a message')
      return
    }

    setSendingLoading(true)

    try {
      const res = await fetch(`/api/messages?orderId=${orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderName, text: messageText })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send message')
      }

      const newMessage = await res.json()
      setMessages((prev) => [...prev, newMessage])
      setMessageText('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSendingLoading(false)
    }
  }

  const refreshMessages = async () => {
    try {
      const res = await fetch(`/api/messages?orderId=${orderId}`)
      if (!res.ok) throw new Error('Failed to fetch messages')
      const data = await res.json()
      setMessages(data)
    } catch (err) {
      setError(err.message)
    }
  }

  if (!orderId) {
    return (
      <main className="container">
        <p className="text-gray-500 mt-8">Loading...</p>
      </main>
    )
  }

  return (
    <main className="container">
      <div className="mt-8 max-w-2xl mx-auto">
        {/* Order Header */}
        {loading ? (
          <p className="text-gray-500">Loading chat...</p>
        ) : order ? (
          <>
            <div className="bg-gray-50 p-6 rounded mb-6">
              <h1 className="text-2xl font-bold mb-4">{order.clientName}'s Hamper Chat</h1>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Occasion</p>
                  <p className="font-medium">{order.occasion}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-medium">{order.budget}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Artist Team</p>
                <div className="space-y-1">
                  {order.artists && order.artists.map(({ artist }) => (
                    <p key={artist.id} className="text-sm font-medium">
                      • {artist.name} ({artist.instagramId})
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="bg-white border border-gray-300 rounded p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Chat ({messages.length} messages)</h2>
                <button
                  onClick={refreshMessages}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Refresh
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded text-sm">
                  {error}
                </div>
              )}

              <div className="max-h-96 overflow-y-auto mb-6 border border-gray-200 rounded p-4 bg-gray-50">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="bg-white p-3 rounded border border-gray-200">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-semibold text-sm">{message.senderName}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm text-gray-800">{message.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Send Message Form */}
              <form onSubmit={handleSendMessage} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g., Sarah (Client) or John (Artist)"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sendingLoading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-medium text-sm"
                >
                  {sendingLoading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </>
        ) : (
          <p className="text-red-600">Order not found</p>
        )}

        <div className="space-y-2 border-t border-gray-200 pt-6">
          <Link href="/hamper-orders" className="block text-gray-600 hover:underline text-sm">
            ← Back to orders
          </Link>
          <Link href="/" className="block text-gray-600 hover:underline text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
