"use client"

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PersonaData {
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

interface PersonaResponse {
  user?: { id?: string; name?: string; email?: string }
  persona?: PersonaData
  error?: string
  cached?: boolean
}

export default function CustomerPersonaPage() {
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
          setError(json.error || 'Failed to load persona')
        } else {
          setData(json)
        }
      } catch {
        setError('Connection error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  const persona = data?.persona
  const tags = persona?.tags || []
  const displayName = data?.user?.name || 'Customer'
  const displayEmail = data?.user?.email

  const derived = useMemo(() => {
    if (!persona) return { needs: [], habits: [], characteristics: [], pains: [] }

    const needs: string[] = []
    const habits: string[] = []
    const characteristics: string[] = []
    const pains: string[] = []

    // Needs
    if (persona.price_sensitivity === 'Premium-Leaning') needs.push('Prefers premium options and fast fulfillment')
    if (persona.price_sensitivity === 'Bargain-Seeking') needs.push('Looks for promotions or bundles to justify purchase')
    if (persona.recency_days > 60) needs.push('Needs a nudge to re-engage (offers or new arrivals)')
    if (!needs.length) needs.push('Wants a smooth, predictable shopping experience')

    // Habits
    habits.push('Shops online and values quick comparison')
    if (persona.top_category && persona.top_category !== 'N/A') habits.push(`Regularly explores ${persona.top_category} items`)
    if (persona.price_sensitivity === 'Balanced') habits.push('Balances quality with value when choosing products')
    if (persona.price_sensitivity === 'Bargain-Seeking') habits.push('Waits for deals before checkout')
    if (persona.price_sensitivity === 'Premium-Leaning') habits.push('Leans toward higher-end SKUs when available')

    // Characteristics
    if (persona.review_count > 0) characteristics.push('Leaves feedback after purchases')
    if (persona.order_count >= 3) characteristics.push('Familiar with the catalog; repeats purchases')
    if (persona.avg_order_value >= 2000) characteristics.push('Comfortable with mid/high ticket baskets')
    if (!characteristics.length) characteristics.push('Still early in their journey; learning preferences')

    // Pain points
    if (persona.price_sensitivity === 'Bargain-Seeking') pains.push('Price sensitivity; may abandon if no offer')
    if (persona.recency_days > 60) pains.push('Low recent engagement; needs relevance to return')
    if (persona.top_category === 'N/A') pains.push('Unclear interests; needs better discovery')
    if (!pains.length) pains.push('Needs trust and clarity on value delivered')

    return { needs, habits, characteristics, pains }
  }, [persona])

  const showCard = !loading && !error && persona

  return (
    <div className="min-h-screen bg-[#e8e8e8] text-slate-900 px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-black text-slate-900 mb-2">Buyer Persona</h1>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-600 font-semibold">E-COMMERCE NATION</p>
        </div>

        {error && <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm text-center">{error}</div>}

        {loading && (
          <div className="grid lg:grid-cols-3 gap-5 animate-pulse">
            <div className="h-[600px] rounded-3xl bg-slate-300" />
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <div className="h-[290px] rounded-2xl bg-slate-300" />
              <div className="h-[290px] rounded-2xl bg-slate-300" />
              <div className="h-[290px] rounded-2xl bg-slate-300" />
              <div className="h-[290px] rounded-2xl bg-slate-300" />
            </div>
          </div>
        )}

        {showCard && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Profile Card */}
            <div className="bg-[#d4d0e8] rounded-3xl overflow-hidden shadow-xl">
              {/* Photo placeholder */}
              <div className="h-64 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-slate-400 flex items-center justify-center text-6xl font-bold text-white shadow-lg">
                  {(displayName || 'C')[0]}
                </div>
              </div>

              {/* Info Section */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start border-b border-slate-400/30 pb-3">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Name</p>
                    <p className="text-2xl font-bold text-slate-900">{displayName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-600 mb-1">Age</p>
                    <p className="text-2xl font-bold text-slate-900">—</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-700">📍</span>
                    <span className="text-slate-800">{displayEmail || 'Location unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-700">💼</span>
                    <span className="text-slate-800">{persona.persona}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-700">🏢</span>
                    <span className="text-slate-800">{persona.top_category || 'Various'} Enthusiast</span>
                  </div>
                </div>

                <div className="pt-4 space-y-2 text-sm leading-relaxed">
                  {tags.length > 0 && tags.map((tag) => (
                    <p key={tag} className="text-slate-800">{tag}</p>
                  ))}
                  <p className="text-slate-800">Orders placed: {persona.order_count}</p>
                  <p className="text-slate-800">Total spend: ₹{persona.total_spend?.toFixed(0)}</p>
                  <p className="text-slate-800">Price sensitivity: {persona.price_sensitivity}</p>
                </div>
              </div>
            </div>

            {/* Right: 4 Sections in 2x2 Grid */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              <InfoSection title="Needs" items={derived.needs} />
              <InfoSection title="Shopping habits" items={derived.habits} />
              <InfoSection title="Characteristics" items={derived.characteristics} />
              <InfoSection title="Pain points" items={derived.pains} />
            </div>
          </div>
        )}

        {!loading && !error && !persona && (
          <div className="rounded-2xl border border-slate-300 bg-white p-8 text-slate-700 shadow-sm text-center">
            <p className="font-semibold mb-2 text-lg">No persona yet</p>
            <p className="text-sm text-slate-600">We will build your profile once you start shopping. Place an order to see your persona here.</p>
          </div>
        )}

        {/* Action Buttons */}
        {showCard && (
          <div className="flex justify-center gap-3 text-sm">
            <Link href="/customer/profile" className="px-5 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-semibold transition shadow-md">Profile</Link>
            <Link href="/customer/orders" className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-semibold transition shadow-md">Orders</Link>
            <Link href="/customer/reviews" className="px-5 py-2.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 font-semibold transition shadow-md">Reviews</Link>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-[#d4d0e8] rounded-2xl p-6 shadow-lg h-full">
      <h3 className="text-xl font-bold text-slate-900 mb-4">{title}</h3>
      <ul className="space-y-2.5 text-sm text-slate-800">
        {items.length ? items.map((item, idx) => (
          <li key={idx} className="leading-relaxed">• {item}</li>
        )) : (
          <li className="text-slate-600 italic">No data yet.</li>
        )}
      </ul>
    </div>
  )
}
