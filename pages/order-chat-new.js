import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import io from 'socket.io-client'

export default function OrderChat() {
  const router = useRouter()
  const { orderId } = router.query
  
  const [chat, setChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [messageText, setMessageText] = useState('')
  const [sending, setSending] = useState(false)
  const [typingUsers, setTypingUsers] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Initialize chat and socket connection
  useEffect(() => {
    if (!orderId) return

    const initChat = async () => {
      try {
        // Fetch chat and messages
        const res = await fetch(`/api/chat/${orderId}`, {
          headers: { 'x-user-id': 'client' } // In production, use actual user ID
        })

        if (!res.ok) {
          throw new Error('Failed to load chat')
        }

        const data = await res.json()
        setChat(data.chat)
        setMessages(data.messages)

        setLoading(false)

        // Initialize socket connection
        const socket = io(undefined, {
          auth: {
            userId: 'client',
            userName: data.chat.clientName,
            userRole: 'client',
            orderId
          }
        })

        socket.on('connect', () => {
          console.log('Connected to chat')
        })

        socket.on('message:new', (message) => {
          setMessages(prev => [...prev, message])
        })

        socket.on('typing:indicator', (data) => {
          if (data.isTyping) {
            setTypingUsers(prev => {
              if (!prev.find(u => u.userId === data.userId)) {
                return [...prev, data]
              }
              return prev
            })
          } else {
            setTypingUsers(prev => prev.filter(u => u.userId !== data.userId))
          }
        })

        socket.on('user:online', (user) => {
          setOnlineUsers(prev => {
            if (!prev.find(u => u.userId === user.userId)) {
              return [...prev, user]
            }
            return prev
          })
        })

        socket.on('user:offline', (user) => {
          setOnlineUsers(prev => prev.filter(u => u.userId !== user.userId))
        })

        socket.on('message:seen', (data) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === data.messageId
                ? { ...msg, seenBy: data.seenBy }
                : msg
            )
          )
        })

        socketRef.current = socket

        return () => {
          socket.disconnect()
        }
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    initChat()
  }, [orderId])

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mark messages as seen
  useEffect(() => {
    if (socketRef.current && messages.length > 0) {
      messages.forEach(msg => {
        if (msg.senderId !== 'client') {
          socketRef.current.emit('message:seen', { messageId: msg.id })
        }
      })
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!messageText.trim() || !chat) return

    setSending(true)
    try {
      const res = await fetch(`/api/chat/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'client'
        },
        body: JSON.stringify({
          text: messageText,
          senderName: chat.clientName,
          senderRole: 'client'
        })
      })

      if (!res.ok) {
        throw new Error('Failed to send message')
      }

      const message = await res.json()

      // Emit via socket for real-time update
      if (socketRef.current) {
        socketRef.current.emit('message:send', {
          chatId: chat.id,
          text: messageText
        })
      }

      setMessageText('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const handleTyping = () => {
    if (socketRef.current) {
      socketRef.current.emit('typing:start')
      
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit('typing:stop')
      }, 2000)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500" style={{ animation: 'pulse 2s infinite' }}>
              Loading chat...
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-20 pb-20" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-4xl mx-auto px-6 h-screen flex flex-col">
        {/* Header */}
        <div className="card mb-6" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display' }}>
                Order Collaboration Chat
              </h1>
              <p className="text-gray-600 mt-2">{chat?.clientName}</p>
            </div>
            <Link href="/hamper-orders" className="navbar-link text-lg">
              ← Back to Orders
            </Link>
          </div>

          {/* Online Users */}
          {onlineUsers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-2">
                Online:
              </p>
              <div className="flex flex-wrap gap-2">
                {onlineUsers.map(user => (
                  <span
                    key={user.userId}
                    className="badge text-xs"
                  >
                    🟢 {user.userName} ({user.userRole})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-800 font-semibold">Error: {error}</p>
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4 chat-messages">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-gray-500 text-lg">No messages yet. Start the conversation!</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => {
              const isClient = message.senderId === 'client'
              return (
                <div
                  key={message.id}
                  className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}
                  style={{
                    animation: `fadeInUp 0.3s ease-out`
                  }}
                >
                  <div
                    className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-3 ${
                      isClient
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                    style={{
                      boxShadow: isClient
                        ? '0 4px 15px rgba(139, 90, 143, 0.2)'
                        : '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <p className="text-xs font-bold mb-1 opacity-75">
                      {message.senderName}
                    </p>
                    {message.text && (
                      <p className="text-sm leading-relaxed break-words">{message.text}</p>
                    )}
                    {message.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={message.imageUrl}
                          alt="Message attachment"
                          className="rounded-lg max-w-full"
                        />
                      </div>
                    )}
                    <p className={`text-xs mt-2 ${isClient ? 'text-purple-100' : 'text-gray-500'}`}>
                      {new Date(message.createdAt).toLocaleTimeString()}
                      {message.seenBy && JSON.parse(message.seenBy).length > 1 && ' ✓✓'}
                    </p>
                  </div>
                </div>
              )
            })
          )}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <p className="text-xs font-bold text-gray-600 mb-2">
                  {typingUsers.map(u => u.userName).join(', ')} is typing
                </p>
                <div className="flex gap-1">
                  <span style={{ animation: 'pulse 1s infinite' }}>●</span>
                  <span style={{ animation: 'pulse 1s infinite 0.3s' }}>●</span>
                  <span style={{ animation: 'pulse 1s infinite 0.6s' }}>●</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="card">
          <div className="flex gap-3">
            <textarea
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value)
                handleTyping()
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows="2"
              className="flex-1"
              style={{
                borderRadius: '12px',
                padding: '12px',
                resize: 'none'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={sending || !messageText.trim()}
              className="btn-primary px-6 py-3 flex items-center gap-2"
              style={{
                opacity: sending || !messageText.trim() ? 0.5 : 1
              }}
            >
              {sending ? '⏳' : '✈️'} Send
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .chat-messages {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 90, 143, 0.3) transparent;
        }

        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: rgba(139, 90, 143, 0.3);
          border-radius: 3px;
        }

        .chat-messages::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 90, 143, 0.5);
        }
      `}</style>
    </main>
  )
}
