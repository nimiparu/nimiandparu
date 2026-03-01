import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: 'Hamper ID is required' })
  }

  if (req.method === 'GET') {
    try {
      const hamper = await prisma.order.findFirst({
        where: {
          id,
          isPublic: true,
          galleryStatus: 'approved',
          status: 'CONFIRMED'
        },
        include: {
          artists: {
            include: { artist: true }
          }
        }
      })

      if (!hamper) {
        return res.status(404).json({ error: 'Hamper not found or is not public' })
      }

      return res.json(hamper)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Failed to fetch hamper' })
    }
  }

  res.setHeader('Allow', ['GET'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
