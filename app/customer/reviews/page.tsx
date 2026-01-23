"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Review {
  id: string
  product_id: string
  product_name?: string
  category?: string
  rating: number
  title?: string
  review_text?: string
  created_at: string
}

export default function CustomerReviewsPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/customer/reviews')
        const json = await res.json()
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/customer/login')
            return
          }
          setError(json.error || 'Failed to load reviews')
        } else {
          setReviews(json.reviews || [])
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
          <h1 className="text-2xl md:text-3xl font-bold glow">Your Reviews</h1>
          <Link href="/customer/profile" className="text-primary hover:underline text-xs md:text-sm whitespace-nowrap">Back to profile</Link>
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {error && <div className="p-2 md:p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-xs md:text-sm">{error}</div>}

        {!loading && !error && reviews.length === 0 && (
          <p className="text-gray-400 text-sm">No reviews yet.</p>
        )}

        {!loading && !error && reviews.length > 0 && (
          <div className="space-y-3 md:space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-gradient-to-br from-gray-900 to-black border border-primary/20 rounded-lg md:rounded-xl p-3 md:p-5">
                <div className="flex flex-col sm:flex-row flex-wrap justify-between gap-1 md:gap-2 mb-2 text-xs md:text-sm text-gray-300">
                  <span className="font-semibold text-gray-200 truncate">{r.product_name || r.product_id}</span>
                  <span className="text-primary">{r.category || 'N/A'}</span>
                  <span className="text-xs text-gray-500">{new Date(r.created_at).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400 text-xs md:text-sm mb-2">
                  <span className="font-semibold">{r.rating}★</span>
                  {r.title && <span className="text-gray-200">{r.title}</span>}
                </div>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed">{r.review_text || 'No review text provided.'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
