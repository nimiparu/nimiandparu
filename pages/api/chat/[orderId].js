import prisma from '../../../lib/prisma'
import { verifyChatAccess, getOrCreateChat, loadChatMessages } from '../../../lib/chat'

export default async function handler(req, res) {
  const { orderId } = req.query

  if (!orderId) {
    return res.status(400).json({ error: 'Order ID required' })
  }

  // GET - Retrieve chat and messages
  if (req.method === 'GET') {
    try {
      // Verify access (in production, extract userId from JWT)
      const userId = req.headers['x-user-id'] || 'client'
      const verified = await verifyChatAccess(userId, orderId)

      if (!verified.authorized) {
        return res.status(403).json({ error: 'Not authorized to access this chat' })
      }

      // Get or create chat
      const chat = await getOrCreateChat(orderId)

      // Load messages
      const limit = req.query.limit ? parseInt(req.query.limit) : 20
      const offset = req.query.offset ? parseInt(req.query.offset) : 0
      const messages = await loadChatMessages(chat.id, limit, offset)

      return res.status(200).json({
        chat,
        messages,
        total: await prisma.message.count({ where: { chatId: chat.id } })
      })
    } catch (error) {
      console.error('Chat GET error:', error)
      return res.status(500).json({ error: error.message })
    }
  }

  // POST - Send message
  if (req.method === 'POST') {
    try {
      const { text, imageUrl, senderName, senderRole } = req.body
      const userId = req.headers['x-user-id'] || 'client'

      // Verify access
      const verified = await verifyChatAccess(userId, orderId)
      if (!verified.authorized) {
        return res.status(403).json({ error: 'Not authorized to send messages' })
      }

      // Get or create chat
      const chat = await getOrCreateChat(orderId)

      // Validate message
      if (!text && !imageUrl) {
        return res.status(400).json({ error: 'Message must contain text or image' })
      }

      // Create message
      const message = await prisma.message.create({
        data: {
          chatId: chat.id,
          senderId: userId,
          senderName: senderName || 'Anonymous',
          senderRole: senderRole || 'artist',
          text: text || null,
          imageUrl: imageUrl || null,
          seenBy: JSON.stringify([userId])
        }
      })

      // Update chat's last message
      await prisma.chat.update({
        where: { id: chat.id },
        data: {
          lastMessage: text || 'Shared an image',
          lastMessageAt: new Date()
        }
      })

      return res.status(201).json(message)
    } catch (error) {
      console.error('Chat POST error:', error)
      return res.status(500).json({ error: error.message })
    }
  }

  res.status(405).json({ error: 'Method not allowed' })
}
