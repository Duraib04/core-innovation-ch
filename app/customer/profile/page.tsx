"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface PersonaResponse {
  user?: { id?: string; name?: string; email?: string }
  persona?: {
    persona: string
    tags: string[]
    summary: string
    top_category: string
    avg_order_value: number
    total_spend: number
    order_count: number
    last_order_date?: string
    recency_days: number
    review_count: number
    avg_rating: number
    price_sensitivity: string
    last_updated: string
  }
  error?: string
}

export default function CustomerProfilePage() {
  const router = useRouter()
  const [data, setData] = useState<PersonaResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/customer/persona')
        const json: PersonaResponse = await res.json()
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/customer/login')
            return
          }
          setError(json.error || 'Failed to load profile')
        } else {
          setData(json)
        }
      } catch (e) {
        setError('Connection error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  const persona = data?.persona

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold glow">Your Profile</h1>
          <Link href="/products" className="text-primary hover:underline">Back to products</Link>
        </div>

        {loading && <p className="text-gray-400">Loading...</p>}
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-primary/20 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-2">Account</h2>
              <p className="text-gray-300">{data?.user?.name || 'Customer'}</p>
              <p className="text-gray-400 text-sm">{data?.user?.email}</p>
              <div className="mt-3 flex gap-2 text-sm">
                <Link href="/customer/orders" className="px-3 py-1 rounded-lg bg-primary/20 border border-primary/40 text-primary">View Orders</Link>
                <Link href="/customer/reviews" className="px-3 py-1 rounded-lg bg-secondary/20 border border-secondary/40 text-secondary">View Reviews</Link>
              </div>
            </div>

            {/* Persona */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-primary/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">Persona</h2>
                {persona?.last_updated && (
                  <p className="text-xs text-gray-500">Updated {new Date(persona.last_updated).toLocaleString()}</p>
                )}
              </div>
              <div className="text-2xl font-extrabold mb-3 text-primary">{persona?.persona || 'Prospect'}</div>
              {persona?.summary && <p className="text-gray-300 mb-4">{persona.summary}</p>}

              <div className="flex flex-wrap gap-2">
                {(persona?.tags || ['No Orders']).map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs rounded-full bg-primary/20 border border-primary/40">{tag}</span>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-primary/20 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Shopping Snapshot</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Top Category</p>
                  <p className="text-gray-200 font-semibold">{persona?.top_category || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Price Sensitivity</p>
                  <p className="text-gray-200 font-semibold">{persona?.price_sensitivity || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Orders</p>
                  <p className="text-gray-200 font-semibold">{persona?.order_count ?? 0}</p>
                </div>
                <div>
                  <p className="text-gray-400">Total Spend</p>
                  <p className="text-gray-200 font-semibold">₹ {persona?.total_spend?.toFixed(0) ?? 0}</p>
                </div>
                <div>
                  <p className="text-gray-400">Avg Order Value</p>
                  <p className="text-gray-200 font-semibold">₹ {persona?.avg_order_value?.toFixed(0) ?? 0}</p>
                </div>
                <div>
                  <p className="text-gray-400">Reviews • Rating</p>
                  <p className="text-gray-200 font-semibold">{persona?.review_count ?? 0} • {persona?.avg_rating ?? 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
