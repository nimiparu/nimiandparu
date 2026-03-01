import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [orders, setOrders] = useState([])
  const [collabs, setCollabs] = useState([])

  useEffect(() => {
    fetch('/api/orders').then(r => r.json()).then(setOrders)
    fetch('/api/collaborators').then(r => r.json()).then(setCollabs)
  }, [])

  return (
    <main className="container">
      <h1 className="text-2xl font-bold mb-4">Workspace Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">Collaborators</h2>
        <ul className="mt-2">
          {collabs.length === 0 && <li className="text-sm text-gray-500">No collaborators yet.</li>}
          {collabs.map(c => (
            <li key={c.id} className="py-2 border-b">
              <div className="font-medium">{c.name} <span className="text-sm text-gray-500">({c.role})</span></div>
              <div className="text-sm text-gray-600">{c.email}</div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Orders</h2>
        <ul className="mt-2">
          {orders.length === 0 && <li className="text-sm text-gray-500">No orders yet.</li>}
          {orders.map(o => (
            <li key={o.id} className="py-3 border-b">
              <div className="font-medium">{o.title} <span className="text-sm text-gray-500">({o.status})</span></div>
              <div className="text-sm text-gray-600">Qty: {o.quantity}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
