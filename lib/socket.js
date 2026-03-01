import { Server } from 'socket.io'
import { prisma } from './prisma'

let io

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  })

  // Middleware for socket authentication
  io.use((socket, next) => {
    const { userId, userName, userRole, orderId } = socket.handshake.auth
    
    if (!userId || !orderId) {
      return next(new Error('Missing authentication'))
    }
    
    socket.userId = userId
    socket.userName = userName
    socket.userRole = userRole || 'artist'
    socket.orderId = orderId
    socket.room = `order-${orderId}`
    
    next()
  })

  io.on('connection', (socket) => {
    // Join order room
    socket.join(socket.room)
    
    // Broadcast that user is online
    io.to(socket.room).emit('user:online', {
      userId: socket.userId,
      userName: socket.userName,
      userRole: socket.userRole
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

    // Handle new message
    socket.on('message:send', async (data) => {
      try {
        const { text, imageUrl } = data
        
        // Save to database
        const message = await prisma.message.create({
          data: {
            chatId: data.chatId,
            senderId: socket.userId,
            senderName: socket.userName,
            senderRole: socket.userRole,
            text: text || null,
            imageUrl: imageUrl || null,
            seenBy: JSON.stringify([socket.userId])
          }
        })

        // Update chat's last message
        await prisma.chat.update({
          where: { id: data.chatId },
          data: {
            lastMessage: text || 'Shared an image',
            lastMessageAt: new Date()
          }
        })

        // Broadcast to room
        io.to(socket.room).emit('message:new', {
          id: message.id,
          senderId: message.senderId,
          senderName: message.senderName,
          senderRole: message.senderRole,
          text: message.text,
          imageUrl: message.imageUrl,
          createdAt: message.createdAt
        })
      } catch (error) {
        console.error('Message save error:', error)
        socket.emit('error', { message: 'Failed to send message' })
      }
    })

    // Handle message seen
    socket.on('message:seen', async (data) => {
      try {
        const { messageId } = data
        const message = await prisma.message.findUnique({
          where: { id: messageId }
        })

        if (message) {
          const seenBy = JSON.parse(message.seenBy || '[]')
          if (!seenBy.includes(socket.userId)) {
            seenBy.push(socket.userId)
            await prisma.message.update({
              where: { id: messageId },
              data: { seenBy: JSON.stringify(seenBy) }
            })

            io.to(socket.room).emit('message:seen', {
              messageId,
              seenBy
            })
          }
        }
      } catch (error) {
        console.error('Seen update error:', error)
      }
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      io.to(socket.room).emit('user:offline', {
        userId: socket.userId,
        userName: socket.userName
      })
    })
  })

  return io
}

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized')
  }
  return io
}
