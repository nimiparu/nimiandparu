import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { orderId, isPublic, price, isReproducible } = req.body

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' })
    }

    try {
      const updateData = {
        isPublic,
        galleryStatus: isPublic ? 'pending' : 'rejected'
      }

      if (isPublic) {
        updateData.price = price
        updateData.isReproducible = isReproducible || false
      }

      const order = await prisma.order.update({
        where: { id: orderId },
        data: updateData,
        include: {
          artists: {
            include: { artist: true }
          }
        }
      })

      return res.json(order)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Failed to update gallery permission' })
    }
  }

  res.setHeader('Allow', ['POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
