import prisma from '../../lib/prisma'
import { validateInstagramUsername } from '../../lib/instagram'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const artists = await prisma.artist.findMany({
        orderBy: { signedUpAt: 'desc' }
      })
      return res.json(artists)
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch artists' })
    }
  }

  if (req.method === 'POST') {
    const { name, instagramId, artistCategory } = req.body

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Full name is required' })
    }

    if (!instagramId || typeof instagramId !== 'string') {
      return res.status(400).json({ error: 'Instagram handle is required' })
    }

    // Validate category
    const validCategories = ['digital', 'non-digital', 'craft']
    if (!artistCategory || !validCategories.includes(artistCategory)) {
      return res.status(400).json({ error: 'Invalid art category' })
    }

    // Validate and normalize Instagram username
    const validation = validateInstagramUsername(instagramId)
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error })
    }

    try {
      const artist = await prisma.artist.create({
        data: {
          name: name.trim(),
          instagramId: validation.normalized,
          artistCategory: artistCategory
        }
      })
      return res.status(201).json(artist)
    } catch (err) {
      if (err.code === 'P2002') {
        return res.status(400).json({ error: 'This Instagram handle is already registered. Please use a different one.' })
      }
      console.error('Artist creation error:', err)
      return res.status(500).json({ error: 'Failed to create artist account. Please try again.' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
