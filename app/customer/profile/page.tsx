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
    <div className="min-h-screen bg-black text-white p-3 md:p-6">
      <div className="w-full px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-4 mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold glow">Your Profile</h1>
          <Link href="/products" className="text-primary hover:underline text-xs md:text-sm">Back to products</Link>
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {error && (
          <div className="p-2 md:p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-xs md:text-sm">{error}</div>
        )}

        {!loading && !error && (
          <div className="space-y-4 md:space-y-6">
            {/* Basic Info */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-primary/20 rounded-lg md:rounded-xl p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-2">Account</h2>
              <p className="text-gray-300 text-sm md:text-base">{data?.user?.name || 'Customer'}</p>
              <p className="text-gray-400 text-xs md:text-sm truncate">{data?.user?.email}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs md:text-sm">
                <Link href="/customer/orders" className="px-3 py-1.5 md:py-2 rounded-lg bg-primary/20 border border-primary/40 text-primary whitespace-nowrap">View Orders</Link>
                <Link href="/customer/reviews" className="px-3 py-1.5 md:py-2 rounded-lg bg-secondary/20 border border-secondary/40 text-secondary whitespace-nowrap">View Reviews</Link>
              </div>
            </div>

            {/* Persona */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-primary/20 rounded-lg md:rounded-xl p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-3 mb-2 md:mb-3">
                <h2 className="text-lg md:text-xl font-bold">Persona</h2>
                {persona?.last_updated && (
                  <p className="text-xs text-gray-500">Updated {new Date(persona.last_updated).toLocaleString()}</p>
                )}
              </div>
              <div className="text-xl md:text-2xl font-extrabold mb-2 md:mb-3 text-primary">{persona?.persona || 'Prospect'}</div>
              {persona?.summary && <p className="text-gray-300 mb-3 md:mb-4 text-xs md:text-sm">{persona.summary}</p>}

              <div className="flex flex-wrap gap-2">
                {(persona?.tags || ['No Orders']).map((tag) => (
                  <span key={tag} className="px-2 md:px-3 py-1 text-xs rounded-full bg-primary/20 border border-primary/40">{tag}</span>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-primary/20 rounded-lg md:rounded-xl p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Shopping Snapshot</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 text-xs md:text-sm">
                <div>
                  <p className="text-gray-400 text-xs">Top Category</p>
                  <p className="text-gray-200 font-semibold truncate">{persona?.top_category || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Price Sensitivity</p>
                  <p className="text-gray-200 font-semibold truncate">{persona?.price_sensitivity || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Orders</p>
                  <p className="text-gray-200 font-semibold">{persona?.order_count ?? 0}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Total Spend</p>
                  <p className="text-gray-200 font-semibold">₹ {persona?.total_spend?.toFixed(0) ?? 0}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Avg Order</p>
                  <p className="text-gray-200 font-semibold">₹ {persona?.avg_order_value?.toFixed(0) ?? 0}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Reviews • Rating</p>
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
