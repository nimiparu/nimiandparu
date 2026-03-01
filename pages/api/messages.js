import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  const { orderId } = req.query

  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' })
  }

  if (req.method === 'GET') {
    try {
      const messages = await prisma.message.findMany({
        where: { orderId },
        orderBy: { createdAt: 'asc' }
      })
      return res.json(messages)
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch messages' })
    }
  }

  if (req.method === 'POST') {
    const { senderName, text } = req.body

    if (!senderName || !text) {
      return res.status(400).json({ error: 'Sender name and message text are required' })
    }

    try {
      const message = await prisma.message.create({
        data: {
          orderId,
          senderName,
          text
        }
      })
      return res.status(201).json(message)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Failed to send message' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
