import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const orders = await prisma.order.findMany({
        include: {
          artists: {
            include: { artist: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      return res.json(orders)
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch orders' })
    }
  }

  if (req.method === 'POST') {
    const { clientName, phoneNumber, budget, occasion, address, artistIds } = req.body

    if (!clientName || !phoneNumber || !budget || !occasion || !address || !artistIds || artistIds.length !== 5) {
      return res.status(400).json({ error: 'Invalid request data' })
    }

    const { street, city, state, postalCode, country } = address
    if (!street || !city || !state || !postalCode || !country) {
      return res.status(400).json({ error: 'Complete delivery address is required' })
    }

    try {
      const order = await prisma.order.create({
        data: {
          title: `${clientName}'s Hamper`,
          description: `Occasion: ${occasion}, Budget: ${budget}`,
          clientName,
          phoneNumber,
          budget,
          occasion,
          deliveryAddress: `${street}, ${city}, ${state} ${postalCode}, ${country}`,
          status: 'PENDING',
          workspaceId: process.env.WORKSPACE_ID || 'default',
          artists: {
            create: artistIds.map((artistId) => ({
              artist: { connect: { id: artistId } }
            }))
          }
        },
        include: {
          artists: { include: { artist: true } }
        }
      })
      return res.status(201).json(order)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Failed to create order' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
