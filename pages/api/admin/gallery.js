import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  const { status } = req.query

  if (req.method === 'GET') {
    try {
      const where = status ? { galleryStatus: status } : {}
      const hampers = await prisma.order.findMany({
        where,
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
      return res.status(500).json({ error: 'Failed to fetch hampers' })
    }
  }

  if (req.method === 'POST') {
    const { hamperId, action } = req.body

    if (!hamperId || !action) {
      return res.status(400).json({ error: 'Hamper ID and action are required' })
    }

    try {
      const gallerystatus = action === 'approve' ? 'approved' : 'rejected'
      const hamper = await prisma.order.update({
        where: { id: hamperId },
        data: { galleryStatus: gallerystatus },
        include: {
          artists: {
            include: { artist: true }
          }
        }
      })
      return res.json(hamper)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Failed to update hamper' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
