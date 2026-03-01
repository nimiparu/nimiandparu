import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } })
    return res.json(orders)
  }

  if (req.method === 'POST') {
    const { title, description, quantity = 1, workspaceId } = req.body
    const order = await prisma.order.create({
      data: { title, description, quantity, workspace: { connect: { id: workspaceId } } }
    })
    return res.status(201).json(order)
  }

  res.setHeader('Allow', ['GET','POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
