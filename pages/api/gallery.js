import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch only approved and public hampers
      const hampers = await prisma.order.findMany({
        where: {
          isPublic: true,
          galleryStatus: 'approved',
          status: 'CONFIRMED' // Only completed orders
        },
        include: {
          artists: {
            include: { artist: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      return res.json(hampers)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Failed to fetch gallery hampers' })
    }
  }

  res.setHeader('Allow', ['GET'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
