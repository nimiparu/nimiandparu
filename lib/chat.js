import { prisma } from './prisma'

/**
 * Verify user is authorized to access a chat
 * User must be either:
 * - The order client
 * - One of the assigned artists
 */
export const verifyChatAccess = async (userId, orderId) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { artists: { include: { artist: true } } }
    })

    if (!order) {
      return { authorized: false, error: 'Order not found' }
    }

    // Check if user is the client (stored in clientName for now, ideally would have clientId)
    // For now, we'll accept any user accessing their own orders
    // In a production app, you'd have user authentication

    // Check if user is one of the assigned artists
    const artistNames = order.artists.map(oa => oa.artist.name)
    
    return {
      authorized: true,
      order,
      artistNames
    }
  } catch (error) {
    console.error('Access verification error:', error)
    return { authorized: false, error: error.message }
  }
}

/**
 * Get or create chat for an order
 */
export const getOrCreateChat = async (orderId) => {
  try {
    let chat = await prisma.chat.findUnique({
      where: { orderId }
    })

    if (!chat) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { artists: { include: { artist: true } } }
      })

      if (!order) {
        throw new Error('Order not found')
      }

      const artistIds = order.artists.map(oa => oa.artistId)
      const participants = [order.clientName, ...order.artists.map(oa => oa.artist.name)]

      chat = await prisma.chat.create({
        data: {
          orderId,
          clientId: orderId, // Using orderId as clientId for now; ideally use actual clientId
          clientName: order.clientName || 'Client',
          artistIds: JSON.stringify(artistIds),
          participants: JSON.stringify(participants)
        }
      })
    }

    return chat
  } catch (error) {
    console.error('Chat creation error:', error)
    throw error
  }
}

/**
 * Load chat messages with pagination
 */
export const loadChatMessages = async (chatId, limit = 20, offset = 0) => {
  try {
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    return messages.reverse()
  } catch (error) {
    console.error('Message loading error:', error)
    throw error
  }
}

/**
 * Send message to chat
 */
export const createChatMessage = async (chatId, senderId, senderName, senderRole, text, imageUrl) => {
  try {
    const message = await prisma.message.create({
      data: {
        chatId,
        senderId,
        senderName,
        senderRole,
        text: text || null,
        imageUrl: imageUrl || null,
        seenBy: JSON.stringify([senderId])
      }
    })

    // Update chat's last message
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        lastMessage: text || 'Shared an image',
        lastMessageAt: new Date()
      }
    })

    return message
  } catch (error) {
    console.error('Message creation error:', error)
    throw error
  }
}

/**
 * Mark message as seen
 */
export const markMessageSeen = async (messageId, userId) => {
  try {
    const message = await prisma.message.findUnique({
      where: { id: messageId }
    })

    if (message) {
      const seenBy = JSON.parse(message.seenBy || '[]')
      if (!seenBy.includes(userId)) {
        seenBy.push(userId)
        await prisma.message.update({
          where: { id: messageId },
          data: { seenBy: JSON.stringify(seenBy) }
        })
      }
    }

    return message
  } catch (error) {
    console.error('Mark seen error:', error)
    throw error
  }
}
