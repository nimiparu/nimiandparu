// Custom Next.js server with Socket.io support
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server: SocketIOServer } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Next.js request error:', err)
      res.statusCode = 500
      res.end('Internal server error')
    }
  })

  // Initialize Socket.io
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_BASE_URL || `http://${hostname}:${port}`,
      methods: ['GET', 'POST']
    }
  })

  // Socket.io middleware for authentication
  io.use((socket, next) => {
    const { userId, userName, userRole, orderId } = socket.handshake.auth
    
    if (!userId || !orderId) {
      return next(new Error('Missing authentication parameters'))
    }
    
    socket.userId = userId
    socket.userName = userName || 'Anonymous'
    socket.userRole = userRole || 'artist'
    socket.orderId = orderId
    socket.room = `order-${orderId}`
    
    next()
  })

  // Socket.io connection handlers
  io.on('connection', (socket) => {
    console.log(`User ${socket.userName} connected to order ${socket.orderId}`)
    
    // Join order-specific room
    socket.join(socket.room)
    
    // Broadcast online status
    io.to(socket.room).emit('user:online', {
      userId: socket.userId,
      userName: socket.userName,
      userRole: socket.userRole,
      timestamp: new Date()
    })

    // Handle typing indicator
    socket.on('typing:start', () => {
      socket.broadcast.to(socket.room).emit('typing:indicator', {
        userId: socket.userId,
        userName: socket.userName,
        isTyping: true
      })
    })

    socket.on('typing:stop', () => {
      socket.broadcast.to(socket.room).emit('typing:indicator', {
        userId: socket.userId,
        userName: socket.userName,
        isTyping: false
      })
    })

    // Handle new message - client sends, server broadcasts
    socket.on('message:send', (data) => {
      io.to(socket.room).emit('message:new', {
        id: data.messageId,
        senderId: socket.userId,
        senderName: socket.userName,
        senderRole: socket.userRole,
        text: data.text,
        imageUrl: data.imageUrl,
        createdAt: new Date(),
        seenBy: [socket.userId]
      })
    })

    // Handle message seen status
    socket.on('message:seen', (data) => {
      io.to(socket.room).emit('message:seen', {
        messageId: data.messageId,
        userId: socket.userId,
        timestamp: new Date()
      })
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.userName} disconnected from order ${socket.orderId}`)
      io.to(socket.room).emit('user:offline', {
        userId: socket.userId,
        userName: socket.userName,
        timestamp: new Date()
      })
    })

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  })

  httpServer.listen(port, (err) => {
    if (err) throw err
    console.log(`✓ Server running at http://${hostname}:${port}`)
    console.log(`✓ Socket.io server initialized`)
  })
})
