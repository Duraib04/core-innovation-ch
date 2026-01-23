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
    <div className="min-h-screen bg-black text-white p-3 md:p-6">
      <div className="w-full px-4 md:px-6 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-4">
          <h1 className="text-2xl md:text-3xl font-bold glow">Your Orders</h1>
          <Link href="/customer/profile" className="text-primary hover:underline text-xs md:text-sm whitespace-nowrap">Back to profile</Link>
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {error && <div className="p-2 md:p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-xs md:text-sm">{error}</div>}

        {!loading && !error && orders.length === 0 && (
          <p className="text-gray-400 text-sm">No orders yet.</p>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-3 md:space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-gradient-to-br from-gray-900 to-black border border-primary/20 rounded-lg md:rounded-xl p-3 md:p-5">
                <div className="flex flex-col sm:flex-row flex-wrap justify-between gap-1 md:gap-2 mb-2 md:mb-3 text-xs md:text-sm text-gray-300">
                  <span className="font-semibold">Order #{order.id}</span>
                  <span className="text-gray-500">{new Date(order.order_date).toLocaleString()}</span>
                  {order.status && <span className="text-primary">{order.status}</span>}
                  <span className="font-semibold text-primary">₹ {order.total_amount?.toFixed(0)}</span>
                </div>
                {order.shipping_address && (
                  <p className="text-xs text-gray-500 mb-2 md:mb-3 truncate">Ship to: {order.shipping_address}</p>
                )}
                <div className="space-y-2 md:space-y-2 text-xs md:text-sm">
                  {order.items.map((it, idx) => (
                    <div key={it.id || idx} className="flex justify-between gap-2 md:gap-3 border-b border-gray-800 pb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-200 truncate">{it.product_name || it.product_id}</p>
                        <p className="text-gray-500 text-xs">{it.category || 'N/A'}</p>
                      </div>
                      <div className="text-right text-gray-300 text-xs md:text-sm whitespace-nowrap">
                        <p>Qty: {it.quantity}</p>
                        <p>₹ {it.unit_price?.toFixed(0)}</p>
                        <p className="text-primary">₹ {it.subtotal?.toFixed(0)}</p>
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
