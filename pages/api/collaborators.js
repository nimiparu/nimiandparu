import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const collabs = await prisma.collaborator.findMany({ orderBy: { name: 'asc' } })
    return res.json(collabs)
  }

  if (req.method === 'POST') {
    const { name, email, role = 'member', workspaceId } = req.body
    const collaborator = await prisma.collaborator.create({
      data: { name, email, role, workspace: { connect: { id: workspaceId } } }
    })
    return res.status(201).json(collaborator)
  }

  res.setHeader('Allow', ['GET','POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
