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
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] via-[#f7f7f8] to-[#f1f3f6] text-slate-900 px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Customer Persona</p>
            <h1 className="text-3xl font-extrabold text-slate-900">Persona Snapshot</h1>
            {persona?.last_updated && (
              <p className="text-xs text-slate-500 mt-1">Updated {new Date(persona.last_updated).toLocaleString()}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link href="/customer/profile" className="px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-semibold transition">Profile</Link>
            <Link href="/customer/orders" className="px-3 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 font-semibold transition">Orders</Link>
            <Link href="/customer/reviews" className="px-3 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 font-semibold transition">Reviews</Link>
          </div>
        </div>

        {error && <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">{error}</div>}

        {loading && (
          <div className="grid md:grid-cols-5 gap-5 animate-pulse">
            <div className="md:col-span-2 h-[360px] rounded-3xl bg-slate-200" />
            <div className="md:col-span-3 h-[360px] rounded-3xl bg-slate-200" />
          </div>
        )}

        {showCard && (
          <div className="grid md:grid-cols-5 gap-5">
            {/* Visual card */}
            <div className="md:col-span-2 relative rounded-3xl bg-gradient-to-br from-amber-50 via-white to-rose-50 border border-slate-200 shadow-xl overflow-hidden">
              <div className="absolute top-5 left-5 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] tracking-[0.18em] uppercase">Persona</div>
              <div className="h-full flex flex-col justify-between p-6">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-bold">
                    {(displayName || 'C')[0]}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{displayName}</p>
                    <p className="text-sm text-slate-600">{displayEmail || 'Email not available'}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">Current Persona</p>
                    <p className="text-3xl font-bold text-slate-900 leading-tight">{persona.persona}</p>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{persona.summary || 'We are still learning from your activity. Keep shopping to refine your profile.'}</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.length ? tags.map((t) => (
                      <span key={t} className="px-3 py-1 rounded-full text-xs bg-slate-900 text-white font-semibold shadow-sm">
                        {t}
                      </span>
                    )) : (
                      <span className="px-3 py-1 rounded-full text-xs bg-slate-200 text-slate-700">No tags yet</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-slate-700">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Top Category</p>
                    <p className="font-semibold">{persona.top_category || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Price Sensitivity</p>
                    <p className="font-semibold">{persona.price_sensitivity || 'Unknown'}</p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,209,102,0.25),transparent_25%),radial-gradient(circle_at_90%_80%,rgba(244,114,182,0.2),transparent_30%)]" />
            </div>

            {/* Insights */}
            <div className="md:col-span-3 rounded-3xl bg-white/90 backdrop-blur border border-slate-200 shadow-lg p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Section title="Needs" items={derived.needs} accent="slate" />
                <Section title="Shopping Habits" items={derived.habits} accent="amber" />
                <Section title="Characteristics" items={derived.characteristics} accent="indigo" />
                <Section title="Pain Points" items={derived.pains} accent="rose" />
              </div>

              <div className="grid sm:grid-cols-3 md:grid-cols-6 gap-3">
                <Metric label="Orders" value={String(persona.order_count ?? 0)} />
                <Metric label="Total Spend" value={`₹ ${persona.total_spend?.toFixed(0) ?? 0}`} />
                <Metric label="Avg Order" value={`₹ ${persona.avg_order_value?.toFixed(0) ?? 0}`} />
                <Metric label="Recency (days)" value={String(persona.recency_days ?? 0)} />
                <Metric label="Reviews" value={String(persona.review_count ?? 0)} />
                <Metric label="Avg Rating" value={persona.avg_rating ? persona.avg_rating.toFixed(1) : '—'} />
              </div>
            </div>
          </div>
        )}

        {!loading && !error && !persona && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">
            <p className="font-semibold mb-1">No persona yet</p>
            <p className="text-sm text-slate-600">We will build your profile once you start shopping. Place an order to see your persona here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ title, items, accent }: { title: string; items: string[]; accent: 'slate' | 'amber' | 'indigo' | 'rose' | string }) {
  const accentMap: Record<string, string> = {
    slate: 'border-slate-200 bg-slate-50 text-slate-800',
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
    indigo: 'border-indigo-200 bg-indigo-50 text-indigo-900',
    rose: 'border-rose-200 bg-rose-50 text-rose-900'
  }
  return (
    <div className={`rounded-xl border p-4 space-y-2 ${accentMap[accent] || accentMap.slate}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">{title}</p>
      <div className="space-y-1 text-sm">
        {items.length ? items.map((item, idx) => (
          <p key={idx} className="leading-relaxed">• {item}</p>
        )) : <p className="text-slate-500">No data yet.</p>}
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-900">{value}</p>
    </div>
  )
}
