"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface OrderItem {
  id?: string
  product_id: string
  product_name?: string
  category?: string
  quantity: number
  unit_price: number
  subtotal: number
}

interface Order {
  id: string
  order_date: string
  total_amount: number
  status?: string
  shipping_address?: string
  items: OrderItem[]
}

export default function CustomerOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/customer/orders')
        const json = await res.json()
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/customer/login')
            return
          }
          setError(json.error || 'Failed to load orders')
        } else {
          setOrders(json.orders || [])
        }
      } catch {
        setError('Connection error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold glow">Your Orders</h1>
          <Link href="/customer/profile" className="text-primary hover:underline">Back to profile</Link>
        </div>

        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}

        {!loading && !error && orders.length === 0 && (
          <p className="text-gray-400">No orders yet.</p>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-gradient-to-br from-gray-900 to-black border border-primary/20 rounded-xl p-5">
                <div className="flex flex-wrap justify-between gap-2 mb-3 text-sm text-gray-300">
                  <span>Order #{order.id}</span>
                  <span>{new Date(order.order_date).toLocaleString()}</span>
                  {order.status && <span className="text-primary">{order.status}</span>}
                  <span className="font-semibold">₹ {order.total_amount?.toFixed(0)}</span>
                </div>
                {order.shipping_address && (
                  <p className="text-xs text-gray-500 mb-3">Ship to: {order.shipping_address}</p>
                )}
                <div className="space-y-2 text-sm">
                  {order.items.map((it, idx) => (
                    <div key={it.id || idx} className="flex justify-between gap-3 border-b border-gray-800 pb-2">
                      <div>
                        <p className="font-semibold text-gray-200">{it.product_name || it.product_id}</p>
                        <p className="text-gray-500 text-xs">{it.category || 'N/A'}</p>
                      </div>
                      <div className="text-right text-gray-300">
                        <p>Qty: {it.quantity}</p>
                        <p>₹ {it.unit_price?.toFixed(0)}</p>
                        <p className="text-primary">Subtotal: ₹ {it.subtotal?.toFixed(0)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
